ROOT_DIR := $(shell dirname $(realpath $(lastword $(MAKEFILE_LIST))))
PORT := 9090

start-server:
	@scripts/run_jscover.sh "$(ROOT_DIR)/lib/JSCover" "$(ROOT_DIR)" $(PORT)&
	 
stop-server:
	@fuser -k $(PORT)/tcp

test:
	@sensible-browser "http://localhost:$(PORT)/jscoverage.html?/src/tests/test-runner.html"
	