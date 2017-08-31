NODE_MODULES = ./node_modules
NPM_BIN = $(NODE_MODULES)/.bin
DIST_DIR = __dist

CONTAINER_NAME = techlog_sample
CONTAINER_PORT = 18888

.PHONY: run install clean clean_obj clean_dist build build_html build_js tsc webpack preview clean_nginx lint tslint

run: install build preview

install:
	npm install
	$(NPM_BIN)/yarn install

clean: clean_obj clean_dist

clean_obj:
	$(NPM_BIN)/del __obj

clean_dist:
	$(NPM_BIN)/del $(DIST_DIR)

build: clean lint build_html build_js

build_html:
	$(NPM_BIN)/cpx 'resource/html/**/*' $(DIST_DIR)/ --preserve

build_js: tsc webpack

tsc: clean_obj
	$(NPM_BIN)/tsc --project .

webpack:
	$(NPM_BIN)/webpack --config ./webpack.config.js

preview: clean_nginx
	docker run --name $(CONTAINER_NAME) -p $(CONTAINER_PORT):80 -v $(CURDIR)/$(DIST_DIR):/usr/share/nginx/html:ro nginx:alpine

clean_nginx:
	-docker rm $(CONTAINER_NAME)

lint: tslint

tslint:
	$(NPM_BIN)/tslint --config ./tslint.json '$(CURDIR)/src/**/*.ts{,x}'
