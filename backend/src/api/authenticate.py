from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from ..db.mongodb import MongoDB

router = APIRouter()


class AuthDetails(BaseModel):
    username: str
    password: str


@router.post("/auth")  
async def authenticate(auth_details: AuthDetails, db: MongoDB = Depends(MongoDB)):
    user = await db.find_user(auth_details.username)
    if user and user['password'] == auth_details.password:
        return {"message": "Logged in successfully"}
    else:
        raise HTTPException(status_code=401, detail="Incorrect username or password")
