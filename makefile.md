# AI Red-Teaming Toolkit - Makefile
# File: Makefile

.PHONY: help setup dev test clean build deploy logs stop restart

# Default target
.DEFAULT_GOAL := help

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-15s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

setup: ## Initial project setup
	@echo "🚀 Setting up AI Red-Teaming Toolkit..."
	@chmod +x scripts/*.sh
	@./scripts/setup.sh
	@echo "✅ Setup complete!"

dev: ## Start development environment
	@echo "🔨 Starting development servers..."
	@docker-compose up -d
	@echo "✅ Services started!"
	@echo "📊 Dashboard: http://localhost:3000"
	@echo "📡 API Docs: http://localhost:8000/docs"

test: ## Run all tests
	@echo "🧪 Running tests..."
	@./scripts/run-tests.sh

test-backend: ## Run backend tests only
	@echo "🧪 Running backend tests..."
	@cd backend && python -m pytest tests/ -v --cov=app

test-frontend: ## Run frontend tests only
	@echo "🧪 Running frontend tests..."
	@cd frontend && npm test -- --coverage --watchAll=false

clean: ## Clean up containers, volumes, and cache
	@echo "🧹 Cleaning up..."
	@docker-compose down -v
	@rm -rf backend/venv
	@rm -rf frontend/node_modules
	@rm -rf backend/__pycache__
	@rm -rf backend/.pytest_cache
	@rm -rf frontend/build
	@echo "✅ Cleanup complete!"

build: ## Build Docker images
	@echo "🏗️  Building Docker images..."
	@docker-compose build
	@echo "✅ Build complete!"

deploy: ## Deploy to production
	@echo "🚀 Deploying to production..."
	@./scripts/deploy.sh

logs: ## Show container logs
	@docker-compose logs -f

logs-backend: ## Show backend logs only
	@docker-compose logs -f backend

logs-frontend: ## Show frontend logs only
	@docker-compose logs -f frontend

stop: ## Stop all services
	@echo "🛑 Stopping services..."
	@docker-compose down
	@echo "✅ Services stopped!"

restart: ## Restart all services
	@echo "🔄 Restarting services..."
	@docker-compose restart
	@echo "✅ Services restarted!"

ps: ## Show running containers
	@docker-compose ps

backend-shell: ## Open backend container shell
	@docker-compose exec backend /bin/sh

frontend-shell: ## Open frontend container shell
	@docker-compose exec frontend /bin/sh

redis-cli: ## Open Redis CLI
	@docker-compose exec redis redis-cli

format: ## Format code
	@echo "🎨 Formatting code..."
	@cd backend && black app/ tests/
	@cd frontend && npm run format
	@echo "✅ Code formatted!"

lint: ## Lint code
	@echo "🔍 Linting code..."
	@cd backend && flake8 app/ tests/
	@cd frontend && npm run lint
	@echo "✅ Linting complete!"

install-backend: ## Install backend dependencies
	@cd backend && pip install -r requirements.txt -r requirements-dev.txt

install-frontend: ## Install frontend dependencies
	@cd frontend && npm install

db-migrate: ## Run database migrations (if using database)
	@cd backend && alembic upgrade head

db-rollback: ## Rollback last database migration
	@cd backend && alembic downgrade -1

backup: ## Backup data
	@echo "💾 Backing up data..."
	@docker-compose exec -T redis redis-cli --rdb /data/dump.rdb
	@echo "✅ Backup complete!"

update-deps: ## Update dependencies
	@echo "📦 Updating dependencies..."
	@cd backend && pip install --upgrade -r requirements.txt
	@cd frontend && npm update
	@echo "✅ Dependencies updated!"