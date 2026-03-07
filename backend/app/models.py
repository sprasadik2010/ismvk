from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Enum
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from .database import Base

class DepartmentEnum(str, enum.Enum):
    ILLAM = "ILLAM"
    AMBALAM = "AMBALAM"

class TransactionType(str, enum.Enum):
    INCOME = "INCOME"
    EXPENDITURE = "EXPENDITURE"

class Category(Base):
    __tablename__ = "categories"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    department = Column(Enum(DepartmentEnum), nullable=False)
    description = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    transactions = relationship("Transaction", back_populates="category")

class Transaction(Base):
    __tablename__ = "transactions"
    
    id = Column(Integer, primary_key=True, index=True)
    date = Column(DateTime, nullable=False, default=datetime.utcnow)
    description = Column(String, nullable=False)
    amount = Column(Float, nullable=False)
    type = Column(Enum(TransactionType), nullable=False)
    department = Column(Enum(DepartmentEnum), nullable=False)
    category_id = Column(Integer, ForeignKey("categories.id"))
    notes = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    category = relationship("Category", back_populates="transactions")