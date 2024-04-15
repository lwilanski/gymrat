from fastapi import APIRouter, Depends
from typing import List, Dict
from ..db.inmemorydb import InMemoryDB

router = APIRouter()


def get_db():
    return InMemoryDB()


@router.get("/exercises", response_model=List[Dict[str, str]])
def get_exercises(db: InMemoryDB = Depends(get_db)):
    return db.get_exercises()


@router.get("/")
def read_root():
    return {"Hello": "World"}
