import requests
import time
from PIL import Image
from detect import *
from datetime import datetime
# from urls import *
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
import datetime

def getTrafficData(path, db, collection):

    url = path[2]
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"}

    # Save image
    k = './data/images/' + f'{path[0]}.jpg'
    timepoint = str(datetime.now())
    try:
        # print(requests.get(url, headers=headers).content)
        if (requests.get(url, headers=headers).headers['Content-Type']):
            with open(k, 'wb') as f:
                f.write(requests.get(url, headers=headers).content)
            # Resizing image
            im = Image.open(k)
            imB = im.resize((1024, 576))
            imB.save(k)
            s = run(source=k, nosave=True)
            x = s.split()
            count, car, bike, truck, bus, person, motorbike = 0, 0, 0, 0, 0, 0, 0
            for part in x:
                if (count >= 3):
                    if ("car" in part):
                        car = int(temp)
                    elif ("truck" in part):
                        truck = int(temp)
                    elif ("bus" in part):
                        bus = int(temp)
                    elif ("motorcycle" in part):
                        motorbike = int(temp)
                    elif ("bicycle" in part):
                        bike = int(temp)
                temp = part
                count += 1

            data = {
                "time": timepoint,
                "car": car,
                "bike": bike,
                "truck": truck,
                "bus": bus,
                "person": person,
                "motorbike": motorbike
            }
            db[collection].find_one_and_update(
                    {"id": path[0]}, {"$push": {'traffic_data': data}})

    except Exception as e:
        print("Exception in traffic data update ", e)


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

    for document in database[collection].find({"id": 1}):
        paths.append([document['id'], document['place'], document['request'], document['lat'], document['long']])
    
    for path in paths:
        getTrafficData(path, database, collection)
