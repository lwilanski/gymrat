from fastapi import APIRouter

router = APIRouter()

user_db = {
    "minch@agh.edu.pl": "password1",
}


@router.get("/auth", response_model=str)
def authenticate(username: str, password: str):
    if username in user_db:
        if password == user_db[username]:
            return username
    return ""
