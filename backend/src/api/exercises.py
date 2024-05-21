from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from typing import List
from ..db.mongodb import MongoDB, get_db
from bson import ObjectId

router = APIRouter()


class Exercise(BaseModel):
    id: str = Field(..., alias="_id")
    name: str
    difficulty: str
    body_part: str
    description: str
    user: str

    class Config:
        orm_mode = True
        allow_population_by_field_name = True
        json_encoders = {ObjectId: str}


@router.get("/exercises", response_model=List[Exercise])
async def get_exercises(db: MongoDB = Depends(get_db)):
    exercises = await db.get_exercises()
    return exercises


@router.post("/exercises", response_model=Exercise)
async def add_exercise(exercise: Exercise, db: MongoDB = Depends(get_db)):
    exercise_dict = exercise.dict(by_alias=True)
    exercise_dict['_id'] = str(ObjectId())
    exercise_id = await db.add_exercise(exercise_dict)
    return exercise_dict


@router.delete("/exercises/{exercise_id}", response_model=dict)
async def delete_exercise(exercise_id: str, db: MongoDB = Depends(get_db)):
    deleted_count = await db.delete_exercise(exercise_id)
    if deleted_count == 0:
        raise HTTPException(status_code=404, detail="Exercise not found")
    return {"message": "Exercise deleted"}


@router.put("/exercises/{exercise_id}", response_model=Exercise)
async def update_exercise(exercise_id: str, exercise: Exercise, db: MongoDB = Depends(get_db)):
    exercise_dict = exercise.dict(by_alias=True)
    updated = await db.update_exercise(exercise_id, exercise_dict)
    if not updated:
        raise HTTPException(status_code=404, detail="Exercise not found or not updated")
    return exercise_dict
