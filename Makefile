DOCKER_CMD_PREFIX := docker run --rm -u $$(id -u):$$(id -g) -w /node/ci-ui2 -v ${PWD}:/node/ci-ui2
DOCKER_RUN_SUFFIX := -it --name react node:latest
DOCKER_RUN := ${DOCKER_CMD_PREFIX} ${DOCKER_RUN_SUFFIX}
DISTFILE := ci-ui.tar.gz
DISTDIR := ci-ui
DIST_NODE_VERSION := 11
BUILDDIR := build

start:
	$(DOCKER_RUN) yarn start

shell:
	$(DOCKER_RUN) bash

exec-shell:
	docker exec -it react bash

dist:
	rm -rf $(BUILDDIR) $(DISTFILE) $(DISTDIR)
	$(DOCKER_CMD_PREFIX) node:$(DIST_NODE_VERSION) bash -c "yarn install && yarn build"
	mv $(BUILDDIR) $(DISTDIR)
	tar -cvz -f $(DISTFILE) $(DISTDIR)
