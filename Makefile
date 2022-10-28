MKFILE_PATH := $(abspath $(lastword $(MAKEFILE_LIST)))
PROJECT_ROOT := $(dir $(MKFILE_PATH))
TRANSCENDENCE_DEPS := $(shell find $(PROJECT_ROOT)/transcendence-app/ -type f -name "*.ts" | grep -v "node_module\|dist\|test")
DOCKER_COMPOSE := $(shell $(PROJECT_ROOT)/scripts/get-docker-compose.sh)

.PHONY: all
all: gen
	$(DOCKER_COMPOSE) up --build -d

transcendence-app/swagger-spec.yaml: $(TRANSCENDENCE_DEPS)
	./scripts/generate-openapi.sh

.PHONY: gen
gen:
	make transcendence-app/swagger-spec.yaml

.PHONY: clean
clean:
	rm -rf webapp/src/shared/generated || true
	rm transcendence-app/swagger-spec.yaml || true
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
