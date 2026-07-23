import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

basedir = Path(__file__).resolve().parent


class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-key")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", SECRET_KEY)
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL", f"sqlite:///{basedir / 'leads.db'}")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    CORS_HEADERS = "Content-Type"
    JSON_SORT_KEYS = False
    PROPAGATE_EXCEPTIONS = True
