from fastapi import APIRouter

router = APIRouter()

fake_db = []

@router.post("/register")
def register(user: dict):
    fake_db.append(user)
    return {"message": "Citizen registered"}
