from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field

from ..db.mongodb import MongoDB, get_db

router = APIRouter()


class User(BaseModel):
    username: str = Field(..., alias="_id")
    password: str

    class Config:
        allow_population_by_field_name = True
        orm_mode = True
        json_encoders = {ObjectId: str}


@router.post("/users", response_model=User)
async def add_user(user: User, db: MongoDB = Depends(get_db)):
    user_dict = user.dict(by_alias=True)
    print("Received user:", user_dict)
    existing_user = await db.find_user(user_dict['_id'])
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already exists")
    user_id = await db.add_user(user_dict)
    return user
