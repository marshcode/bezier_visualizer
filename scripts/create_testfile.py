#!/usr/bin/python

import sys
import os

root_dir           = sys.argv[1]
source_dir         = sys.argv[2]
test_template_file = sys.argv[3]
output_file        = sys.argv[4]

SCRIPT_KEY = "%%scripts%%"

print "Creating test file - {file}".format(file=output_file)

#############
#Determine scripts
#############
scripts = []
for current_dir, dirs, files in os.walk(source_dir):
    for fname in files:
        fname = os.path.join(current_dir, fname)
        print "\tincluding - {file}".format(file=fname)
        fname = fname.replace(root_dir, "")
        scripts.append(fname)

##############
#Read template
##############

with open(test_template_file) as f:
    template = f.read();
    
##############
#modify template
##############
script_template = """<script src="{script}"></script>"""
scripts = [ script_template.format(script=script_file) for script_file in scripts  ]
scripts = "\n".join(scripts)
template = template.replace(SCRIPT_KEY, scripts)

##############
#write template
##############
with open(output_file, "wb") as f:
    f.write(template)