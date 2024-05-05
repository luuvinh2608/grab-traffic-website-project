import requests
from detect import *
import datetime
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
import pytz

AIR_API_KEY = os.environ.get('AIR_API_KEY')


def getAirData(path, db, collection):
    lat = path[3]
    long = path[4]

    url = f'http://api.openweathermap.org/data/2.5/air_pollution?lat={lat}&lon={long}&appid={AIR_API_KEY}'

    try:
        response = requests.get(url)
        data = response.json()

        aqi = data["list"][0]["main"]["aqi"]
        components = data["list"][0]["components"]
        
        time = datetime.datetime.fromtimestamp(data["list"][0]["dt"], datetime.UTC)

        hcm_tz = pytz.timezone('Asia/Ho_Chi_Minh')

        # Convert the UTC time to Saigon time
        hcm_time = time.astimezone(hcm_tz)

        hcm_time = str(hcm_time)
        insert_data = {"aqp": aqi, "components": components, "time": hcm_time}

        db[collection].find_one_and_update(
            {"id": path[0]}, {"$push": {'air_data': insert_data}})

    except Exception as e:
        print("Exception in air quality update ", e)


if __name__ == '__main__':

    MONGO_USER_NAME = os.environ.get('MONGO_USER_NAME')
    MONGO_PASSWORD = os.environ.get('MONGO_PASSWORD')

    # Create a new client and connect to the server
    paths = []
    database = None
    collection = None

    uri = f"mongodb+srv://{MONGO_USER_NAME}:{MONGO_PASSWORD}@cluster0.teog563.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    CLIENT = MongoClient(uri, server_api=ServerApi('1'))
    dbs = CLIENT.list_database_names()

    for db in dbs:
        if db == 'grab-engineering-project':
            database = CLIENT[db]
            collections = database.list_collection_names()
            for collect in collections:
                if collect == 'Place_LatLong_API':
                    collection = collect

    for document in database[collection].find():
        paths.append([document['id'], document['place'],
                     document['request'], document['lat'], document['long']])

    for path in paths:
        getAirData(path, database, collection)
