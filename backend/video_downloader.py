import yt_dlp
import os
import uuid

def download_video(url, output_dir="."):
    """
    Downloads a video from a URL using yt-dlp.
    Returns the path to the downloaded file and the video title.
    """
    video_id = str(uuid.uuid4())
    output_template = os.path.join(output_dir, f"temp_{video_id}.%(ext)s")
    
    ydl_opts = {
        # 'best' usually selects a single file with both video+audio, 
        # avoiding the need for ffmpeg to merge streams.
        # 'best[ext=mp4]' ensures we get an MP4 file which opencv can read.
        'format': 'best[ext=mp4]/best',
        'outtmpl': output_template,
        'quiet': True,
        'no_warnings': True,
    }

    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=True)
            filename = ydl.prepare_filename(info)
            return filename, info.get('title', 'Unknown Video')
    except Exception as e:
        print(f"Error downloading video: {e}")
        return None, None
