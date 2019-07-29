#!/usr/bin/env python3
import sys, requests

if len(sys.argv) < 2:
    print("Usage: ./send_json.py [file_name]")
    exit(1)
    
with open(sys.argv[1]) as f:
    content = f.read()

data = {
    "text": content,
    "mode": "gfm"
}

r = requests.post("https://api.github.com/markdown", json=data)
print(r.text)
