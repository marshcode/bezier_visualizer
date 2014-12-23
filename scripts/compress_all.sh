#!/bin/bash
yuicompressor="$1/yuicompressor.jar"
input=$2
output=$3

rm $output

for file in `find "$input" -name "*.js"`
do
echo "Compressing $file …"
java -jar $yuicompressor --type js $file >> $output 
done