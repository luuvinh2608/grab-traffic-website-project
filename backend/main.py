from flask import Flask
from flask_restful import Api, Resource
from trafficData import getData, urls

app = Flask(__name__)
api = Api(app)

class index(Resource):
  def get(self):
    return {
      "name": "index",
    }

  def post(self):
    return {
      "name": "index-post",
    }
  

class locationInfo(Resource):
  def get(self, locationId):
    path = urls.paths[locationId]
    data = getData.getData(path)
    return data

api.add_resource(index, "/")
api.add_resource(locationInfo, "/<int:locationId>")

if __name__ == "__main__":
  app.run(debug=True)
