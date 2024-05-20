from fastapi import FastAPI
from .api.endpoints import router as exercises_router
from .api.authenticate import router as auth_router
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os

app = FastAPI()

# Use environment variable for MongoDB URI
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/gymrat")
client = AsyncIOMotorClient(MONGO_URI)
db = client.gymrat

# Configure CORS
origins = [
    "http://localhost:3000",  # Frontend host
    "http://127.0.0.1:3000"  # Include this if you're accessing via localhost IP
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"]
)

# Include both routers
app.include_router(exercises_router)
app.include_router(auth_router)



@app.on_event("startup")
async def startup_event():
    print("Application start!")


@app.on_event("shutdown")
def shutdown_event():
    client.close()
    print("Application shutdown!")
