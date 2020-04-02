import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
import json
from tqdm import tqdm
from tqdm import trange
import time
import logging
from spotipy.client import SpotifyException

LIMIT = 50
MAX_RESULTS = 2000

# create logger with 'spam_application'
logger = logging.getLogger('seed')
logger.setLevel(logging.DEBUG)

# create file handler which logs even debug messages
fh = logging.FileHandler('seed.log')
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

queries = list('abcdefghijklmnopqrstuvwzyz')

iterator = tqdm(queries)
try:
	for query in iterator:
		iterator.set_description("Searching: {}".format(query))
		offset_iterator = trange(0, MAX_RESULTS, LIMIT)
		for curr_offset in offset_iterator:
			time.sleep(0.3)
			results = sp.search(q=query, offset=curr_offset, type='artist', limit=LIMIT)

			if not results['artists']['items']:
				offset_iterator.close()
				break

			with open(query + "_" + str(curr_offset) + ".json", 'w') as out:
				json.dump(results, out, indent=2)

			if results['artists']['next'] is None:
				offset_iterator.close()
				break


except SpotifyException as err:
	logger.exception(err)
	if (err.http_status != 404):
		exit(1)

except Exception as err:
	logger.exception(err)
	exit(1)
	
