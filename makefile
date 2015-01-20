ROOT_DIR      := $(shell dirname $(realpath $(lastword $(MAKEFILE_LIST))))
PORT          := 9090
BUILD_DIR     := $(ROOT_DIR)/_build
SOURCE_TREE   := $(ROOT_DIR)/src/js
TEST_TREE     := $(ROOT_DIR)/src/tests
TEST_TEMPLATE := $(TEST_TREE)/test-runner.template
DIST_DIR      := $(ROOT_DIR)/dist
JS_DIST       := $(DIST_DIR)/js

####################
#servers and testing
####################
start-server:
	python -m SimpleHTTPServer $(PORT) 
test:
	@sensible-browser "http://localhost:$(PORT)/jscoverage.html?/src/tests/test-runner.html"
	@sensible-browser "http://localhost:$(PORT)/jscoverage.html?/src/tests/test-runner-min.html"
	
####################
#compilations
####################
all: js-test

clean: remove_build_dir
	
js-src: create_build_dir
	@scripts/compress_all.sh "$(ROOT_DIR)/lib/yuicompressor" "$(SOURCE_TREE)" "$(BUILD_DIR)/bezierviz-min.js"
	cp "$(BUILD_DIR)/bezierviz-min.js" "$(JS_DIST)/bezierviz-min.js"
js-test: js-src
	@scripts/create_testfile.py "$(ROOT_DIR)" "$(SOURCE_TREE)" "$(TEST_TEMPLATE)" "$(TEST_TREE)/test-runner.html"
	@scripts/create_testfile.py "$(ROOT_DIR)" "$(BUILD_DIR)" "$(TEST_TEMPLATE)" "$(TEST_TREE)/test-runner-min.html"
	
####################
#source tree nonsense
####################
#I don't feel like checking whether the directory exists or not
#always return true so this alway passes
create_build_dir:
	@mkdir $(BUILD_DIR) 2>/dev/null 1>&2 || true

remove_build_dir:
	@rm -rf $(BUILD_DIR)
