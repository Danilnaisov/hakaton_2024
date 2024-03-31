import requests
import json
import pprint

def GetJSON():
    data = None
    try:
        response = requests.get('https://localhost:7064/api/EventController/List', verify=False)
        response.raise_for_status()  # Raises exception for non-200 responses
        data = response.json()
    except requests.exceptions.RequestException as e:
        print("Ошибка при выполнении запроса:", e)
    except json.JSONDecodeError as e:
        print("Ошибка при декодировании JSON:", e)
    return data

with open("events.json", "w", encoding="utf-8") as f:
    f.write(str(GetJSON()))
    f.close()

print(GetJSON())