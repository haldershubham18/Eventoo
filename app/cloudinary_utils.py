
import os
import cloudinary
import cloudinary.uploader
from fastapi import UploadFile, HTTPException

cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
    secure=True,
)

ALLOWED_CONTENT_TYPES = {"image/jpeg", "image/png", "image/webp", "image/jpg"}
MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024  # 5 MB


async def upload_payment_screenshot(file: UploadFile, registration_id: str) -> dict:
    """Validates and uploads a payment screenshot to Cloudinary.
    Returns {"url": ..., "public_id": ...}."""

    if file.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type '{file.content_type}'. Use JPEG, PNG, or WEBP.",
        )

    contents = await file.read()
    if len(contents) > MAX_FILE_SIZE_BYTES:
        raise HTTPException(status_code=400, detail="File too large. Max 5MB.")

    try:
        result = cloudinary.uploader.upload(
            contents,
            folder="eventoo/payment_screenshots",
            public_id=registration_id,
            overwrite=True,
            resource_type="image",
        )
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Cloudinary upload failed: {e}")

    return {"url": result["secure_url"], "public_id": result["public_id"]}
