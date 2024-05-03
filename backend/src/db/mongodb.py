from bson import ObjectId
from .idb import IDB
from motor.motor_asyncio import AsyncIOMotorClient
import os

class MongoDB(IDB):
    def __init__(self):
        self.client = AsyncIOMotorClient(os.getenv("MONGO_URI"))
        self.db = self.client.gymrat 

    async def add_exercise(self, exercise):
        result = await self.db.exercises.insert_one(exercise)
        return str(result.inserted_id)  # Konwersja ObjectId na string

    async def get_exercises(self):
        cursor = self.db.exercises.find({})
        exercises = await cursor.to_list(length=100)
        return [{**exercise, "_id": str(exercise["_id"])} for exercise in exercises]  # Zamień ObjectId na string

    async def add_user(self, user):
        result = await self.db.users.insert_one(user)
        return str(result.inserted_id)

    async def add_description(self, description):
        result = await self.db.descriptions.insert_one(description)
        return str(result.inserted_id)
