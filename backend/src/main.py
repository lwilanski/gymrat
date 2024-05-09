from fastapi import FastAPI
from .api.endpoints import router
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os  # Import needed to access environment variables

app = FastAPI()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/gymrat")

client = AsyncIOMotorClient(MONGO_URI)
db = client.gymrat

origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(router)

@app.on_event("startup")
async def startup_event():
    print("Application start!")
    # Here you could add code to check database connectivity or initialize something

@app.on_event("shutdown")
def shutdown_event():
    client.close()
    print("Application shutdown!")

