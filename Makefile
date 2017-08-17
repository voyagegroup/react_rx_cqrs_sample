NODE_MODULES = ./node_modules
NPM_BIN = $(NODE_MODULES)/.bin
DIST_DIR = __dist

CONTAINER_NAME = techlog_sample
CONTAINER_PORT = 18888

.PHONY: install clean_dist_js clean_obj tsc build_js

install:
	yarn install

clean: clean_dist

clean_dist:
	$(NPM_BIN)/del $(DIST_DIR)

build: clean build_html

build_html:
	$(NPM_BIN)/cpx 'resource/html/**/*' $(DIST_DIR)/ --preserve

preview: clean_nginx
	docker run --name $(CONTAINER_NAME) -p $(CONTAINER_PORT):80 -v $(CURDIR)/$(DIST_DIR):/usr/share/nginx/html:ro nginx:alpine

clean_nginx:
	docker rm $(CONTAINER_NAME)
