from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import List, Dict
from ..db.inmemorydb import InMemoryDB

router = APIRouter()


class Exercise(BaseModel):
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


@router.get("/")
def read_root():
    return {"Hello": "World"}
