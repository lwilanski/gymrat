from abc import ABC, abstractmethod


class IDB(ABC):
    @abstractmethod
    def add_exercise(self, exercise):
        """Add an exercise to the database"""
        pass

    @abstractmethod
    def get_exercises(self):
        """Returns a full list of exercises from the database"""
        pass

    @abstractmethod
    def add_user(self, user):
        """Add a user to the database"""
        pass

    @abstractmethod
    def add_description(self, user):
        """Add a description to the database"""
        pass
