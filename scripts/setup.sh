#!/bin/bash
# AI Red-Teaming Toolkit - Setup Script
# File: scripts/setup.sh

set -e

echo "🚀 Setting up AI Red-Teaming Toolkit..."
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed. Please install Docker first.${NC}"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}❌ Docker Compose is not installed. Please install Docker Compose first.${NC}"
    exit 1
fi

echo -e "${GREEN}✓${NC} Docker and Docker Compose found"

# Setup Backend
echo ""
echo "📦 Setting up backend..."
cd backend

# Create virtual environment
if [ ! -d "venv" ]; then
    python3 -m venv venv
    echo -e "${GREEN}✓${NC} Virtual environment created"
fi

# Activate virtual environment
source venv/bin/activate

# Install dependencies
pip install --upgrade pip
pip install -r requirements.txt
echo -e "${GREEN}✓${NC} Backend dependencies installed"

# Copy environment file
if [ ! -f ".env" ]; then
    cp .env.example .env
    echo -e "${YELLOW}⚠${NC}  Created .env file. Please update with your values."
fi

# Create logs directory
mkdir -p logs
echo -e "${GREEN}✓${NC} Backend setup complete"

cd ..

# Setup Frontend
echo ""
echo "📦 Setting up frontend..."
cd frontend

# Install dependencies
if command -v npm &> /dev/null; then
    npm install
    echo -e "${GREEN}✓${NC} Frontend dependencies installed"
    
    # Copy environment file
    if [ ! -f ".env" ]; then
        cp .env.example .env
        echo -e "${YELLOW}⚠${NC}  Created .env file. Please update with your values."
    fi
else
    echo -e "${YELLOW}⚠${NC}  npm not found. Skipping frontend setup."
    echo "   Frontend will be set up in Docker container."
fi

cd ..

# Create necessary directories
echo ""
echo "📁 Creating directories..."
mkdir -p logs
mkdir -p data
echo -e "${GREEN}✓${NC} Directories created"

# Make scripts executable
echo ""
echo "🔧 Making scripts executable..."
chmod +x scripts/*.sh
echo -e "${GREEN}✓${NC} Scripts are now executable"

# Display completion message
echo ""
echo -e "${GREEN}============================================${NC}"
echo -e "${GREEN}✅ Setup complete!${NC}"
echo -e "${GREEN}============================================${NC}"
echo ""
echo "Next steps:"
echo "  1. Review and update .env files in backend/ and frontend/"
echo "  2. Run 'make dev' to start the development environment"
echo "  3. Access dashboard at http://localhost:3000"
echo "  4. View API docs at http://localhost:8000/docs"
echo ""
echo "Useful commands:"
echo "  make dev      - Start development servers"
echo "  make test     - Run tests"
echo "  make logs     - View logs"
echo "  make stop     - Stop services"
echo ""