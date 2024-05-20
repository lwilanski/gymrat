from motor.motor_asyncio import AsyncIOMotorClient
import os


class MongoDB:
    def __init__(self):
        self.client = AsyncIOMotorClient(os.getenv("MONGO_URI"))
        self.db = self.client.gymrat

    async def add_exercise(self, exercise):
        exercise['_id'] = exercise['id']
        result = await self.db.exercises.insert_one(exercise)
        return exercise['id']

    async def get_exercises(self):
        cursor = self.db.exercises.find({})
        exercises = await cursor.to_list(length=100)
        return [{**exercise, "id": str(exercise["_id"])} for exercise in exercises]

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
        workout['_id'] = workout['id']
        result = await self.db.workouts.insert_one(workout)
        return workout['id']

    async def get_workouts(self):
        cursor = self.db.workouts.find({})
        workouts = await cursor.to_list(length=100)
        return [{**workout, "id": str(workout["_id"])} for workout in workouts]

    async def delete_workout(self, workout_id):
        result = await self.db.workouts.delete_one({"_id": workout_id})
        return result.deleted_count

    async def update_workout(self, workout_id, update_data):
        result = await self.db.workouts.update_one({"_id": workout_id}, {"$set": update_data})
        return result.modified_count > 0

    async def add_workout_schedule(self, schedule: dict):
        result = await self.db["workout_schedules"].insert_one(schedule)
        return str(result.inserted_id)

    async def get_workout_schedules(self):
        schedules = await self.db["workout_schedules"].find().to_list(length=None)
        return schedules

    async def get_user_workout_schedules(self, user_id: str):
        schedules = await self.db["workout_schedules"].find({"user_id": user_id}).to_list(length=None)
        return schedules

    async def delete_workout_schedule(self, schedule_id: str):
        result = await self.db["workout_schedules"].delete_one({"_id": ObjectId(schedule_id)})
        return result.deleted_count

    async def update_workout_schedule(self, schedule_id: str, schedule: dict):
        result = await self.db["workout_schedules"].update_one({"_id": ObjectId(schedule_id)}, {"$set": schedule})
        return result.modified_count > 0