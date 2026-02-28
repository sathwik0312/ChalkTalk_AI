import stripe
import os
from fastapi import APIRouter, HTTPException, Request
from dotenv import load_dotenv

load_dotenv()

stripe.api_key = os.getenv("STRIPE_SECRET_KEY")
router = APIRouter(prefix="/payments", tags=["payments"])

# Plan ID from your Stripe Dashboard (create a product 'ChalkTalk Pro')
PRO_PLAN_ID = os.getenv("STRIPE_PRO_PLAN_ID", "price_1T5frqPF3pbR4pCx_dummy")

@router.post("/create-checkout-session")
async def create_checkout_session(user_id: str):
    try:
        checkout_session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[
                {
                    'price': PRO_PLAN_ID,
                    'quantity': 1,
                },
            ],
            mode='subscription',
            success_url='https://chalktalk-pro.vercel.app/dashboard?session_id={CHECKOUT_SESSION_ID}',
            cancel_url='https://chalktalk-pro.vercel.app/pricing',
            client_reference_id=user_id
        )
        return {"url": checkout_session.url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/webhook")
async def stripe_webhook(request: Request):
    payload = await request.body()
    sig_header = request.headers.get('stripe-signature')

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, os.getenv("STRIPE_WEBHOOK_SECRET")
        )
    except ValueError:
        return {"error": "Invalid payload"}
    except stripe.error.SignatureVerificationError:
        return {"error": "Invalid signature"}

    # Handle the event (e.g., checkout.session.completed)
    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        # TODO: Update user's subscription status in database.py
        print(f"Payment successful for user: {session['client_reference_id']}")

    return {"status": "success"}
