MKFILE_PATH := $(abspath $(lastword $(MAKEFILE_LIST)))
PROJECT_ROOT := $(realpath $(dir $(MKFILE_PATH)))
TRANSCENDENCE_DEPS := $(shell $(PROJECT_ROOT)/scripts/get-swagger-spec-dependencies.sh)
DOCKER_COMPOSE := $(shell $(PROJECT_ROOT)/scripts/get-docker-compose.sh)
ifeq ($(SEED),)
SEED := seed
endif

.PHONY: all
all: gen
	$(DOCKER_COMPOSE) up --build -d

transcendence-app/swagger-spec.yaml: $(TRANSCENDENCE_DEPS)
	$(PROJECT_ROOT)/scripts/generate-openapi.sh --no-gen

.PHONY: gen-webapp
gen-webapp:
	$(PROJECT_ROOT)/scripts/generate-openapi.sh --no-spec

.PHONY: spec
spec:
	make transcendence-app/swagger-spec.yaml

.PHONY: gen
gen:
	make spec
	make gen-webapp

.PHONY: clean
clean:
	rm -rf $(PROJECT_ROOT)/webapp/src/shared/generated || true
	rm $(PROJECT_ROOT)/transcendence-app/swagger-spec.yaml || true
	$(DOCKER_COMPOSE) down -v

.PHONY: re
re:
	make clean
	make all

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

transcendence-app/seeds/$(SEED).ts:
	cd transcendence-app && npx knex seed:make $(SEED)

PHONY: seed
seed:
	make transcendence-app/seeds/$(SEED).ts
