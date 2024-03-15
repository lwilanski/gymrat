from fastapi import FastAPI
from typing import List, Dict

app = FastAPI()

# Sample exercise data
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

