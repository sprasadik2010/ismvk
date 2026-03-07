from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
from datetime import datetime
from . import models, schemas
from .database import get_db

router = APIRouter()

# Category endpoints
@router.post("/categories/", response_model=schemas.Category)
def create_category(category: schemas.CategoryCreate, db: Session = Depends(get_db)):
    db_category = models.Category(**category.dict())
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category

@router.get("/categories/", response_model=List[schemas.Category])
def get_categories(
    department: Optional[schemas.DepartmentEnum] = None,
    db: Session = Depends(get_db)
):
    query = db.query(models.Category)
    if department:
        query = query.filter(models.Category.department == department)
    return query.all()

# Transaction endpoints
@router.post("/transactions/", response_model=schemas.Transaction)
def create_transaction(transaction: schemas.TransactionCreate, db: Session = Depends(get_db)):
    db_transaction = models.Transaction(**transaction.dict())
    db.add(db_transaction)
    db.commit()
    db.refresh(db_transaction)
    return db_transaction

@router.get("/transactions/", response_model=List[schemas.Transaction])
def get_transactions(
    department: Optional[schemas.DepartmentEnum] = None,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    db: Session = Depends(get_db)
):
    query = db.query(models.Transaction)
    
    if department:
        query = query.filter(models.Transaction.department == department)
    if start_date:
        query = query.filter(models.Transaction.date >= start_date)
    if end_date:
        query = query.filter(models.Transaction.date <= end_date)
    
    return query.order_by(models.Transaction.date.desc()).all()

@router.get("/balance-sheet/{department}", response_model=schemas.BalanceSheet)
def get_balance_sheet(
    department: schemas.DepartmentEnum,
    start_date: datetime = Query(...),
    end_date: datetime = Query(...),
    db: Session = Depends(get_db)
):
    transactions = db.query(models.Transaction).filter(
        models.Transaction.department == department,
        models.Transaction.date >= start_date,
        models.Transaction.date <= end_date
    ).all()
    
    total_income = sum(t.amount for t in transactions if t.type == "INCOME")
    total_expenditure = sum(t.amount for t in transactions if t.type == "EXPENDITURE")
    balance = total_income - total_expenditure
    
    return schemas.BalanceSheet(
        department=department,
        total_income=total_income,
        total_expenditure=total_expenditure,
        balance=balance,
        transactions=transactions,
        period_start=start_date,
        period_end=end_date
    )

@router.get("/dashboard/")
def get_dashboard_data(
    db: Session = Depends(get_db),
    days: int = Query(30, description="Number of days to look back")
):
    end_date = datetime.now()
    start_date = datetime.now().replace(day=max(1, end_date.day - days))
    
    result = {}
    for dept in schemas.DepartmentEnum:
        balance_sheet = get_balance_sheet(dept, start_date, end_date, db)
        result[dept.value] = {
            "balance": balance_sheet.balance,
            "income": balance_sheet.total_income,
            "expenditure": balance_sheet.total_expenditure,
            "recent_transactions": balance_sheet.transactions[:5]
        }
    
    return result