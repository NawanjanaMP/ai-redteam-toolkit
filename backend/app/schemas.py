# backend/app/schemas.py
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from app.enums import AttackType, SeverityLevel

class AttackResultBase(BaseModel):
    attack_id: str
    attack_type: AttackType
    payload: str
    success: bool
    severity: SeverityLevel
    detection_score: float
    response_time_ms: float
    timestamp: datetime

class AttackResultCreate(AttackResultBase):
    pass

class AttackResult(AttackResultBase):
    id: int
    report_id: int

    model_config = {"from_attributes": True}


class TestReportBase(BaseModel):
    test_id: str
    start_time: datetime
    end_time: datetime
    total_attacks: int
    successful_attacks: int
    risk_score: float
    recommendations: List[str]

class TestReportCreate(TestReportBase):
    vulnerabilities: List[AttackResultCreate] = []

class TestReport(TestReportBase):
    id: int
    vulnerabilities: List[AttackResult] = []

    model_config = {"from_attributes": True}
