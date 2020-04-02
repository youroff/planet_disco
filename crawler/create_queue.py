import os
import glob
import json
import redis
from defs import *
from tqdm import tqdm

DIR = "/Users/akashuba/V/spot/seed/*.json"
r = redis.Redis()

for filepath in tqdm(glob.iglob(DIR)):
	with open(filepath, "r") as f:
		j = json.load(f)
		for item in j['artists']['items']:
			full_uri = item['uri']
			uri = full_uri.split(":")[2]
			popularity = item['popularity']
			r.zadd(CITY_QUEUE, {uri: popularity})
			r.zadd(ARTIST_QUEUE, {uri: popularity})
