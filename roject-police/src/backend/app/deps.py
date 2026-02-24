from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from auth import decode_token

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        return decode_token(token)
    except:
        raise HTTPException(401, "Invalid or expired token")
