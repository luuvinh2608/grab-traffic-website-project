import requests, json

# data = requests.get("http://127.0.0.1:5000/location/name/autofill/ba")
# print(data.content.decode("unicode-escape"))


data = requests.post("http://127.0.0.1:5000/location/nearby", {"id": 11, "radius": 2, "number": 4})
print(data.content.decode("unicode-escape"))