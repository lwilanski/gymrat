from .idb import IDB


class InMemoryDB(IDB):
    def __init__(self):
        self.users = []
        self.exercises = [
            {
                "name": "Barbell Squat",
                "difficulty": "Advanced",
                "body_part": "Legs",
                "description": "The barbell squat is a compound exercise that works the quads, hamstrings, glutes, lower back, and core. It is a staple in any leg workout."
            },
            {
                "name": "Deadlift",
                "difficulty": "Advanced",
                "body_part": "Back",
                "description": "The deadlift is a compound exercise that works the hamstrings, glutes, lower back, and core. It is a staple in any back workout."
            },
            {
                "name": "Bench Press",
                "difficulty": "Intermediate",
                "body_part": "Chest",
                "description": "The bench press is a compound exercise that works the chest, triceps, and shoulders. It is a staple in any chest workout."
            },
            {
                "name": "Pull-up",
                "difficulty": "Intermediate",
                "body_part": "Back",
                "description": "The pull-up is a bodyweight exercise that works the back, biceps, and shoulders. It is a staple in any back workout."
            },
            {
                "name": "Dumbbell Bicep Curl",
                "difficulty": "Beginner",
                "body_part": "Biceps",
                "description": "The dumbbell bicep curl is an isolation exercise that works the biceps. It is a staple in any bicep workout."
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
    
    def add_description(self, description):
        self.exercises.append(description)
        return description
