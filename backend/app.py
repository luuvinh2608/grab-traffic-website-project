import os, requests, json
from flask import Flask, request
from flask_restful import Api, Resource
from flask_pymongo import PyMongo
from datetime import datetime
from database import *
# from trafficData import getData

# set up app
app = Flask(__name__)
api = Api(app)


class location_all(Resource):
  def get(self):
    locations = []
    for document in Place_LatLong_API.find():
      document.pop("_id")
      try:
        document.pop("air_data")
      except:
        pass
      try:
        document.pop("traffic_data")
      except:
        pass
      locations.append(document)
    return {
      "count": len(locations),
      "time": str(datetime.now()),
      "locations": locations
    }


class location_name_search(Resource):
  def post(self):
    name = request.form.get("keyword")
    locations = []
    for document in Place_LatLong_API.find():
      if (name.lower() in document["place"].lower()):
        document.pop("_id")
        try:
          document.pop("air_data")
        except:
          pass
        try:
          document.pop("traffic_data")
        except:
          pass
        locations.append(document)
    return {
      "count": len(locations),
      "keyword": name,
      "locations": locations
    }


class location_name_autofill(Resource):
  def post(self):
    name = request.form.get("keyword")
    print(name)
    locations = []
    for document in Place_LatLong_API.find():
      if (name.lower() in document["place"].lower()):
        locations.append({
          "id": document["id"],
          "place": document["place"]
        })
        print(document["place"])
    return {
      "count": len(locations),
      "keyword": name,
      "locations": locations
    }
  

class data_current(Resource):
  def get(self, id):
    location = Place_LatLong_API.find_one({"id": id})
    sample_traffic = {
      "traffic_data": {
        "traffic_quality": 5,
        "car": 6,
        "bike": 7,
        "truck": 1,
        "bus": 0,
        "person": 5,
        "motorbike": 3
      }
    }
    try:
      traffic_data = location["traffic_data"][-1]
      traffic_data.pop("time")
      traffic_data["traffic_quality"] = 5
    except:
      traffic_data = sample_traffic["traffic_data"]
    air_data = requests.get("http://api.openweathermap.org/data/2.5/air_pollution?lat={lat}&lon={lon}&appid={API}".format(lat = location["lat"], lon = location["long"], API = "a52a17bde8ce5aecda9cf37ef79748ce"))
    air_data = json.loads(air_data.content.decode("utf-8"))["list"][0]
    aqi = air_data["main"]["aqi"]
    air_data = air_data["components"]
    air_data["aqi"] = aqi
    return {
      "id": location["id"],
      "name": location["place"],
      "lat": location["lat"],
      "long": location["long"],
      "time": str(datetime.now()),
      "request": location["request"],
      "traffic_data": traffic_data,
      "air_data": air_data
    }


api.add_resource(location_all, "/location/all")
api.add_resource(location_name_search, "/location/name/search")
api.add_resource(location_name_autofill, "/location/name/autofill")
api.add_resource(data_current, "/data/current/locationID=<int:id>")

if __name__ == "__main__":
  app.run(debug=True, host="0.0.0.0", port=os.environ.get('LISTEN_PORT'))