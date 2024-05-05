import os, requests, json
from flask import Flask, request
from flask_restful import Api, Resource
from flask_pymongo import PyMongo
from datetime import datetime
from database import *
import math
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
  

class location_nearby(Resource):
  def post(self):
    id = int(request.form.get("id"))
    center = Place_LatLong_API.find_one({"id":id})
    try:
      radius = float(request.form.get("radius"))
    except:
      radius = 3
    try:
      number = int(request.form.get("number"))
    except:
      number = 3
    locations = []
    for document in Place_LatLong_API.find():
      distance = math.sqrt((float(document["lat"])-float(center["lat"]))**2 + (float(document["long"])-float(center["long"]))**2) * 111
      if ( distance < radius ) and (int(document["id"]) != id):
        locations.append({
          "id": document["id"],
          "place": document["place"],
          "distance": distance
        })
    locations = sorted(locations, key=lambda d: d['distance'])[0:number]
    return {
      "count": len(locations),
      "param": {
        "radius": radius,
        "number": number
      },
      "center": {
        "id": id,
        "place": center["place"]
      },
      "locations": locations
    }


class data_current(Resource):
  def get(self, id):
    location = Place_LatLong_API.find_one({"id": id})
    traffic_data = location["traffic_data"][-1]
    traffic_data.pop("time")
    traffic_index = (traffic_data["person"] + (traffic_data["bike"] + traffic_data["motorbike"])*2 + 
                     traffic_data["car"]*5 + (traffic_data["truck"] + traffic_data["bus"])*15)
    if (traffic_index < 10):
      traffic_data["traffic_quality"] = 1
    elif (traffic_index < 20):
      traffic_data["traffic_quality"] = 2
    elif (traffic_index < 35):
      traffic_data["traffic_quality"] = 3
    elif (traffic_index < 50):
      traffic_data["traffic_quality"] = 4
    else:
      traffic_data["traffic_quality"] = 5
    air_data = location["air_data"][-1]
    air_quality = air_data["aqp"]
    air_data = air_data["components"]
    air_data["air_quality"] = air_quality
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
api.add_resource(location_nearby, "/location/nearby")
api.add_resource(data_current, "/data/current/locationID=<int:id>")

if __name__ == "__main__":
  app.run(debug=True, host="0.0.0.0", port=os.environ.get('LISTEN_PORT'))