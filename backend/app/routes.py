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

@router.get("/categories/{category_id}", response_model=schemas.Category)
def get_category(category_id: int, db: Session = Depends(get_db)):
    category = db.query(models.Category).filter(models.Category.id == category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    return category

@router.put("/categories/{category_id}", response_model=schemas.Category)
def update_category(
    category_id: int, 
    category_update: schemas.CategoryCreate, 
    db: Session = Depends(get_db)
):
    category = db.query(models.Category).filter(models.Category.id == category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    for key, value in category_update.dict().items():
        setattr(category, key, value)
    
    db.commit()
    db.refresh(category)
    return category

@router.delete("/categories/{category_id}")
def delete_category(category_id: int, db: Session = Depends(get_db)):
    category = db.query(models.Category).filter(models.Category.id == category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    # Check if category has transactions
    transactions_count = db.query(models.Transaction).filter(
        models.Transaction.category_id == category_id
    ).count()
    
    if transactions_count > 0:
        raise HTTPException(
            status_code=400, 
            detail="Cannot delete category with existing transactions. Please reassign or delete transactions first."
        )
    
    db.delete(category)
    db.commit()
    return {"message": "Category deleted successfully"}

# Transaction endpoints
@router.post("/transactions/", response_model=schemas.Transaction)
def create_transaction(transaction: schemas.TransactionCreate, db: Session = Depends(get_db)):
    # Verify category exists
    category = db.query(models.Category).filter(models.Category.id == transaction.category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    
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
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    db: Session = Depends(get_db)
):
    query = db.query(models.Transaction)
    
    if department:
        query = query.filter(models.Transaction.department == department)
    if start_date:
        query = query.filter(models.Transaction.date >= start_date)
    if end_date:
        query = query.filter(models.Transaction.date <= end_date)
    
    # Add pagination
    transactions = query.order_by(models.Transaction.date.desc()).offset(skip).limit(limit).all()
    
    # Eager load category relationship
    for transaction in transactions:
        db.refresh(transaction)
    
    return transactions

@router.get("/transactions/{transaction_id}", response_model=schemas.Transaction)
def get_transaction(transaction_id: int, db: Session = Depends(get_db)):
    transaction = db.query(models.Transaction).filter(
        models.Transaction.id == transaction_id
    ).first()
    
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    
    return transaction

@router.put("/transactions/{transaction_id}", response_model=schemas.Transaction)
def update_transaction(
    transaction_id: int,
    transaction_update: schemas.TransactionCreate,
    db: Session = Depends(get_db)
):
    # Find the transaction
    transaction = db.query(models.Transaction).filter(
        models.Transaction.id == transaction_id
    ).first()
    
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    
    # Verify new category exists if category_id is being updated
    if transaction_update.category_id:
        category = db.query(models.Category).filter(
            models.Category.id == transaction_update.category_id
        ).first()
        if not category:
            raise HTTPException(status_code=404, detail="Category not found")
    
    # Update fields
    for key, value in transaction_update.dict().items():
        setattr(transaction, key, value)
    
    db.commit()
    db.refresh(transaction)
    return transaction

@router.delete("/transactions/{transaction_id}")
def delete_transaction(transaction_id: int, db: Session = Depends(get_db)):
    transaction = db.query(models.Transaction).filter(
        models.Transaction.id == transaction_id
    ).first()
    
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    
    db.delete(transaction)
    db.commit()
    return {"message": "Transaction deleted successfully"}

@router.delete("/transactions/bulk")
def delete_multiple_transactions(
    transaction_ids: List[int],
    db: Session = Depends(get_db)
):
    deleted_count = db.query(models.Transaction).filter(
        models.Transaction.id.in_(transaction_ids)
    ).delete(synchronize_session=False)
    
    db.commit()
    
    return {
        "message": f"Successfully deleted {deleted_count} transactions",
        "deleted_count": deleted_count
    }

# Balance Sheet endpoint
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
    ).order_by(models.Transaction.date.desc()).all()
    
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

# Dashboard endpoint
@router.get("/dashboard/")
def get_dashboard_data(
    db: Session = Depends(get_db),
    days: int = Query(30, description="Number of days to look back")
):
    end_date = datetime.now()
    start_date = end_date.replace(day=max(1, end_date.day - days))
    
    result = {}
    for dept in schemas.DepartmentEnum:
        # 1. Get ALL transactions for totals (with date filter)
        all_transactions = db.query(models.Transaction).filter(
            models.Transaction.department == dept,
            models.Transaction.date >= start_date
        ).all()
        
        # Calculate totals from ALL transactions
        total_income = sum(t.amount for t in all_transactions if t.type == "INCOME")
        total_expenditure = sum(t.amount for t in all_transactions if t.type == "EXPENDITURE")
        balance = total_income - total_expenditure
        
        # 2. Get just 5 most recent for display (with same date filter)
        recent_transactions = db.query(models.Transaction).filter(
            models.Transaction.department == dept,
            models.Transaction.date >= start_date
        ).order_by(models.Transaction.date.desc()).limit(5).all()
        
        result[dept.value] = {
            "balance": balance,
            "income": total_income,
            "expenditure": total_expenditure,
            "recent_transactions": recent_transactions
        }
    
    return result

# Statistics endpoint
@router.get("/stats/{department}")
def get_department_stats(
    department: schemas.DepartmentEnum,
    db: Session = Depends(get_db),
    months: int = Query(6, description="Number of months of history")
):
    end_date = datetime.now()
    start_date = end_date.replace(month=max(1, end_date.month - months))
    
    # Get monthly aggregates
    monthly_stats = db.query(
        func.date_trunc('month', models.Transaction.date).label('month'),
        func.sum(models.Transaction.amount).filter(models.Transaction.type == 'INCOME').label('total_income'),
        func.sum(models.Transaction.amount).filter(models.Transaction.type == 'EXPENDITURE').label('total_expenditure'),
        func.count(models.Transaction.id).label('transaction_count')
    ).filter(
        models.Transaction.department == department,
        models.Transaction.date >= start_date,
        models.Transaction.date <= end_date
    ).group_by('month').order_by('month').all()
    
    return {
        "department": department,
        "period": {
            "start": start_date,
            "end": end_date
        },
        "monthly_stats": [
            {
                "month": stat.month,
                "income": float(stat.total_income or 0),
                "expenditure": float(stat.total_expenditure or 0),
                "transaction_count": stat.transaction_count
            }
            for stat in monthly_stats
        ]
    }