from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from . import routes
from .database import engine, Base
from . import models  # <-- IMPORT YOUR MODELS HERE!

# Create database tables
print("Creating database tables...")
Base.metadata.create_all(bind=engine)
print("Database tables created successfully!")

app = FastAPI(title="Finance Manager API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(routes.router, prefix="/api")

@app.get("/")
def root():
    return {"message": "Finance Manager API"}

# Optional: Add a health check endpoint
@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "database": "connected",
        "tables": {
            "categories": "created",
            "transactions": "created"
        }
    }