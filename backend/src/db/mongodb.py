from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorClient
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
        return [{**exercise, "_id": str(exercise["_id"])} for exercise in exercises]

    async def delete_exercise(self, exercise_id):
        result = await self.db.exercises.delete_one({"_id": ObjectId(exercise_id)})
        return result.deleted_count

    async def update_exercise(self, exercise_id, update_data):
        result = await self.db.exercises.update_one({"_id": ObjectId(exercise_id)}, {"$set": update_data})
        return result.modified_count > 0


    async def add_user(self, user):
        result = await self.db.users.insert_one(user)
        return str(result.inserted_id)

    async def find_user(self, username):
        return await self.db.users.find_one({"username": username})

    async def update_user(self, username, update_data):
        return await self.db.users.update_one({"username": username}, {"$set": update_data})

    async def delete_user(self, username):
        return await self.db.users.delete_one({"username": username})
