from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from typing import List, Dict
from ..db.inmemorydb import InMemoryDB
import uuid

router = APIRouter()


class Exercise(BaseModel):
    id: uuid.UUID = Field(default_factory=uuid.uuid4)
    name: str
    difficulty: str
    body_part: str
    description: str


def get_db():
    return InMemoryDB()


@router.get("/exercises", response_model=List[Dict[str, str]])
def get_exercises(db: InMemoryDB = Depends(get_db)):
    return db.get_exercises()


@router.post("/exercises", response_model=Exercise)
def add_exercise(exercise: Exercise, db: InMemoryDB = Depends(get_db)):
    return db.add_exercise(exercise.dict())


@router.delete("/exercises/{exercise_id}", response_model=dict)
def delete_exercise(exercise_id: uuid.UUID, db: InMemoryDB = Depends(get_db)):
    existing_exercise = any(ex.id == exercise_id for ex in db.get_exercises())
    if not existing_exercise:
        raise HTTPException(status_code=404, detail="Exercise not found")
    return db.delete_exercise(exercise_id)


@router.get("/")
def read_root():
    return {"Hello": "World"}
