from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from typing import List
from ..db.mongodb import MongoDB, get_db
from bson import ObjectId
from datetime import datetime

router = APIRouter()


class CalendarWorkout(BaseModel):
    workout_id: str
    date: datetime


class Calendar(BaseModel):
    id: str = Field(..., alias="_id")
    user_id: str
    workouts: List[CalendarWorkout]


@router.get("/calendars/{user_id}", response_model=Calendar)
async def get_calendar(user_id: str, db: MongoDB = Depends(get_db)):
    calendar = await db.get_calendar_by_user(user_id)
    if not calendar:
        raise HTTPException(status_code=404, detail="Calendar not found")
    return calendar


@router.post("/calendars", response_model=Calendar)
async def add_calendar(calendar: Calendar, db: MongoDB = Depends(get_db)):
    calendar_dict = calendar.dict(by_alias=True)
    calendar_dict['_id'] = str(ObjectId())
    calendar_id = await db.add_calendar(calendar_dict)
    return calendar_dict


@router.delete("/calendars/{calendar_id}", response_model=dict)
async def delete_calendar(calendar_id: str, db: MongoDB = Depends(get_db)):
    deleted_count = await db.delete_calendar(calendar_id)
    if deleted_count == 0:
        raise HTTPException(status_code=404, detail="Calendar not found")
    return {"message": "Calendar deleted"}


@router.put("/calendars/{calendar_id}", response_model=Calendar)
async def update_calendar(calendar_id: str, calendar: Calendar, db: MongoDB = Depends(get_db)):
    calendar_dict = calendar.dict(by_alias=True)
    updated = await db.update_calendar(calendar_id, calendar_dict)
    if not updated:
        raise HTTPException(status_code=404, detail="Calendar not found or not updated")
    return calendar_dict


@router.put("/calendars/{calendar_id}/workouts/remove", response_model=Calendar)
async def remove_workout_from_calendar(calendar_id: str, payload: dict, db: MongoDB = Depends(get_db)):
    workout_id = payload.get('workout_id')
    date_str = payload.get('date')
    print("Calendar id: ", calendar_id)
    print("Workout id: ", workout_id)
    print("Date: ", date_str)
    print("Type of Date", type(date_str))

    if not workout_id or not date_str:
        raise HTTPException(status_code=400, detail="workout_id and date are required")

    try:
        date = datetime.fromisoformat(date_str.replace("Z", "+00:00"))
        print("Data po konwersji", date)
        print("Typ daty po konwersji", type(date))
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format")

    success = await db.remove_workout_from_calendar(calendar_id, workout_id, date)
    if not success:
        raise HTTPException(status_code=404, detail="Calendar not found or workout not removed")

    calendar = await db.get_calendar(calendar_id)
    return calendar
