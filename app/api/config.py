import os
from pathlib import Path

basedir = Path(__file__).resolve().parent

class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', f'sqlite:///{basedir / "leads.db"}')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
