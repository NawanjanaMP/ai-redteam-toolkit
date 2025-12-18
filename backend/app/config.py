"""
Configuration settings for AI Red-Teaming Toolkit
File: backend/app/config.py
"""

from pydantic_settings import BaseSettings
from typing import List
from functools import lru_cache
import os


class Settings(BaseSettings):
    """Application settings with environment variable support"""
    
    # Application
    APP_NAME: str = "AI Red-Teaming Toolkit"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False
    ENVIRONMENT: str = "production"
    
    # API
    API_V1_PREFIX: str = "/api/v1"
    CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost:3001"]
    
    # Security
    SECRET_KEY: str = "change-this-in-production-use-secure-random-key"
    API_KEY: str = ""
    ALLOWED_HOSTS: List[str] = ["*"]
    
    # Cache
    REDIS_URL: str = "redis://localhost:6379/0"
    CACHE_TTL: int = 3600
    CACHE_ENABLED: bool = True
    
    # Rate Limiting
    RATE_LIMIT_PER_MINUTE: int = 60
    RATE_LIMIT_PER_HOUR: int = 1000
    ENABLE_RATE_LIMITING: bool = True
    
    # Logging
    LOG_LEVEL: str = "INFO"
    LOG_FILE: str = "logs/app.log"
    LOG_FORMAT: str = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
    
    # Attack Generation
    MAX_ATTACK_PAYLOAD_LENGTH: int = 10000
    DEFAULT_ATTACK_INTENSITY: str = "medium"
    ENABLE_ADVANCED_ATTACKS: bool = True
    
    # Testing
    MAX_CONCURRENT_TESTS: int = 10
    TEST_TIMEOUT_SECONDS: int = 300
    SAVE_TEST_RESULTS: bool = True
    RESULTS_RETENTION_DAYS: int = 30
    
    # Model Integration (Optional)
    OPENAI_API_KEY: str = ""
    ANTHROPIC_API_KEY: str = ""
    MODEL_ENDPOINT: str = ""
    MODEL_TIMEOUT: int = 30
    
    # Database (Optional - for persistent storage)
    DATABASE_URL: str = "sqlite+aiosqlite:///./test.db"
    DB_POOL_SIZE: int = 10
    DB_MAX_OVERFLOW: int = 20
    
    # Monitoring
    ENABLE_METRICS: bool = True
    METRICS_PORT: int = 9090
    
    class Config:
        env_file = ".env"
        env_file_encoding = 'utf-8'
        case_sensitive = True
        extra = "allow"


@lru_cache()
def get_settings() -> Settings:
    """
    Get cached settings instance
    This ensures settings are only loaded once
    """
    return Settings()


# Create settings instance
settings = get_settings()


# Validation functions
def validate_config():
    """Validate critical configuration settings"""
    if settings.ENVIRONMENT == "production":
        if settings.SECRET_KEY == "change-this-in-production-use-secure-random-key":
            raise ValueError("SECRET_KEY must be changed in production!")
        
        if settings.DEBUG:
            raise ValueError("DEBUG must be False in production!")
    
    if settings.CACHE_ENABLED and not settings.REDIS_URL:
        print("Warning: Cache enabled but no Redis URL provided")
    
    return True


# Environment-specific configurations
def get_cors_origins() -> List[str]:
    """Get CORS origins based on environment"""
    if settings.ENVIRONMENT == "development":
        return ["http://localhost:3000", "http://localhost:3001", "http://127.0.0.1:3000"]
    elif settings.ENVIRONMENT == "staging":
        return ["https://staging.yourapp.com"]
    else:
        return settings.CORS_ORIGINS


def get_log_config() -> dict:
    """Get logging configuration"""
    return {
        "version": 1,
        "disable_existing_loggers": False,
        "formatters": {
            "default": {
                "format": settings.LOG_FORMAT,
            },
            "detailed": {
                "format": "%(asctime)s - %(name)s - %(levelname)s - %(funcName)s:%(lineno)d - %(message)s",
            },
        },
        "handlers": {
            "console": {
                "class": "logging.StreamHandler",
                "level": settings.LOG_LEVEL,
                "formatter": "default",
                "stream": "ext://sys.stdout",
            },
            "file": {
                "class": "logging.handlers.RotatingFileHandler",
                "level": settings.LOG_LEVEL,
                "formatter": "detailed",
                "filename": settings.LOG_FILE,
                "maxBytes": 10485760,  # 10MB
                "backupCount": 5,
            },
        },
        "root": {
            "level": settings.LOG_LEVEL,
            "handlers": ["console", "file"],
        },
    }
