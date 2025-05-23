# Makefile
.PHONY: init run-pre-commit build exec dev npm npx test test/smoke test/e2e test/e2e/headless clean down up logs

NUXT_APP_DIR = comic-safe
DOCKER_DEV_IMAGE = comic-safe-dev
DOCKER_PROD_IMAGE = comic-safe-prod
DOCKER_DEV_CONTAINER = comic-safe-dev-test

init:
	pre-commit install

run-pre-commit:
	pre-commit run --all-files

# --- Build Targets ---
build: build/dev

build/dev:
	docker compose build

build/prod:
	docker build -t $(DOCKER_PROD_IMAGE) --target=prod comic-safe

exec: build
	docker run --rm -it \
	  -v $(PWD)/$(NUXT_APP_DIR):/app \
	  -w /app \
	  -u $(shell id -u):$(shell id -g) \
	  $(DOCKER_DEV_IMAGE) sh -c '$(CMD)'

dev:
	docker compose up --build

npm: build
	docker run --rm -it \
	  -v $(PWD)/$(NUXT_APP_DIR):/app \
	  -w /app \
	  -u $(shell id -u):$(shell id -g) \
	  $(DOCKER_DEV_IMAGE) npm $(ARGS)

npx: build
	docker run --rm -it \
	  -v $(PWD)/$(NUXT_APP_DIR):/app \
	  -w /app \
	  -u $(shell id -u):$(shell id -g) \
	  $(DOCKER_DEV_IMAGE) npx $(ARGS)

clean:
	docker compose down -v
	docker rmi $(DOCKER_DEV_IMAGE)
	docker rmi $(DOCKER_PROD_IMAGE)

down:
	docker compose down

up:
	docker compose up --build -d

test: clean up test/smoke test/e2e/headless

test/smoke:
	./tests/smoke/smoke.sh

test/e2e:
	cd tests/e2e && (npm run test || npx codeceptjs run)

test/e2e/headless:
	cd tests/e2e && (npm run test:headless || HEADLESS=true npx codeceptjs run)

logs:
	docker compose logs -f nuxtapp

# --- Run Targets ---
run/dev:
	docker compose up

run/prod: build/prod
	docker run --rm -it -p 3000:3000 comic-safe-prod
