from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from typing import List
from ..db.mongodb import MongoDB
from bson import ObjectId
from datetime import date

router = APIRouter()


class Exercise(BaseModel):
    id: str = Field(default_factory=lambda: str(ObjectId()))
    name: str
    difficulty: str
    body_part: str
    description: str

    class Config:
        orm_mode = True
        json_encoders = {ObjectId: str}


class WorkoutExercise(BaseModel):
    exercise_id: str
    sets: int
    reps: int


class Workout(BaseModel):
    id: str = Field(default_factory=lambda: str(ObjectId()))
    name: str
    user_id: str
    exercises: List[WorkoutExercise]

    class Config:
        orm_mode = True
        json_encoders = {ObjectId: str}


class User(BaseModel):
    username: str = Field(..., alias="_id")
    password: str

    class Config:
        allow_population_by_field_name = True
        orm_mode = True
        json_encoders = {ObjectId: str}


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


@router.post("/workouts", response_model=Workout)
async def add_workout(workout: Workout, db: MongoDB = Depends(get_db)):
    workout_dict = workout.dict()
    workout_id = await db.add_workout(workout_dict)
    workout.id = workout_id
    return workout


@router.get("/workouts", response_model=List[Workout])
async def get_workouts(db: MongoDB = Depends(get_db)):
    workouts = await db.get_workouts()
    return workouts


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


@router.post("/users", response_model=User)
async def add_user(user: User, db: MongoDB = Depends(get_db)):
    user_dict = user.dict(by_alias=True)
    print("Received user:", user_dict)
    existing_user = await db.find_user(user_dict['_id'])
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already exists")
    user_id = await db.add_user(user_dict)
    return user


@router.get("/")
async def read_root():
    return {"Hello": "World"}



class WorkoutSchedule(BaseModel):
    id: str = Field(default_factory=lambda: str(ObjectId()))
    user_id: str
    workout_id: str
    date: date

    class Config:
        orm_mode = True
        json_encoders = {ObjectId: str}



@router.post("/workout-schedules", response_model=WorkoutSchedule)
async def add_workout_schedule(workout_schedule: WorkoutSchedule, db: MongoDB = Depends(get_db)):
    schedule_dict = workout_schedule.dict()
    schedule_id = await db.add_workout_schedule(schedule_dict)
    workout_schedule.id = schedule_id
    return workout_schedule

@router.get("/workout-schedules", response_model=List[WorkoutSchedule])
async def get_workout_schedules(db: MongoDB = Depends(get_db)):
    schedules = await db.get_workout_schedules()
    return schedules

@router.get("/workout-schedules/{user_id}", response_model=List[WorkoutSchedule])
async def get_user_workout_schedules(user_id: str, db: MongoDB = Depends(get_db)):
    schedules = await db.get_user_workout_schedules(user_id)
    return schedules

@router.delete("/workout-schedules/{schedule_id}", response_model=dict)
async def delete_workout_schedule(schedule_id: str, db: MongoDB = Depends(get_db)):
    deleted_count = await db.delete_workout_schedule(schedule_id)
    if deleted_count == 0:
        raise HTTPException(status_code=404, detail="Workout schedule not found")
    return {"message": "Workout schedule deleted"}

@router.put("/workout-schedules/{schedule_id}", response_model=WorkoutSchedule)
async def update_workout_schedule(schedule_id: str, workout_schedule: WorkoutSchedule, db: MongoDB = Depends(get_db)):
    updated = await db.update_workout_schedule(schedule_id, workout_schedule.dict())
    if not updated:
        raise HTTPException(status_code=404, detail="Workout schedule not found or not updated")
    workout_schedule.id = schedule_id
    return workout_schedule
