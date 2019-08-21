#!/bin/bash

# Script run when netlify builds site

# Installations
pip install requests

cd build

# ws_281x
./ws_281x.sh
