from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List
from enum import Enum

class DepartmentEnum(str, Enum):
    ILLAM = "ILLAM"
    AMBALAM = "AMBALAM"

class TransactionTypeEnum(str, Enum):
    INCOME = "INCOME"
    EXPENDITURE = "EXPENDITURE"

class CategoryBase(BaseModel):
    name: str
    department: DepartmentEnum
    description: Optional[str] = None

class CategoryCreate(CategoryBase):
    pass

class Category(CategoryBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class TransactionBase(BaseModel):
    date: datetime
    description: str
    amount: float
    type: TransactionTypeEnum
    department: DepartmentEnum
    category_id: int
    notes: Optional[str] = None

class TransactionCreate(TransactionBase):
    pass

class Transaction(TransactionBase):
    id: int
    created_at: datetime
    category: Optional[Category] = None
    
    class Config:
        from_attributes = True

class DateRange(BaseModel):
    start_date: datetime
    end_date: datetime

class BalanceSheet(BaseModel):
    department: DepartmentEnum
    total_income: float
    total_expenditure: float
    balance: float
    transactions: List[Transaction]
    period_start: datetime
    period_end: datetime