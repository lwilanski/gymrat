from fastapi import FastAPI
from typing import List, Dict
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()


origins = [
    "http://localhost:3000",  # Dopuszczalne źródło dla naszej aplikacji React
    # Dodaj inne domeny, z których chcesz zezwolić na dostęp, jeśli to konieczne
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Można użyć ["*"] dla testów deweloperskich, ale nie jest to zalecane w produkcji
    allow_credentials=True,
    allow_methods=["*"],  # Metody HTTP, na które zezwalamy
    allow_headers=["*"],  # Nagłówki HTTP, na które zezwalamy
)
exercises = [
    {
        "name": "Barbell Squat",
        "difficulty": "Advanced",
        "body_part": "Legs"
    },
    {
        "name": "Deadlift",
        "difficulty": "Advanced",
        "body_part": "Back"
    },
    {
        "name": "Bench Press",
        "difficulty": "Intermediate",
        "body_part": "Chest"
    },
    {
        "name": "Pull-up",
        "difficulty": "Intermediate",
        "body_part": "Back"
    },
    {
        "name": "Dumbbell Bicep Curl",
        "difficulty": "Beginner",
        "body_part": "Biceps"
    }
]

@app.get("/exercises", response_model=List[Dict[str, str]])
def get_exercises():
    
    return exercises

@app.get("/")
def read_root():
    return {"Hello": "World"}

