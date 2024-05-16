from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from typing import List
from ..db.mongodb import MongoDB
from bson import ObjectId

router = APIRouter()

class Exercise(BaseModel):
    id: str = Field(default_factory=lambda: str(ObjectId()))
    name: str
    difficulty: str
    body_part: str
    description: str

def get_db():
    return MongoDB()

@router.get("/exercises", response_model=List[Exercise])
async def get_exercises(db: MongoDB = Depends(get_db)):
    exercises = await db.get_exercises()
    return exercises

@router.post("/exercises", response_model=Exercise)
async def add_exercise(exercise: Exercise, db: MongoDB = Depends(get_db)):
    exercise_dict = exercise.dict()
    exercise_id = await db.add_exercise(exercise_dict)
    exercise.id = exercise_id
    return exercise

@router.delete("/exercises/{exercise_id}", response_model=dict)
async def delete_exercise(exercise_id: str, db: MongoDB = Depends(get_db)):
    deleted_count = await db.delete_exercise(exercise_id)
    if deleted_count == 0:
        raise HTTPException(status_code=404, detail="Exercise not found")
    return {"message": "Exercise deleted"}

@router.put("/exercises/{exercise_id}", response_model=Exercise)
async def update_exercise(exercise_id: str, exercise: Exercise, db: MongoDB = Depends(get_db)):
    updated = await db.update_exercise(exercise_id, exercise.dict())
    if not updated:
        raise HTTPException(status_code=404, detail="Exercise not found or not updated")
    exercise.id = exercise_id
    return exercise

@router.get("/")
async def read_root():
    return {"Hello": "World"}
