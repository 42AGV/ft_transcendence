MKFILE_PATH := $(abspath $(lastword $(MAKEFILE_LIST)))
PROJECT_ROOT := $(realpath $(dir $(MKFILE_PATH)))
TRANSCENDENCE_DEPS := $(shell $(PROJECT_ROOT)/scripts/get-swagger-spec-dependencies.sh)
DOCKER_COMPOSE := $(shell $(PROJECT_ROOT)/scripts/get-docker-compose.sh)

# all runs in development mode
.PHONY: all
all: gen
	$(DOCKER_COMPOSE) up --build -d
	make migrate
	make seed
	npm run build-packages

.PHONY: down
down:
	$(DOCKER_COMPOSE) down

.PHONY: prod
prod: gen
	$(DOCKER_COMPOSE) -f docker-compose.yml -f docker-compose.prod.yml up --build -d
	make prod-migrate

.PHONY: prod-down
prod-down:
	$(DOCKER_COMPOSE) -f docker-compose.yml -f docker-compose.prod.yml down

transcendence-app/swagger-spec/swagger-spec.yaml: $(TRANSCENDENCE_DEPS)
	$(PROJECT_ROOT)/scripts/generate-openapi.sh --no-gen

.PHONY: gen-webapp
gen-webapp:
	$(PROJECT_ROOT)/scripts/generate-openapi.sh --no-spec

.PHONY: spec
spec:
	make transcendence-app/swagger-spec/swagger-spec.yaml

.PHONY: gen
gen:
	make spec
	make gen-webapp

.PHONY: clean
clean:
	make down
	rm -rf $(PROJECT_ROOT)/webapp/src/shared/generated || true
	rm $(PROJECT_ROOT)/transcendence-app/swagger-spec/swagger-spec.yaml || true

.PHONY: prod-clean
prod-clean:
	make prod-down
	rm -rf $(PROJECT_ROOT)/webapp/src/shared/generated || true
	rm $(PROJECT_ROOT)/transcendence-app/swagger-spec/swagger-spec.yaml || true


.PHONY: re
re:
	make clean
	make all

.PHONY: prod-re
prod-re:
	make prod-clean
	make prod

.PHONY: log-tr
log-tr:
	$(DOCKER_COMPOSE) logs -f transcendence-app

.PHONY: log-wa
log-wa:
	$(DOCKER_COMPOSE) logs -f webapp

.PHONY: log-db
log-db:
	$(DOCKER_COMPOSE) logs -f db

.PHONY: get-ip
get-ip:
	@echo "webapp:"
	@docker inspect -f '{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}' $(shell ./scripts/get-running-containers-names.sh "ft.transcendence.webapp.1" )
	@echo "transcendence-app:"
	@docker inspect -f '{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}' $(shell ./scripts/get-running-containers-names.sh "ft.transcendence.transcendence.app.1" )
	@echo "db:"
	@docker inspect -f '{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}' $(shell ./scripts/get-running-containers-names.sh "ft.transcendence.db.1" )

.PHONY: seed
seed:
	$(DOCKER_COMPOSE) exec transcendence-app npm run knex:seed:run -w transcendence-app

.PHONY: migrate
migrate:
	$(DOCKER_COMPOSE) exec transcendence-app npm run knex:migrate:dev -w transcendence-app

.PHONY: prod-migrate
prod-migrate:
	$(DOCKER_COMPOSE) exec transcendence-app npm run knex:migrate:prod -w transcendence-app
