import requests, json

# data = requests.get("http://127.0.0.1:5000/location/name/autofill/ba")
# print(data.content.decode("unicode-escape"))


data = requests.post("http://127.0.0.1:5000/location/name/search", {"keyword": "ba"})
print(data.content.decode("unicode-escape"))