import requests, json
from datetime import datetime, timedelta
from collections import Counter

data = requests.get("https://traffic-422115.as.r.appspot.com/location/all")
print(data.content.decode("unicode-escape"))


# data = requests.post("http://127.0.0.1:5000/location/name/search", {"keyword": "ba"})
# print(data.content.decode("unicode-escape"))

# data = requests.post("http://127.0.0.1:5000/location/nearby", {"id": 11, "radius": 2, "number": 4})
# print(data.content.decode("unicode-escape"))

# data = requests.get("http://127.0.0.1:5000/data/current/locationID=31")
# print(data.content.decode("unicode-escape"))

# data = requests.post("http://127.0.0.1:5000/data/daily", {"id": 11})
# print(data.content.decode("unicode-escape"))

# text = "2024-05-07"
# date = datetime.strptime(text, '%Y-%m-%d').replace(hour=0, minute=0, second=0, microsecond=0)
# time_span = datetime.today().replace(hour=0, minute=0, second=0, microsecond=0) - date
# print(time_span.days)
