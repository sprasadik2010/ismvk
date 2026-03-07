from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.exc import SQLAlchemyError, OperationalError
from . import routes
from .database import engine, Base
from . import models

# Create database tables with proper error handling
print("Attempting to create database tables...")

try:
    # Try to connect to database and create tables
    Base.metadata.create_all(bind=engine)
    
    # Verify connection by trying a simple query
    with engine.connect() as connection:
        # Check if tables were actually created
        from sqlalchemy import inspect
        inspector = inspect(engine)
        existing_tables = inspector.get_table_names()
        
        expected_tables = ['categories', 'transactions']
        created_tables = [table for table in expected_tables if table in existing_tables]
        
        if len(created_tables) == len(expected_tables):
            print(f"✅ Database tables created successfully: {', '.join(created_tables)}")
        else:
            missing = set(expected_tables) - set(created_tables)
            print(f"⚠️ Some tables are missing: {', '.join(missing)}")
            
except OperationalError as e:
    print("❌ Database connection failed!")
    print(f"   Error: {e}")
    print("   Please check:")
    print("   - Is PostgreSQL running?")
    print("   - Is the database name correct? ('ismvk_db')")
    print("   - Are username/password correct? ('postgres'/'postgres')")
    print("   - Is the host/port correct? ('localhost:5432')")
    
except SQLAlchemyError as e:
    print("❌ Database error occurred!")
    print(f"   Error: {e}")
    
except Exception as e:
    print("❌ Unexpected error!")
    print(f"   Error: {e}")

app = FastAPI(title="Finance Manager API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(routes.router, prefix="/api")

@app.get("/")
def root():
    return {"message": "Finance Manager API"}

@app.get("/health")
def health_check():
    """Enhanced health check that actually tests database connection"""
    try:
        # Try to connect to database
        with engine.connect() as connection:
            # Check if tables exist
            from sqlalchemy import inspect
            inspector = inspect(engine)
            tables = inspector.get_table_names()
            
            return {
                "status": "healthy",
                "database": {
                    "connected": True,
                    "tables_found": tables,
                    "tables_expected": ["categories", "transactions"],
                    "all_tables_present": all(t in tables for t in ["categories", "transactions"])
                }
            }
    except Exception as e:
        return {
            "status": "degraded",
            "database": {
                "connected": False,
                "error": str(e)
            }
        }