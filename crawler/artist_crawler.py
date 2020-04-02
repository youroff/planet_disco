import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
import json
from tqdm import tqdm
from tqdm import trange
import time
import logging
from spotipy.client import SpotifyException
from defs import *
import redis
from pathlib import Path

status = ""

SAVE_DIR = "/Users/akashuba/V/spot/artists/"
dir_number = 0
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
	global files_created

	artist_range  = r.zrevrange(ARTIST_QUEUE, 0, 0, True)
	next_el, popularity = artist_range[0]
	next_el = next_el.decode("utf-8")
	if r.sismember(CRAWLED_SET, next_el):
		r.zrem(ARTIST_QUEUE, next_el)
		return

	global status
	status += ", crawling {}, popularity: {}".format(next_el, popularity)

	time.sleep(0.3)
	results = sp.artist_related_artists(full_uri(next_el))

	curr_dir = get_dir()
	with open(curr_dir + next_el + ".json", 'w') as out:
		json.dump(results, out, indent=2)

	for item in results['artists']:
		uri = strip_uri(item['uri'])
		popularity = item['popularity']
		r.zadd(ARTIST_QUEUE, {uri: popularity})
		r.zadd(CITY_QUEUE, {uri: popularity})

	files_created += 1
	r.sadd(CRAWLED_SET, next_el)
	r.zrem(ARTIST_QUEUE, next_el)


logger = logging.getLogger('artists')
logger.setLevel(logging.DEBUG)

fh = logging.FileHandler('artists.log')
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

sp = spotipy.Spotify(client_credentials_manager=SpotifyClientCredentials())

r = redis.Redis()

try:
	to_crawl = r.zcount(ARTIST_QUEUE, '-inf', '+inf')
	while to_crawl > 0:
		crawled = r.scard(CRAWLED_SET)
		status = "[STATUS]: crawled: {}, in queue: {}".format(crawled, to_crawl)
		crawl_next()
		print(status, end="\r")
		to_crawl = r.zcount(ARTIST_QUEUE, '-inf', '+inf')

except SpotifyException as err:
	logger.exception(err)
	if (err.http_status != 404):
		exit(1)

except Exception as err:
	logger.exception(err)
	exit(1)
	
