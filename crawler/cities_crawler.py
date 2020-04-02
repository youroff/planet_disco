import spotipy
import json
from tqdm import tqdm
from tqdm import trange
import time
import logging
from defs import *
import redis
from parse import *
from pathlib import Path

status = ""
api = APIWrapper()

SAVE_DIR = "/Users/akashuba/V/spot/cities/"
dir_number = 1
files_created = 1000
MAX_FILES_PER_DIR = 1000

def strip_uri(full_uri):
	return full_uri.split(":")[2]

def full_uri(uri):
	return "spotify:artist:" + uri

def get_dir():
	global files_created
	global dir_number

	if files_created >= MAX_FILES_PER_DIR:
		dir_number += 1
		Path(SAVE_DIR + "/" + str(dir_number)).mkdir(parents=True, exist_ok=True)
		files_created = 0

	return SAVE_DIR + "/" + str(dir_number) + "/"

def crawl_next():
	global status
	global api
	global files_created

	city_range  = r.zrevrange(CITY_QUEUE, 0, 0, True)
	next_el, popularity = city_range[0]
	next_el = next_el.decode("utf-8")

	status += ", crawling {}, popularity: {}".format(next_el, popularity)

	time.sleep(0.3)
	results = api.get_player_artist_info(next_el)
	results = json.loads(results)

	curr_dir = get_dir()
	with open(curr_dir + next_el + ".json", 'w') as out:
		json.dump(results, out, indent=2)

	files_created += 1

	r.zrem(CITY_QUEUE, next_el)


logger = logging.getLogger('cities')
logger.setLevel(logging.DEBUG)

fh = logging.FileHandler('cities.log')
fh.setLevel(logging.DEBUG)

ch = logging.StreamHandler()
ch.setLevel(logging.DEBUG)

# create formatter and add it to the handlers
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
fh.setFormatter(formatter)
ch.setFormatter(formatter)

# add the handlers to the logger
logger.addHandler(fh)
logger.addHandler(ch)


r = redis.Redis()

try:
	to_crawl = r.zcount(CITY_QUEUE, '-inf', '+inf')
	while to_crawl > 0:
		status = "[STATUS]: in queue: {}".format(to_crawl)
		crawl_next()
		print(status, end="\r")
		to_crawl = r.zcount(CITY_QUEUE, '-inf', '+inf')

except Exception as err:
	logger.exception(err)
	exit(1)
	
