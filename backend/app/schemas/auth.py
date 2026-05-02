from pydantic import BaseModel
from typing import Optional, List

class LoginRequest(BaseModel):
    token: str

class RegisterRequest(BaseModel):
    email: str
    password: str
    display_name: Optional[str] = None

class UpdateProfileRequest(BaseModel):
    display_name: Optional[str] = None
    photo_url: Optional[str] = None

class SetPasswordRequest(BaseModel):
    new_password: str

class UserResponse(BaseModel):
    uid: str
    email: str
    name: str
    picture: Optional[str] = None

class UserDetailResponse(UserResponse):
    providers: List[str] = []
