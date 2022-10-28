MKFILE_PATH := $(abspath $(lastword $(MAKEFILE_LIST)))
PROJECT_ROOT := $(dir $(MKFILE_PATH))
TRANSCENDENCE_DEPS := $(shell find ./transcendence-app/ -type f -name "*.ts" \
                              | grep -v "node_module\|dist\|test" \
                              | grep -i "controller\|dto\|domain\|entity")
DOCKER_COMPOSE := $(shell $(PROJECT_ROOT)/scripts/get-docker-compose.sh)
ifeq ($(SEED),)
SEED := seed
endif

.PHONY: all
all: gen
	$(DOCKER_COMPOSE) up --build -d

transcendence-app/swagger-spec.yaml: $(TRANSCENDENCE_DEPS)
	$(PROJECT_ROOT)/scripts/generate-openapi.sh

.PHONY: gen
gen:
	make transcendence-app/swagger-spec.yaml

.PHONY: clean
clean:
	rm -rf $(PROJECT_ROOT)/webapp/src/shared/generated || true
	rm $(PROJECT_ROOT)/transcendence-app/swagger-spec.yaml || true
	$(DOCKER_COMPOSE) down -v

.PHONY: re
re:
	make clean
	make

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
	@docker inspect -f '{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}' ft_transcendence-webapp-1

transcendence-app/seeds/$(SEED).ts:
	cd transcendence-app && npx knex seed:make $(SEED)

PHONY: seed
seed:
	make transcendence-app/seeds/$(SEED).ts
