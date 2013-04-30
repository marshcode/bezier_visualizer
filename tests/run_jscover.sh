#!/bin/bash
JSCover=/home/david/workspace/JSCover/target/dist/JSCover-all.jar
DocRoot=/home/david/workspace/bezier_visualizer
NoInstrument=""
port=7070

libs=(qunit tests lib)
for lib in "${libs[@]}"; do
  NoInstrument="$NoInstrument --no-instrument=$lib"
done

echo "http://localhost:$port/jscoverage.html?/tests/test-runner.html"

java -jar $JSCover -ws --branch --port=$port --document-root=$DocRoot $NoInstrument