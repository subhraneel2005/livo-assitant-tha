from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routes.router import api_router
import uvicorn
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or ["http://localhost:3000"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

HOST = os.getenv("HOST", "0.0.0.0")
PORT = int(os.getenv("PORT", 8000))

app.include_router(api_router)

if __name__ == "__main__":
    uvicorn.run("server:app",  host=HOST, port=PORT,  reload=True)
    print(f"Starting server at {HOST}:{PORT}")