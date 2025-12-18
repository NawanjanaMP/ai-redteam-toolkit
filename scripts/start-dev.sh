#!/bin/bash
# AI Red-Teaming Toolkit - Start Development Script
# File: scripts/start-dev.sh

set -e

echo "🚀 Starting AI Red-Teaming Toolkit in development mode..."
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Start Docker Compose
echo "🐳 Starting Docker containers..."
docker-compose up -d

# Wait for services to be healthy
echo ""
echo "⏳ Waiting for services to be ready..."
sleep 5

# Check backend health
echo -n "Checking backend... "
for i in {1..30}; do
    if curl -f http://localhost:8000/ > /dev/null 2>&1; then
        echo -e "${GREEN}✓${NC}"
        break
    fi
    if [ $i -eq 30 ]; then
        echo -e "${YELLOW}⚠${NC} Backend may not be ready yet"
    fi
    sleep 1
done

# Check frontend
echo -n "Checking frontend... "
for i in {1..30}; do
    if curl -f http://localhost:3000/ > /dev/null 2>&1; then
        echo -e "${GREEN}✓${NC}"
        break
    fi
    if [ $i -eq 30 ]; then
        echo -e "${YELLOW}⚠${NC} Frontend may not be ready yet"
    fi
    sleep 1
done

# Check Redis
echo -n "Checking Redis... "
if docker-compose exec -T redis redis-cli ping > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${YELLOW}⚠${NC} Redis may not be ready yet"
fi

echo ""
echo -e "${GREEN}============================================${NC}"
echo -e "${GREEN}✅ Services are running!${NC}"
echo -e "${GREEN}============================================${NC}"
echo ""
echo -e "${BLUE}📊 Dashboard:${NC}    http://localhost:3000"
echo -e "${BLUE}📡 API:${NC}          http://localhost:8000"
echo -e "${BLUE}📚 API Docs:${NC}     http://localhost:8000/docs"
echo -e "${BLUE}📖 ReDoc:${NC}        http://localhost:8000/redoc"
echo -e "${BLUE}🔍 Redis:${NC}        localhost:6379"
echo ""
echo "View logs with: make logs"
echo "Stop services with: make stop"
echo ""