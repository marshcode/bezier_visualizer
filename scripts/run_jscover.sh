#!/bin/bash
JSCover="$1/JSCover-all.jar"
DocRoot="$2"
NoInstrument=""
port=$3

libs=(qunit tests lib)
for lib in "${libs[@]}"; do
  NoInstrument="$NoInstrument --no-instrument=$lib"
done

java -jar $JSCover -ws --branch --port=$port --document-root=$DocRoot $NoInstrument