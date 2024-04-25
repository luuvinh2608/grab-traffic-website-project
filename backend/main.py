from flask import Flask
from flask_restful import Api, Resource

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

api.add_resource(index, "/")

if __name__ == "__main__":
  app.run(debug=True)