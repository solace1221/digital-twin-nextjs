#!/usr/bin/env python3
import json

# Count current Q&A
with open('data/digitaltwin.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

total = sum(len(v) for v in data.get('interview_qa', {}).get('categories', {}).values())
print(f"Current total interview Q&A pairs: {total}")

categories = data.get('interview_qa', {}).get('categories', {})
for cat, questions in categories.items():
    print(f"  {cat}: {len(questions)} questions")
