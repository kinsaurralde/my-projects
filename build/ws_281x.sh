#!/bin/bash

# Convert README.md to HTML in github style
./github_markdown.py ws_281x/README.md > ws_281x/temp_readme.html
./add_github_css.py ws_281x/temp_readme.html > ws_281x/readme.html
rm ws_281x/temp_readme.html
