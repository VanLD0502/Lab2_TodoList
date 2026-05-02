from fastapi import APIRouter, HTTPException, Header, Depends
from firebase_admin import auth as firebase_auth
from app.schemas.auth import (
    LoginRequest, RegisterRequest, UpdateProfileRequest,
    SetPasswordRequest, UserResponse, UserDetailResponse
)

router = APIRouter()


def get_current_user(authorization: str = Header(...)):
    """Extract and verify Firebase token from Authorization header."""
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid authorization header")
    token = authorization.split("Bearer ")[1]
    try:
        decoded = firebase_auth.verify_id_token(token)
        return decoded
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Invalid token: {str(e)}")


@router.post("/login", response_model=UserResponse)
async def login(request: LoginRequest):
    """Verify Firebase ID token and return user info."""
    try:
        decoded = firebase_auth.verify_id_token(request.token)
        return {
            "uid": decoded["uid"],
            "email": decoded.get("email", ""),
            "name": decoded.get("name", ""),
            "picture": decoded.get("picture", ""),
        }
    except Exception as e:
        print(f"DEBUG AUTH ERROR: {str(e)}")
        raise HTTPException(status_code=401, detail=f"Invalid token: {str(e)}")
@router.post("/register", response_model=UserResponse)
async def register(request: RegisterRequest):
    """Register a new user with email and password."""
    try:
        user_record = firebase_auth.create_user(
            email=request.email,
            password=request.password,
            display_name=request.display_name
        )
        return {
            "uid": user_record.uid,
            "email": user_record.email,
            "name": user_record.display_name or "",
            "picture": ""
        }
    except firebase_auth.EmailAlreadyExistsError:
        raise HTTPException(status_code=400, detail="Email này đã được đăng ký.")
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/me", response_model=UserDetailResponse)
async def me(user: dict = Depends(get_current_user)):
    """Get current user info including providers list."""
    try:
        user_record = firebase_auth.get_user(user["uid"])
        providers = [p.provider_id for p in user_record.provider_data]
        return {
            "uid": user_record.uid,
            "email": user_record.email or "",
            "name": user_record.display_name or "",
            "picture": user_record.photo_url or "",
            "providers": providers,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/profile", response_model=UserDetailResponse)
async def update_profile(request: UpdateProfileRequest, user: dict = Depends(get_current_user)):
    """Update user display name and/or photo URL."""
    try:
        update_args = {}
        if request.display_name is not None:
            update_args["display_name"] = request.display_name
        if request.photo_url is not None:
            update_args["photo_url"] = request.photo_url

        if not update_args:
            raise HTTPException(status_code=400, detail="Không có thông tin nào để cập nhật.")

        user_record = firebase_auth.update_user(user["uid"], **update_args)
        providers = [p.provider_id for p in user_record.provider_data]
        return {
            "uid": user_record.uid,
            "email": user_record.email or "",
            "name": user_record.display_name or "",
            "picture": user_record.photo_url or "",
            "providers": providers,
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/set-password", response_model=UserDetailResponse)
async def set_password(request: SetPasswordRequest, user: dict = Depends(get_current_user)):
    """Set or change password for the current user. Creates password provider if not exists."""
    try:
        if len(request.new_password) < 6:
            raise HTTPException(status_code=400, detail="Mật khẩu phải có ít nhất 6 ký tự.")

        user_record = firebase_auth.update_user(user["uid"], password=request.new_password)
        providers = [p.provider_id for p in user_record.provider_data]
        return {
            "uid": user_record.uid,
            "email": user_record.email or "",
            "name": user_record.display_name or "",
            "picture": user_record.photo_url or "",
            "providers": providers,
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
