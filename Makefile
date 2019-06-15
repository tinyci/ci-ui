DOCKER_CMD := docker run -it --rm -u $$(id -u):$$(id -g) -w /node/ci-ui2 -v ${PWD}:/node/ci-ui2 --name react node:latest
DISTFILE := ci-ui.tar.gz
DISTDIR := ci-ui
BUILDDIR := build

start:
	$(DOCKER_CMD) yarn start

shell:
	$(DOCKER_CMD) bash

exec-shell:
	docker exec -it react bash

dist:
	rm -rf $(BUILDDIR) $(DISTFILE) $(DISTDIR)
	$(DOCKER_CMD) yarn build
	mv $(BUILDDIR) $(DISTDIR)
	tar -cvz -f $(DISTFILE) $(DISTDIR)
