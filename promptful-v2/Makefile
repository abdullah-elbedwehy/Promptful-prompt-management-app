# Variables
DOCKER_COMPOSE = docker-compose
DOCKER_COMPOSE_DEV = docker-compose -f docker-compose.dev.yml
NPM = npm

# Development commands
.PHONY: install
install: ## Install dependencies
	@$(NPM) install

.PHONY: dev
dev: ## Start development server
	@$(NPM) run dev

.PHONY: build
build: ## Build for production
	@$(NPM) run build

.PHONY: preview
preview: ## Preview production build
	@$(NPM) run preview

.PHONY: lint
lint: ## Run linter
	@$(NPM) run lint

.PHONY: format
format: ## Format code
	@$(NPM) run format

.PHONY: type-check
type-check: ## Run TypeScript type checking
	@$(NPM) run type-check

# Docker commands
.PHONY: docker-dev
docker-dev: ## Start development environment in Docker
	@$(DOCKER_COMPOSE_DEV) up --build

.PHONY: docker-prod
docker-prod: ## Start production environment in Docker
	@$(DOCKER_COMPOSE) up --build

.PHONY: docker-down
docker-down: ## Stop Docker containers
	@$(DOCKER_COMPOSE) down

.PHONY: docker-clean
docker-clean: ## Clean Docker resources
	@$(DOCKER_COMPOSE) down -v --remove-orphans

# Setup commands
.PHONY: setup
setup: ## Initial project setup
	@chmod +x scripts/setup.sh
	@./scripts/setup.sh

.PHONY: setup-env
setup-env: ## Create .env file from example
	@cp -n .env.example .env || true

# Clean commands
.PHONY: clean
clean: ## Clean build artifacts
	@rm -rf dist
	@rm -rf node_modules
	@rm -rf .cache

# Help
.PHONY: help
help: ## Show this help message
	@echo 'Usage:'
	@echo '  make [target]'
	@echo ''
	@echo 'Targets:'
	@awk -F ':.*?## ' '/^[a-zA-Z_-]+:.*?## / {printf "  %-20s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

# Default target
.DEFAULT_GOAL := help