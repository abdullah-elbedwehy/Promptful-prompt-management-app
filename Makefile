PYTHON = python3
FLASK = flask

# Server commands
run:
	$(PYTHON) run.py

run-prod:
	FLASK_ENV=production $(PYTHON) run.py

# Database commands
db-init:
	$(PYTHON) scripts/db_init.py init

db-reset:
	$(PYTHON) scripts/db_init.py reset

# Docker commands
docker-build:
	docker build -t promptful-api .

docker-run:
	docker run -p 5000:5000 promptful-api

docker-stop:
	docker stop promptful-api || true

# Development commands
install:
	pip install -r requirements.txt

clean:
	find . -type d -name __pycache__ -exec rm -r {} +
	find . -type f -name "*.pyc" -delete
	find . -type d -name ".pytest_cache" -exec rm -r {} +
	find . -type d -name "htmlcov" -exec rm -r {} +

test:
	pytest

lint:
	flake8 .

format:
	black .

# Setup
setup: install db-init

# Default target
.DEFAULT_GOAL := help

# Help
help:
	@echo 'Available commands:'
	@echo '  make run          - Run development server'
	@echo '  make run-prod     - Run production server'
	@echo '  make db-init      - Initialize database'
	@echo '  make db-reset     - Reset database'
	@echo '  make docker-build - Build Docker image'
	@echo '  make docker-run   - Run Docker container'
	@echo '  make docker-stop  - Stop Docker container'
	@echo '  make install      - Install dependencies'
	@echo '  make clean        - Clean cache files'
	@echo '  make test         - Run tests'
	@echo '  make lint         - Run linter'
	@echo '  make format       - Format code'
	@echo '  make setup        - Initial setup'