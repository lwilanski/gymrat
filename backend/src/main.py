from fastapi import FastAPI
from .api.exercises import router as exercises_router
from .api.users import router as users_router
from .api.workouts import router as workouts_router
from .api.calendar import router as calendar_router
from .api.authenticate import router as auth_router
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os

app = FastAPI()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/gymrat")
client = AsyncIOMotorClient(MONGO_URI)
db = client.gymrat

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"]
)

app.include_router(exercises_router)
app.include_router(users_router)
app.include_router(workouts_router)
app.include_router(calendar_router)
app.include_router(auth_router)


@app.on_event("startup")
async def startup_event():
    print("Application start!")


@app.on_event("shutdown")
def shutdown_event():
    client.close()
    print("Application shutdown!")
