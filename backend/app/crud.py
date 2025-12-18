# backend/app/crud.py
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from app import models, schemas

async def get_test_report(db: AsyncSession, test_id: str):
    result = await db.execute(
        select(models.TestReport)
        .options(selectinload(models.TestReport.vulnerabilities))
        .filter(models.TestReport.test_id == test_id)
    )
    orm_report = result.scalars().first()
    if orm_report is None:
        return None
    # Force eager loading of all fields
    _ = orm_report.test_id
    _ = orm_report.start_time
    _ = orm_report.end_time
    _ = orm_report.total_attacks
    _ = orm_report.successful_attacks
    _ = orm_report.risk_score
    _ = orm_report.recommendations
    _ = orm_report.vulnerabilities
    from app.schemas import TestReport
    return TestReport.model_validate(orm_report)

async def get_test_reports(db: AsyncSession, skip: int = 0, limit: int = 100):
    result = await db.execute(select(models.TestReport).offset(skip).limit(limit))
    return result.scalars().all()

async def get_all_test_reports(db: AsyncSession):
    result = await db.execute(select(models.TestReport))
    return result.scalars().all()


async def create_test_report(db: AsyncSession, report: schemas.TestReportCreate):
    vulnerabilities = [models.AttackResult(**vuln.dict()) for vuln in report.vulnerabilities]
    db_report = models.TestReport(**report.dict(exclude={"vulnerabilities"}), vulnerabilities=vulnerabilities)
    db.add(db_report)
    await db.commit()
    # Re-query the report with all relationships loaded
    result = await db.execute(
        select(models.TestReport)
        .options(selectinload(models.TestReport.vulnerabilities))
        .filter(models.TestReport.id == db_report.id)
    )
    loaded_report = result.scalars().first()
    from app.schemas import TestReport
    return TestReport.model_validate(loaded_report)
