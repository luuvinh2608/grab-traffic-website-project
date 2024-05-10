import os, requests, json
from flask import Flask, request
from flask_restful import Api, Resource
from flask_cors import CORS, cross_origin
from flask_pymongo import PyMongo
from datetime import datetime, timedelta
from collections import Counter
from database import *
from aqiCalculator import *
import math
# from trafficData import getData

# set up app
app = Flask(__name__)
api = Api(app)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'


class hello(Resource):
  def get(self):
    return {"Welcome": "Hellow World"}


class location_all(Resource):
  def get(self):
    locations = []
    for document in Place_LatLong_API.find({}, {"traffic_data":0, "air_data":0, "_id": 0}):
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
    for document in Place_LatLong_API.find({}, {"traffic_data":0, "air_data":0, "_id": 0}):
      if (name.lower() in document["place"].lower()):
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
    for document in Place_LatLong_API.find({}, {"traffic_data":0, "air_data":0, "_id": 0}):
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
    center = Place_LatLong_API.find_one({"id":id}, {"traffic_data":0, "air_data":0, "_id": 0})
    try:
      radius = float(request.form.get("radius"))
    except:
      radius = 3
    try:
      number = int(request.form.get("number"))
    except:
      number = 3
    locations = []
    for document in Place_LatLong_API.find({}, {"traffic_data":0, "air_data":0, "_id": 0}):
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
    if (traffic_index < 16):
      traffic_data["traffic_quality"] = 1
    elif (traffic_index < 26):
      traffic_data["traffic_quality"] = 2
    elif (traffic_index < 36):
      traffic_data["traffic_quality"] = 3
    elif (traffic_index < 46):
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


class data_daily(Resource):
  def post(self):
    id = int(request.form.get("id"))
    try:
      today = datetime.strptime(request.form.get("date"), '%Y-%m-%d')
    except:
      today = datetime.today().replace(hour=0, minute=0, second=0, microsecond=0)
    location = Place_LatLong_API.find_one({"id": id})
    tomorrow = today + timedelta(1)
    traffic_data = location["traffic_data"]
    traffic_data_hour = [
      {
        "hour": i,
        "car": 0,
        "bike": 0,
        "truck": 0,
        "bus": 0,
        "person": 0,
        "motorbike": 0,
        "count": 0,
        "traffic_quality_index": 0
      } for i in range(0, 24)
    ]
    traffic_data = location["traffic_data"]
    for traffic_piece in traffic_data:
      traffic_piece_time = datetime.strptime(traffic_piece["time"], '%Y-%m-%d %H:%M:%S.%f+07:00')
      hour = traffic_piece_time.hour
      if (traffic_piece_time >= today) and (traffic_piece_time < tomorrow):
        traffic_data_hour[hour]["count"] += 1
        traffic_data_hour[hour]["car"] += traffic_piece["car"]
        traffic_data_hour[hour]["bike"] += traffic_piece["bike"]
        traffic_data_hour[hour]["truck"] += traffic_piece["truck"]
        traffic_data_hour[hour]["bus"] += traffic_piece["bus"]
        traffic_data_hour[hour]["person"] += traffic_piece["person"]
        traffic_data_hour[hour]["motorbike"] += traffic_piece["motorbike"]
        traffic_data_hour[hour]["traffic_quality_index"] += (traffic_piece["person"] + (traffic_piece["bike"] + traffic_piece["motorbike"])*2 +
                                                      (traffic_piece["truck"] + traffic_piece["bus"])*15 + traffic_piece["car"]*5)
    air_data = location["air_data"]
    air_data_hour = [
      {
        "hour": i,
        "co": 0,
        "no": 0,
        "no2": 0,
        "o3": 0,
        "so2": 0,
        "pm2_5": 0,
        "pm10": 0,
        "nh3": 0,
        "count": 0,
        "air_quality_index": 0
      } for i in range(0, 24)
    ]
    for air_piece in air_data:
      air_piece_time = datetime.strptime(air_piece["time"], '%Y-%m-%d %H:%M:%S+07:00')
      hour = air_piece_time.hour
      if (air_piece_time >= today) and (air_piece_time < tomorrow):
        air_data_hour[hour]["co"] += air_piece["components"]["co"]
        air_data_hour[hour]["no"] += air_piece["components"]["no"]
        air_data_hour[hour]["no2"] += air_piece["components"]["no2"]
        air_data_hour[hour]["o3"] += air_piece["components"]["o3"]
        air_data_hour[hour]["so2"] += air_piece["components"]["so2"]
        air_data_hour[hour]["pm2_5"] += air_piece["components"]["pm2_5"]
        air_data_hour[hour]["pm10"] += air_piece["components"]["pm10"]
        air_data_hour[hour]["nh3"] += air_piece["components"]["nh3"]
        air_data_hour[hour]["count"] += 1
    for air_data_piece in air_data_hour:
      if (air_data_piece["count"] > 0):
        air_data_piece["co"] /= air_data_piece["count"]
        air_data_piece["no"] /= air_data_piece["count"]
        air_data_piece["no2"] /= air_data_piece["count"]
        air_data_piece["o3"] /= air_data_piece["count"]
        air_data_piece["so2"] /= air_data_piece["count"]
        air_data_piece["pm2_5"] /= air_data_piece["count"]
        air_data_piece["pm10"] /= air_data_piece["count"]
        air_data_piece["nh3"] /= air_data_piece["count"]
      air_data_piece["air_quality_index"] = max(
        calculate_aqi(air_data_piece["co"] * 0.873 * 0.001, "co"), # Convert from miligram/m3 to ppm
        calculate_aqi(air_data_piece["no2"] * 0.531 * 1, "no2"), # Convert from miligram/m3 to ppb
        calculate_aqi(air_data_piece["so2"] * 0.382 * 1, "so2"), # Convert from miligram/m3 to ppb
        calculate_aqi(air_data_piece["o3"] * 0.509 * 0.001, "o3"), # Convert from miligram/m3 to ppm
        calculate_aqi(air_data_piece["pm2_5"], "pm2_5"), # Convert from miligram/m3 to ppm
        calculate_aqi(air_data_piece["pm10"], "pm10"), # Convert from miligram/m3 to ppm
      )
    return {
      "id": location["id"],
      "name": location["place"],
      "lat": location["lat"],
      "long": location["long"],
      "date": str(today),
      "traffic_data_hour": traffic_data_hour,
      "air_data_hour": air_data_hour
    }


class data_weekly(Resource):
  def post(self):
    id = int(request.form.get("id"))
    try:
      today = datetime.strptime(request.form.get("date"), '%Y-%m-%d')
    except:
      today = datetime.today().replace(hour=0, minute=0, second=0, microsecond=0)
    location = Place_LatLong_API.find_one({"id": id})
    tomorrow = today + timedelta(1)
    beginday = today - timedelta(6)
    traffic_data = location["traffic_data"]
    traffic_data_hour = [
      {
        "day": i,
        "car": 0,
        "bike": 0,
        "truck": 0,
        "bus": 0,
        "person": 0,
        "motorbike": 0,
        "count": 0,
        "traffic_quality_index": 0
      } for i in range(0, 7)
    ]
    traffic_data = location["traffic_data"]
    for traffic_piece in traffic_data:
      traffic_piece_time = datetime.strptime(traffic_piece["time"], '%Y-%m-%d %H:%M:%S.%f+07:00')
      day = (traffic_piece_time.replace(hour=0, minute=0, second=0, microsecond=0) - beginday).days
      if (traffic_piece_time >= beginday) and (traffic_piece_time < tomorrow):
        traffic_data_hour[day]["count"] += 1
        traffic_data_hour[day]["car"] += traffic_piece["car"]
        traffic_data_hour[day]["bike"] += traffic_piece["bike"]
        traffic_data_hour[day]["truck"] += traffic_piece["truck"]
        traffic_data_hour[day]["bus"] += traffic_piece["bus"]
        traffic_data_hour[day]["person"] += traffic_piece["person"]
        traffic_data_hour[day]["motorbike"] += traffic_piece["motorbike"]
        traffic_data_hour[day]["traffic_quality_index"] += (traffic_piece["person"] + (traffic_piece["bike"] + traffic_piece["motorbike"])*2 +
                                                      (traffic_piece["truck"] + traffic_piece["bus"])*15 + traffic_piece["car"]*5)
    air_data = location["air_data"]
    air_data_hour = [
      {
        "day": i,
        "co": 0,
        "no": 0,
        "no2": 0,
        "o3": 0,
        "so2": 0,
        "pm2_5": 0,
        "pm10": 0,
        "nh3": 0,
        "count": 0,
        "air_quality_index": 0
      } for i in range(0, 7)
    ]
    for air_piece in air_data:
      air_piece_time = datetime.strptime(air_piece["time"], '%Y-%m-%d %H:%M:%S+07:00')
      day = (air_piece_time.replace(hour=0, minute=0, second=0, microsecond=0) - beginday).days
      if (air_piece_time >= beginday) and (air_piece_time < tomorrow):
        air_data_hour[day]["co"] += air_piece["components"]["co"]
        air_data_hour[day]["no"] += air_piece["components"]["no"]
        air_data_hour[day]["no2"] += air_piece["components"]["no2"]
        air_data_hour[day]["o3"] += air_piece["components"]["o3"]
        air_data_hour[day]["so2"] += air_piece["components"]["so2"]
        air_data_hour[day]["pm2_5"] += air_piece["components"]["pm2_5"]
        air_data_hour[day]["pm10"] += air_piece["components"]["pm10"]
        air_data_hour[day]["nh3"] += air_piece["components"]["nh3"]
        air_data_hour[day]["count"] += 1
    for air_data_piece in air_data_hour:
      if (air_data_piece["count"] > 0):
        air_data_piece["co"] /= air_data_piece["count"]
        air_data_piece["no"] /= air_data_piece["count"]
        air_data_piece["no2"] /= air_data_piece["count"]
        air_data_piece["o3"] /= air_data_piece["count"]
        air_data_piece["so2"] /= air_data_piece["count"]
        air_data_piece["pm2_5"] /= air_data_piece["count"]
        air_data_piece["pm10"] /= air_data_piece["count"]
        air_data_piece["nh3"] /= air_data_piece["count"]
      air_data_piece["air_quality_index"] = max(
        calculate_aqi(air_data_piece["co"] * 0.873 * 0.001, "co"), # Convert from miligram/m3 to ppm
        calculate_aqi(air_data_piece["no2"] * 0.531 * 1, "no2"), # Convert from miligram/m3 to ppb
        calculate_aqi(air_data_piece["so2"] * 0.382 * 1, "so2"), # Convert from miligram/m3 to ppb
        calculate_aqi(air_data_piece["o3"] * 0.509 * 0.001, "o3"), # Convert from miligram/m3 to ppm
        calculate_aqi(air_data_piece["pm2_5"], "pm2_5"), # Convert from miligram/m3 to ppm
        calculate_aqi(air_data_piece["pm10"], "pm10"), # Convert from miligram/m3 to ppm
      )
    return {
      "id": location["id"],
      "name": location["place"],
      "lat": location["lat"],
      "long": location["long"],
      "date": str(today),
      "traffic_data_day": traffic_data_hour,
      "air_data_day": air_data_hour
    }


class ranking_current(Resource):
  def get(self):
    pass


class ranking_daily(Resource):
  def get(self):
    pass


class ranking_weekly(Resource):
  def get(self):
    pass


api.add_resource(hello, "/")
api.add_resource(location_all, "/location/all")
api.add_resource(location_name_search, "/location/name/search")
api.add_resource(location_name_autofill, "/location/name/autofill")
api.add_resource(location_nearby, "/location/nearby")
api.add_resource(data_current, "/data/current/locationID=<int:id>")
api.add_resource(data_daily, "/data/daily")
api.add_resource(data_weekly, "/data/weekly")
api.add_resource(ranking_current, "/ranking/current")
api.add_resource(ranking_daily, "/ranking/daily")
api.add_resource(ranking_weekly, "/ranking/weekly")

if __name__ == "__main__":
  app.run(debug=True, host="0.0.0.0", port=os.environ.get('LISTEN_PORT'))