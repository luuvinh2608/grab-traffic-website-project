import requests
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
import os
import json

MONGO_USER_NAME = os.environ.get('MONGO_USER_NAME')
MONGO_PASSWORD = os.environ.get('MONGO_PASSWORD')

uri = f"mongodb+srv://{MONGO_USER_NAME}:{MONGO_PASSWORD}@cluster0.teog563.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

# Create a new client and connect to the server
CLIENT = MongoClient(uri, server_api=ServerApi('1'))
# CLIENT['grab-engineering-project']['Place_LatLong_API'].find_one_and_update({'id': 1},{"$unset": {'traffic_data': 1}})

#CLIENT['grab-engineering-project']['Place_LatLong_API'].find_one_and_update({'id': 1},{"$unset": {'traffic_data': 1}})
for i in range(2, 127):
    CLIENT['grab-engineering-project']['Place_LatLong_API'].find_one_and_update(
        {'id': i}, {"$unset": {'air_data': 1}})




