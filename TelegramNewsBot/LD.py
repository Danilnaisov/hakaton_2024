import json
from pprint import pprint
with open("events.json", "r", encoding="utf-8") as f:
    text = json.load(f)
    for p in text:
        for x in p['category']:
            if x == "":
                print(p['id'], x)
                break
    f.close()
