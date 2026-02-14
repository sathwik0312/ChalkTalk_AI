import cv2
import pytesseract
import numpy as np

def classify_content(frame_path):
    """
    Classifies a frame as 'static_slide' or 'active_writing' based on text analysis.
    """
    try:
        if isinstance(frame_path, str):
            img = cv2.imread(frame_path)
        else:
            img = frame_path # Assume it's already a numpy array

        # Convert to grayscale
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        
        # Use Tesseract to get data
        # Output dict has: 'level', 'page_num', 'block_num', 'par_num', 'line_num', 'word_num', 'left', 'top', 'width', 'height', 'conf', 'text'
        data = pytesseract.image_to_data(gray, output_type=pytesseract.Output.DICT)
        
        # Analyze alignment and font consistency
        # Heuristic 1: Perfect horizontal alignment suggests slides
        # Heuristic 2: 'Chalk' noise or irregular thickness suggests board
        
        # For MVP, let's look at confidence and text density
        n_boxes = len(data['text'])
        high_conf_words = 0
        total_conf = 0
        
        for i in range(n_boxes):
            if int(data['conf'][i]) > 60:
                high_conf_words += 1
                total_conf += int(data['conf'][i])
        
        # If text is extremely clean (high confidence), likely a slide
        # If text is messy but present, likely handwriting
        
        avg_conf = total_conf / high_conf_words if high_conf_words > 0 else 0
        
        if avg_conf > 85:
            return "static_slide"
        else:
            return "active_writing"
            
    except pytesseract.TesseractNotFoundError:
        print("Tesseract not found. Install it to enable OCR features.")
        return "unknown_no_ocr"
    except Exception as e:
        print(f"OCR Error: {e}")
        return "error"
