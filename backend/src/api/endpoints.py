from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from typing import List, Dict
from ..db.mongodb import MongoDB
import uuid

router = APIRouter()


class Exercise(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
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
    exercise_dict.pop('id', None)  # Usuń id, aby MongoDB mogło automatycznie go dodać
    exercise_id = await db.add_exercise(exercise_dict)
    exercise.id = exercise_id
    return exercise


@router.delete("/exercises/{exercise_id}", response_model=dict)
async def delete_exercise(exercise_id: str, db: MongoDB = Depends(get_db)):
    exercises = await db.get_exercises()
    existing_exercise = any(ex['id'] == exercise_id for ex in exercises)
    if not existing_exercise:
        raise HTTPException(status_code=404, detail="Exercise not found")
    await db.delete_exercise(exercise_id)
    return {"message": "Exercise deleted"}


@router.get("/")
async def read_root():
    return {"Hello": "World"}
