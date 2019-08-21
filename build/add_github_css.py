#!/usr/bin/env python
import sys

if len(sys.argv) < 2:
    print("Usage: ./add_github_css.py [filename]")
    exit(1)

file_contents = []
with open(sys.argv[1]) as f:
    file_contents = f.readlines()
file_contents = [x.strip() for x in file_contents] 

print("<link rel='stylesheet' href='github-markdown.css'>")
print("<div class='markdown-body'>")
for line in file_contents:
    print(line)
print("</div>")
