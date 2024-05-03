import requests
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

# Create a new client and connect to the server
client = MongoClient(uri, server_api=ServerApi('1'))
db = client['grab-engineering-project']
collection = db['Place_LatLong_API']

air_quality_link = ''
url = requests.get('')


