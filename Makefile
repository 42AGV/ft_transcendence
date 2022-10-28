TRANSCENDENCE_DEPS=$(shell find transcendence-app/ -type f -name "*.ts" | grep -v "node_module\|dist\|test")

.PHONY: all
all: gen
	docker-compose up --build

transcendence-app/swagger-spec.yaml: $(TRANSCENDENCE_DEPS)
	./scripts/generate-openapi.sh

.PHONY: gen
gen:
	make transcendence-app/swagger-spec.yaml

.PHONY: clean
clean:
	rm -rf webapp/src/shared/generated
	rm transcendence-app/swagger-spec.yaml
