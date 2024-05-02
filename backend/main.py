from flask import Flask
from flask_restful import Api, Resource
# from trafficData import getData, urls

app = Flask(__name__)
api = Api(app)


class index(Resource):
  def get(self):
    return {
      "count": 2,
      "time": "2024-04-26 20:31:55.001356",
      "locations": [
        {
          "id": 1,
          "name": "Ba Tháng Hai – Sư Vạn Hạnh",
          "lat": 10.7697784337206 ,
          "lng": 106.670830249786,
          "traffic-quality": 5,
          "aqi": 63
        },
        {
          "id": 2,
          "name": "Lê Văn Sỹ - Huỳnh Văn Bánh",
          "lat": 10.7918902432446 ,
          "lng": 106.671452522278,
          "traffic-quality": 2,
          "aqi": 100
        }
      ]
    }

  
class locationInfo(Resource):
  def get(self, id):
    # path = urls.paths[id]
    # data = getData.getData(path)
    return {
      "id": 1,
      "name": "Ba Tháng Hai - Sư Vạn Hạnh",
      "lat": 10.7697784337206,
      "lng": 106.670830249786,
      "time": "2024-04-26 20:31:55.001356",
      "image_url": "http://giaothong.hochiminhcity.gov.vn/render/ImageHandler.ashx?id=63ae7a50bfd3d90017e8f2b2",
      "traffic_data": {
        "traffic_quality": 5,
        "car": 6,
        "bike": 7,
        "truck": 1,
        "bus": 0,
        "person": 5,
        "motorbike": 3
      },
      "air_data": {
        "aqi": 63,
        "co": 10,
        "no": 15,
        "no2": 14,
        "o3": 11,
        "so2": 19,
        "nh3": 23,
        "pm10": 114,
        "pm2_5": 31
      }
    }


class searchByName(Resource):
  def get(self, name):
    return {
      "count": 3,
      "keyword": "Đinh Tiên Hoàng",
      "locations": [
        {
          "id": 6,
          "name": "Đinh Tiên Hoàng - Võ Thị Sáu 2",
          "lat": 10.7919218604929,
          "long": 106.695785522461
        }, 
        {
          "id": 7,
          "name": "Đinh Tiên Hoàng - Nguyễn Đình Chiểu",
          "lat": 10.788566,
          "long": 106.699558
        }
      ]
    }



api.add_resource(index, "/")
api.add_resource(locationInfo, "/id/<int:id>")
api.add_resource(searchByName, "/name/<string:name>")

if __name__ == "__main__":
  app.run(debug=True)