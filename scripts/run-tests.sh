#!/bin/bash
# AI Red-Teaming Toolkit - Test Runner Script
# File: scripts/run-tests.sh

set -e

echo "🧪 Running AI Red-Teaming Toolkit tests..."
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

BACKEND_FAILED=0
FRONTEND_FAILED=0

# Backend Tests
echo -e "${BLUE}============================================${NC}"
echo -e "${BLUE}Backend Tests${NC}"
echo -e "${BLUE}============================================${NC}"
cd backend

if [ -d "venv" ]; then
    source venv/bin/activate
fi

echo "Running pytest..."
if python -m pytest tests/ -v --cov=app --cov-report=term --cov-report=html; then
    echo -e "${GREEN}✓ Backend tests passed${NC}"
else
    echo -e "${RED}✗ Backend tests failed${NC}"
    BACKEND_FAILED=1
fi

echo ""
echo "Coverage report saved to: backend/htmlcov/index.html"
echo ""

cd ..

# Frontend Tests
echo -e "${BLUE}============================================${NC}"
echo -e "${BLUE}Frontend Tests${NC}"
echo -e "${BLUE}============================================${NC}"
cd frontend

if [ -d "node_modules" ]; then
    echo "Running Jest tests..."
    if npm test -- --coverage --watchAll=false; then
        echo -e "${GREEN}✓ Frontend tests passed${NC}"
    else
        echo -e "${RED}✗ Frontend tests failed${NC}"
        FRONTEND_FAILED=1
    fi
    
    echo ""
    echo "Coverage report saved to: frontend/coverage/lcov-report/index.html"
else
    echo -e "${BLUE}ℹ Frontend dependencies not installed. Skipping tests.${NC}"
fi

cd ..

# Summary
echo ""
echo -e "${BLUE}============================================${NC}"
echo -e "${BLUE}Test Summary${NC}"
echo -e "${BLUE}============================================${NC}"

if [ $BACKEND_FAILED -eq 0 ] && [ $FRONTEND_FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ All tests passed!${NC}"
    exit 0
else
    if [ $BACKEND_FAILED -eq 1 ]; then
        echo -e "${RED}✗ Backend tests failed${NC}"
    fi
    if [ $FRONTEND_FAILED -eq 1 ]; then
        echo -e "${RED}✗ Frontend tests failed${NC}"
    fi
    exit 1
fi