.PHONY: build
.DEFAULT_GOAL := build

clean:
	@rm -rf build

bootstrap:
	@sh tools/bootstrap.sh

build:
	@sh tools/build.sh

release: lint clean
	@sh tools/release.sh

develop:
	@sh tools/develop.sh

lint:
	@eslint src lib
