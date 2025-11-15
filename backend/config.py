import os
from dotenv import load_dotenv

load_dotenv()  # Loads variables from .env

DATABASE_URL = os.getenv("DATABASE_URL")        
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
