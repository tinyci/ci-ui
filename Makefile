start:
	docker run -it --rm -u $$(id -u):$$(id -g) -w /node/ci-ui2 -v ${PWD}:/node/ci-ui2 --name react node:latest yarn start

shell:
	docker run -it --rm -u $$(id -u):$$(id -g) -w /node/ci-ui2 -v ${PWD}:/node/ci-ui2 --name react node:latest bash

exec-shell:
	docker exec -it react bash
