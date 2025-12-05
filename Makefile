.PHONY: help build dev-up db-up app-dev app-up app-down up down logs clean restart migrate db-shell db-init db-seed db-reset db-push

# Default target - show help
help:
	@echo "oceoluxe.com - Docker Management"
	@echo ""
	@echo "Available commands:"
	@echo "  make build       - Build the Docker image for the application"
	@echo ""
	@echo "Start specific services:"
	@echo "  make db-up       - Start only PostgreSQL (no app) for local development"
	@echo "  make app-dev     - Start only the app container with logs (requires DB already running)"
	@echo "  make app-up      - Start only the app container in detached mode (requires DB already running)"
	@echo "  make app-down    - Stop only the app container (leaves DB running)"
	@echo ""
	@echo "Start all services:"
	@echo "  make dev-up      - Start all services (PostgreSQL + App) with logs"
	@echo "  make up          - Start all services (PostgreSQL + App) in detached mode"
	@echo ""
	@echo "Management:"
	@echo "  make down        - Stop all services"
	@echo "  make restart     - Restart all services"
	@echo "  make logs        - View logs from all services"
	@echo "  make logs-app    - View logs from the application only"
	@echo "  make migrate     - Run database migrations"
	@echo "  make clean       - Stop services and remove volumes (⚠️  deletes all data)"
	@echo "  make shell       - Open a shell in the app container"
	@echo "  make db-shell    - Open PostgreSQL shell"
	@echo ""
	@echo "Database management (local development):"
	@echo "  make db-init     - Initialize database schema from scratch"
	@echo "  make db-seed     - Seed database with initial data"
	@echo "  make db-push     - Push schema changes to database"
	@echo "  make db-reset    - Reset database (drop all, recreate, seed)"
	@echo "  make db-generate - Generate migration from schema changes"
	@echo "  make db-migrate  - Apply pending migrations"
	@echo "  make db-studio   - Open Drizzle Studio GUI"
	@echo ""

# Build the Docker image
build:
	@echo "Building Docker image..."
	docker-compose build app

# Start only database (for local app development)
db-up:
	@echo "Starting PostgreSQL only..."
	@echo "The app will NOT be started - run it locally with 'npm run dev'"
	@echo ""
	docker-compose up -d postgres
	@echo ""
	@echo "✓ Database started successfully!"
	@echo ""
	@echo "Access points:"
	@echo "  PostgreSQL:  localhost:54322"
	@echo ""
	@echo "For local development:"
	@echo "  1. Update your local .env to use localhost URLs:"
	@echo "     POSTGRES_URL=postgresql://postgres:postgres@localhost:54322/oceoluxe"
	@echo "  2. Run 'npm run dev' to start the Next.js app locally"
	@echo "  3. Run 'npm run db:migrate' to apply migrations"
	@echo ""
	@echo "View logs: docker-compose logs -f postgres"

# Start only app container with logs (requires DB already running)
app-dev:
	@echo "Starting app container with logs..."
	@echo "⚠️  Note: PostgreSQL must already be running!"
	@echo ""
	@if ! docker ps --format '{{.Names}}' | grep -q 'oceoluxe_postgres'; then \
		echo "❌ Error: PostgreSQL container is not running"; \
		echo "   Run 'make db-up' first to start the database"; \
		exit 1; \
	fi
	@if [ ! -f .env ]; then \
		echo "⚠️  No .env file found. Please create one first."; \
		echo "See .env.example for reference."; \
		exit 1; \
	fi
	docker-compose up app

# Start only app container in detached mode (requires DB already running)
app-up:
	@echo "Starting app container in detached mode..."
	@echo "⚠️  Note: PostgreSQL must already be running!"
	@echo ""
	@if ! docker ps --format '{{.Names}}' | grep -q 'oceoluxe_postgres'; then \
		echo "❌ Error: PostgreSQL container is not running"; \
		echo "   Run 'make db-up' first to start the database"; \
		exit 1; \
	fi
	@if [ ! -f .env ]; then \
		echo "⚠️  No .env file found. Please create one first."; \
		echo "See .env.example for reference."; \
		exit 1; \
	fi
	docker-compose up -d app
	@echo ""
	@echo "✓ App container started successfully!"
	@echo ""
	@echo "Access points:"
	@echo "  Application: http://localhost:3000"
	@echo ""
	@echo "View logs: make logs-app"

# Stop only app container (leaves DB running)
app-down:
	@echo "Stopping app container..."
	docker-compose stop app
	@echo "✓ App container stopped"
	@echo ""
	@echo "PostgreSQL is still running."
	@echo "To stop everything: make down"
	@echo "To restart app: make app-up"

# Start services with logs visible (development)
dev-up:
	@echo "Starting services in development mode..."
	@if [ ! -f .env ]; then \
		echo "⚠️  No .env file found. Please create one first."; \
		echo "See .env.example for reference."; \
		exit 1; \
	fi
	docker-compose up

# Start services in detached mode (production-like)
up:
	@echo "Starting services in detached mode..."
	@if [ ! -f .env ]; then \
		echo "⚠️  No .env file found. Please create one first."; \
		echo "See .env.example for reference."; \
		exit 1; \
	fi
	docker-compose up -d
	@echo ""
	@echo "✓ Services started successfully!"
	@echo ""
	@echo "Access points:"
	@echo "  Application: http://localhost:3000"
	@echo "  PostgreSQL:  localhost:54322"
	@echo ""
	@echo "Next steps:"
	@echo "  1. Run 'make migrate' to setup database"
	@echo ""
	@echo "View logs: make logs"

# Stop all services
down:
	@echo "Stopping services..."
	docker-compose down
	@echo "✓ Services stopped"

# Restart all services
restart:
	@echo "Restarting services..."
	docker-compose restart
	@echo "✓ Services restarted"

# View logs from all services
logs:
	docker-compose logs -f

# View logs from app only
logs-app:
	docker-compose logs -f app

# Run database migrations
migrate:
	@echo "Running database migrations..."
	docker-compose exec app npm run db:migrate
	@echo "✓ Migrations completed"

# Clean up everything (⚠️  deletes all data)
clean:
	@echo "⚠️  WARNING: This will delete all data (database, uploads)"
	@read -p "Are you sure? (yes/no): " confirm; \
	if [ "$$confirm" = "yes" ]; then \
		docker-compose down -v; \
		rm -rf uploads/*; \
		echo "✓ Cleaned up all data"; \
	else \
		echo "Cancelled"; \
	fi

# Open shell in app container
shell:
	@echo "Opening shell in app container..."
	docker-compose exec app /bin/sh

# Open PostgreSQL shell
db-shell:
	@echo "Opening PostgreSQL shell..."
	docker-compose exec postgres psql -U postgres -d oceoluxe

# Build and start everything (fresh setup)
setup: build up
	@echo ""
	@echo "✓ Initial setup complete!"
	@echo ""
	@echo "Follow the setup instructions above to complete configuration."

# =============================================
# DATABASE MANAGEMENT (Local Development)
# =============================================

# Initialize database schema (push schema to DB without migrations)
db-init:
	@echo "Initializing database schema..."
	POSTGRES_URL="postgresql://oceoluxe_user:oceoluxe_password@localhost:5433/oceoluxe" npx drizzle-kit push
	@echo "✓ Database schema initialized"

# Seed database with initial data
db-seed:
	@echo "Seeding database..."
	POSTGRES_URL="postgresql://oceoluxe_user:oceoluxe_password@localhost:5433/oceoluxe" npx tsx lib/db/seed.ts
	@echo "✓ Database seeded"

# Push schema changes to database (without migrations)
db-push:
	@echo "Pushing schema changes to database..."
	POSTGRES_URL="postgresql://oceoluxe_user:oceoluxe_password@localhost:5433/oceoluxe" npx drizzle-kit push
	@echo "✓ Schema pushed to database"

# Reset database completely (drop all tables, recreate, and seed)
db-reset:
	@echo "⚠️  WARNING: This will DELETE ALL DATA in the database"
	@read -p "Are you sure? (yes/no): " confirm; \
	if [ "$$confirm" = "yes" ]; then \
		echo "Dropping all tables..."; \
		PGPASSWORD=oceoluxe_password psql -h localhost -p 5433 -U oceoluxe_user -d oceoluxe -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"; \
		echo "Reinitializing schema..."; \
		POSTGRES_URL="postgresql://oceoluxe_user:oceoluxe_password@localhost:5433/oceoluxe" npx drizzle-kit push; \
		echo "Seeding database..."; \
		POSTGRES_URL="postgresql://oceoluxe_user:oceoluxe_password@localhost:5433/oceoluxe" npx tsx lib/db/seed.ts; \
		echo "✓ Database reset complete"; \
	else \
		echo "Cancelled"; \
	fi

# Generate new migration from schema changes
db-generate:
	@echo "Generating migration from schema changes..."
	POSTGRES_URL="postgresql://oceoluxe_user:oceoluxe_password@localhost:5433/oceoluxe" npx drizzle-kit generate
	@echo "✓ Migration generated (check lib/db/migrations/)"

# Apply pending migrations
db-migrate:
	@echo "Applying migrations..."
	POSTGRES_URL="postgresql://oceoluxe_user:oceoluxe_password@localhost:5433/oceoluxe" npx drizzle-kit migrate
	@echo "✓ Migrations applied"

# Open Drizzle Studio (database GUI)
db-studio:
	@echo "Opening Drizzle Studio..."
	POSTGRES_URL="postgresql://oceoluxe_user:oceoluxe_password@localhost:5433/oceoluxe" npx drizzle-kit studio
