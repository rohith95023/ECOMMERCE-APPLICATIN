import os
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    PROJECT_NAME: str = "PickPack"
    PORT: int = int(os.getenv("PORT", 4000))
    
    # MongoDB
    MONGODB_URI: str = os.getenv("MONGODB_URI")
    DB_NAME: str = os.getenv("DB_NAME", "pickpack_db")
    
    # JWT
    JWT_SECRET: str = os.getenv("JWT_SECRET", "your_super_secret_jwt_key_here")
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("JWT_ACCESS_TOKEN_EXPIRE_MINUTES", 1440))
    
    # SMTP
    SMTP_SERVICE: str = os.getenv("SMTP_SERVICE")
    SMTP_PORT: int = int(os.getenv("SMTP_PORT", 587))
    SMTP_MAIL: str = os.getenv("SMTP_MAIL")
    SMTP_PASSWORD: str = os.getenv("SMTP_PASSWORD")

settings = Settings()
