from .idb import IDB


class InMemoryDB(IDB):
    def __init__(self):
        self.users = []
        self.exercises = [
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

    def add_user(self, user):
        self.users.append(user)
        return user

    def add_exercise(self, exercise):
        self.exercises.append(exercise)
        return exercise

    def get_exercises(self):
        return self.exercises
