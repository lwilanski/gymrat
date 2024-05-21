from typing import List

from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field

from ..db.mongodb import MongoDB, get_db

router = APIRouter()


class WorkoutExercise(BaseModel):
    exercise_id: str
    sets: int
    reps: int


class Workout(BaseModel):
    id: str = Field(..., alias="_id")
    name: str
    user_id: str
    exercises: List[WorkoutExercise]

    class Config:
        orm_mode = True
        allow_population_by_field_name = True
        json_encoders = {ObjectId: str}


@router.get("/workouts", response_model=List[Workout])
async def get_workouts(db: MongoDB = Depends(get_db)):
    workouts = await db.get_workouts()
    return workouts


@router.post("/workouts", response_model=Workout)
async def add_workout(workout: Workout, db: MongoDB = Depends(get_db)):
    workout_dict = workout.dict(by_alias=True)
    workout_dict['_id'] = str(ObjectId())
    workout_id = await db.add_workout(workout_dict)
    return workout_dict


@router.put("/workouts/{workout_id}", response_model=Workout)
async def update_workout(workout_id: str, workout: Workout, db: MongoDB = Depends(get_db)):
    workout_dict = workout.dict(by_alias=True)
    updated = await db.update_workout(workout_id, workout_dict)
    if not updated:
        raise HTTPException(status_code=404, detail="Workout not found or not updated")
    return workout_dict


@router.delete("/workouts/{workout_id}", response_model=dict)
async def delete_workout(workout_id: str, db: MongoDB = Depends(get_db)):
    deleted_count = await db.delete_workout(workout_id)
    if deleted_count == 0:
        raise HTTPException(status_code=404, detail="Workout not found")
    return {"message": "Workout deleted"}
