# backend/app/models.py
from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    Boolean,
    DateTime,
    ForeignKey,
    JSON,
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class TestReport(Base):
    __tablename__ = "test_reports"

    id = Column(Integer, primary_key=True, index=True)
    test_id = Column(String, unique=True, index=True, nullable=False)
    start_time = Column(DateTime(timezone=True), server_default=func.now())
    end_time = Column(DateTime(timezone=True), onupdate=func.now())
    total_attacks = Column(Integer)
    successful_attacks = Column(Integer)
    risk_score = Column(Float)
    recommendations = Column(JSON)

    vulnerabilities = relationship("AttackResult", back_populates="report", cascade="all, delete-orphan")


class AttackResult(Base):
    __tablename__ = "attack_results"

    id = Column(Integer, primary_key=True, index=True)
    attack_id = Column(String, index=True, nullable=False)  # Removed unique=True
    attack_type = Column(String, nullable=False)
    payload = Column(String)
    success = Column(Boolean)
    severity = Column(String)
    detection_score = Column(Float)
    response_time_ms = Column(Float)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    report_id = Column(Integer, ForeignKey("test_reports.id"))

    report = relationship("TestReport", back_populates="vulnerabilities")
