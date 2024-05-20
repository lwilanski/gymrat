from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
import os


class MongoDB:
    def __init__(self):
        self.client = AsyncIOMotorClient(os.getenv("MONGO_URI"))
        self.db = self.client.gymrat

    async def add_exercise(self, exercise):
        result = await self.db.exercises.insert_one(exercise)
        return str(result.inserted_id)

    async def get_exercises(self):
        cursor = self.db.exercises.find({})
        exercises = await cursor.to_list(length=100)
        return exercises

    async def delete_exercise(self, exercise_id):
        result = await self.db.exercises.delete_one({"_id": exercise_id})
        return result.deleted_count

    async def update_exercise(self, exercise_id, update_data):
        result = await self.db.exercises.update_one({"_id": exercise_id}, {"$set": update_data})
        return result.modified_count > 0

    async def add_user(self, user):
        result = await self.db.users.insert_one(user)
        return user['_id']

    async def find_user(self, username):
        user = await self.db.users.find_one({"_id": username})
        return user

    async def update_user(self, username, update_data):
        result = await self.db.users.update_one({"_id": username}, {"$set": update_data})
        return result.modified_count > 0

    async def delete_user(self, username):
        result = await self.db.users.delete_one({"_id": username})
        return result.deleted_count

    async def add_workout(self, workout):
        result = await self.db.workouts.insert_one(workout)
        return str(result.inserted_id)

    async def get_workouts(self):
        cursor = self.db.workouts.find({})
        workouts = await cursor.to_list(length=100)
        return workouts

    async def delete_workout(self, workout_id):
        result = await self.db.workouts.delete_one({"_id": workout_id})
        return result.deleted_count

    async def update_workout(self, workout_id, update_data):
        result = await self.db.workouts.update_one({"_id": workout_id}, {"$set": update_data})
        return result.modified_count > 0

    async def add_calendar(self, calendar):
        result = await self.db.calendars.insert_one(calendar)
        return str(result.inserted_id)

    async def get_calendar(self, user_id):
        calendar = await self.db.calendars.find_one({"user_id": user_id})
        if calendar:
            calendar["id"] = str(calendar["_id"])
        return calendar

    async def update_calendar(self, calendar_id, update_data):
        result = await self.db.calendars.update_one({"_id": calendar_id}, {"$set": update_data})
        return result.modified_count > 0

    async def delete_calendar(self, calendar_id):
        result = await self.db.calendars.delete_one({"_id": calendar_id})
        return result.deleted_count
