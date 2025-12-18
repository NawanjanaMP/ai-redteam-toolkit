# backend/app/enums.py
from enum import Enum

class AttackType(str, Enum):
    PROMPT_INJECTION = "prompt_injection"
    JAILBREAK = "jailbreak"
    TOXIC_OUTPUT = "toxic_output"
    BEHAVIOR_FUZZING = "behavior_fuzzing"

class SeverityLevel(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"
