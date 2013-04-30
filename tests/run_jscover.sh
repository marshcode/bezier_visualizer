#!/bin/bash
JSCover=/home/david/workspace/JSCover/target/dist/JSCover-all.jar
DocRoot=/home/david/workspace/bezier_visualizer

java -jar $JSCover -ws --branch --port=7070 --document-root=$DocRoot --no-instrument=qunit --no-instrument=tests --no-instrument=lib