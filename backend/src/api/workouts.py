from typing import List, Optional
from pydantic import BaseModel, Field
from fastapi import APIRouter, Depends, HTTPException
from ..db.mongodb import MongoDB
from bson import ObjectId



router = APIRouter()


class ExerciseInWorkout(BaseModel):
    exercise_id: str
    repetitions: int
    sets: int
    rest: str

class Workout(BaseModel):
    id: str = Field(default_factory=lambda: str(ObjectId()))
    user_id: str
    name: str
    description: str
    exercises: List[ExerciseInWorkout]


def get_db():
    return MongoDB()


@router.get("/workouts", response_model=List[Workout])
async def get_workouts(db: MongoDB = Depends(get_db)):
    return await db.get_workouts()

@router.post("/workouts", response_model=Workout)
async def add_workout(workout: Workout, db: MongoDB = Depends(get_db)):
    workout_dict = workout.dict()  
    workout_id = await db.add_workout(workout_dict)
    workout.id = workout_id
    return workout

@router.delete("/workouts/{workout_id}", response_model=dict)
async def delete_workout(workout_id: str, db: MongoDB = Depends(get_db)):
    deleted_count = await db.delete_workout(workout_id)
    if deleted_count == 0:
        raise HTTPException(status_code=404, detail="Workout not found")
    return {"message": "Workout deleted"}

@router.put("/workouts/{workout_id}", response_model=Workout)
async def update_workout(workout_id: str, workout: Workout, db: MongoDB = Depends(get_db)):
    updated = await db.update_workout(workout_id, workout.dict())
    if not updated:
        raise HTTPException(status_code=404, detail="Workout not found or not updated")
    workout.id = workout_id
    return workout