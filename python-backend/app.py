from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
import shutil
from insightface.app import FaceAnalysis
import insightface
import cv2
import os
import uuid
from gfpgan import GFPGANer
import numpy as np
from PIL import Image
import logging
import time
from supabase import create_client, Client
import io
import warnings
from fastapi.middleware.cors import CORSMiddleware
warnings.filterwarnings("ignore", category=UserWarning, module="onnxruntime")

# Supabase config
SUPABASE_URL = "https://gxfqhxtrellgujqgcmve.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd4ZnFoeHRyZWxsZ3VqcWdjbXZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUyMTU2NzMsImV4cCI6MjA2MDc5MTY3M30.xLzBCmeRw1VpR9olYC3QyzDY83Vpdc3husbORA17BYY"
SUPABASE_BUCKET = "ai-photobooth-swap"

# Create Supabase client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s"
)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Frontend origin (Angular)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Directory setup
UPLOAD_FOLDER = 'uploads'
RESULT_FOLDER = 'results'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(RESULT_FOLDER, exist_ok=True)

# Initialize FaceAnalysis
logger.info("Initializing FaceAnalysis...")
try:
    face_app = FaceAnalysis(name='buffalo_l')
    face_app.prepare(ctx_id=0, det_size=(640, 640))
    logger.info("FaceAnalysis initialized successfully.")
except Exception as e:
    logger.error(f"Error initializing FaceAnalysis: {e}")
    raise

# Initialize Face Swapper
logger.info("Loading Face Swapper model...")
try:
    swapper = insightface.model_zoo.get_model('models/inswapper_128.onnx')
    logger.info("Face Swapper model loaded successfully.")
except Exception as e:
    logger.error(f"Error loading Face Swapper model: {e}")
    raise

# Initialize GFPGAN for face enhancement
logger.info("Loading GFPGAN model...")
try:
    gfpganer = GFPGANer(
        model_path='models/GFPGANv1.4.pth',
        upscale=1,
        arch='clean',
        channel_multiplier=2
    )
    logger.info("GFPGAN model loaded successfully.")
except Exception as e:
    logger.error(f"Error loading GFPGAN model: {e}")
    raise


def load_image(file_path):
    image = cv2.imread(file_path)
    if image is None:
        raise HTTPException(status_code=500, detail=f"Failed to load image: {file_path}")
    logger.info(f"Loaded image: {file_path} with shape {image.shape}")
    return image


# def save_image(image, folder):
#     file_name = f"{uuid.uuid4()}.jpg"
#     file_path = os.path.join(folder, file_name)
#     cv2.imwrite(file_path, image)
#     logger.info(f"Saved result image: {file_path}")
#     return file_path
def save_image_to_supabase(image, folder="ai-photobooth-swap"):
    file_name = f"{uuid.uuid4()}.jpg"

    # Encode image to buffer
    is_success, buffer = cv2.imencode(".jpg", image)
    if not is_success:
        raise Exception("Failed to encode image")

    res = supabase.storage.from_(folder).upload(file_name, buffer.tobytes(), {"content-type": "image/jpeg"})
    print(f"Upload response: {res}")

    
    # Generate the public URL by inserting the file_name
    public_url = f"https://gxfqhxtrellgujqgcmve.supabase.co/storage/v1/object/public/ai-photobooth-swap/{file_name}"
    print(f"Public URL: {public_url}")
    return public_url



def single_face_swap(source_img, target_img, face_app, swapper):
    logger.info("Starting face swap...")
    start_time = time.time()

    faces_src = face_app.get(source_img)
    faces_tgt = face_app.get(target_img)

    logger.info(f"Detected {len(faces_src)} face(s) in source, {len(faces_tgt)} in target.")

    if not faces_src or not faces_tgt:
        return None

    swapped_img = swapper.get(source_img, faces_src[0], faces_tgt[0], paste_back=True)

    elapsed = time.time() - start_time
    logger.info(f"Face swapping completed in {elapsed:.2f} seconds.")
    return swapped_img


def enhance_face(image):
    logger.info("Starting face enhancement...")
    start_time = time.time()

    _, _, restored_img = gfpganer.enhance(image, has_aligned=False, only_center_face=False, paste_back=True)

    elapsed = time.time() - start_time
    logger.info(f"Face enhancement completed in {elapsed:.2f} seconds.")

    if isinstance(restored_img, np.ndarray):
        return restored_img
    else:
        raise HTTPException(status_code=500, detail="Face enhancement failed.")


@app.post("/api/swap-face/")
async def swap_faces(sourceImage: UploadFile = File(...), gender: str = File(...), character: str = File(...)):
    try:
        logger.info(f"Received file: {gender}, {character}")
        process_start = time.time()

        # Save uploaded files with unique names to avoid overwriting
        src_path = os.path.join(UPLOAD_FOLDER, f"{uuid.uuid4()}_{sourceImage.filename}")

        with open(src_path, "wb") as buffer:
            shutil.copyfileobj(sourceImage.file, buffer)

        source_img = load_image(src_path)
        tgt_path = os.path.join(os.getcwd(), "assets", gender, character)

        target_img = load_image(tgt_path)

        swapped_img = single_face_swap(target_img, source_img, face_app, swapper)
        if swapped_img is None:
            raise HTTPException(status_code=400, detail="Face swap failed. No faces detected.")

        enhanced_img = enhance_face(swapped_img)

        result_path = save_image_to_supabase(enhanced_img)

        total_time = time.time() - process_start
        logger.info(f"Total processing time for swap + enhancement: {total_time:.2f} seconds.{result_path}")

        return JSONResponse(content={"url": result_path})


    except Exception as e:
        logger.error(f"Error in /api/swap-face/: {e}")
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="localhost", port=8000)
