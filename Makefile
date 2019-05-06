API_URL := "http://${URL_HOST}"
SECURE_API_URL := "https://${URL_HOST}"
WS_URL := "ws://${URL_HOST}"
SECURE_WS_URL := "wss://${URL_HOST}"
USER_ID=$(shell id -u)
GROUP_ID=$(shell id -g)

SECURE_API_ENV_VARS=-e REACT_APP_API_PATH=${URL_PATH} -e REACT_APP_WS_URL=$(SECURE_WS_URL) -e REACT_APP_API_URL=$(SECURE_API_URL) -e ENDPOINT_TYPE=secure
DEFAULT_API_ENV_VARS=-e REACT_APP_API_PATH=${URL_PATH} -e REACT_APP_WS_URL=$(WS_URL) -e REACT_APP_API_URL=$(API_URL) -e ENDPOINT_TYPE=
PATHONLY_API_ENV_VARS=-e REACT_APP_API_PATH=${URL_PATH} -e ENDPOINT_TYPE=pathonly

DOCKER_PRECMD := docker run --rm --name react -it API_VARS \
	-e HOME=/tmp/home -v ${PWD}:/build \
	-u ${USER_ID}:${GROUP_ID} \
	-w /build node:8
#API_ENV_VARS=

setenv:
ifeq ($(ENDPOINT_TYPE),secure)
	$(eval API_ENV_VARS := ${SECURE_API_ENV_VARS})
else ifeq ($(ENDPOINT_TYPE),pathonly)
	$(eval API_ENV_VARS := ${PATHONLY_API_ENV_VARS})
else
	$(eval API_ENV_VARS := ${DEFAULT_API_ENV_VARS})
endif
	echo ${API_ENV_VARS}

all: test-debug

check:
	@if [ -z '${URL_HOST}' ]; then echo 'Set URL_HOST to something you can hit'; exit 1; fi

test:
	yarn install && yarn test # set CI=true to do single test run instead of watch

build-docker:
	bash -c "yarn install \
		&& yarn build --production \
		&& cd build \
		&& tar -vzcpf ../build.tar.gz ."

# docker targets - these targets start containers
test-debug: setenv check
	${DOCKER_PRECMD:API_VARS=$(API_ENV_VARS)} bash -c "yarn install && yarn start"

test-debug-shell: setenv
	${DOCKER_PRECMD:API_VARS=$(API_ENV_VARS)} bash

build: setenv
	${DOCKER_PRECMD:API_VARS=$(API_ENV_VARS)} make build-docker

upgrade-snapshots: setenv
	${DOCKER_PRECMD:API_VARS=$(API_ENV_VARS)} bash -c "yarn install && CI=1 yarn run react-scripts test -u --all"

.PHONY: check test-debug test-debug-shell build setenv
