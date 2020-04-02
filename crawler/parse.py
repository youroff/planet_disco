import requests
import json
import csv
import time
import json
import sys
import time


class WebPlayerToken:
	def __init__(self):
		self.__get_fresh_token()

	def __get_fresh_token(self):
		token_url = "https://open.spotify.com/get_access_token?reason=transport&productType=web_player"
		r = requests.get(token_url)
		if r:
			j = r.json()
			self.token = j['accessToken']
			self.expiration = j['accessTokenExpirationTimestampMs']
		else:
			raise Exception("Couldn't obtain web player token")

	def __is_token_stale(self):
		if self.expiration < WebPlayerToken.__timestamp_ms_now():
			return True	
		return False


	def __timestamp_ms_now():
		return time.time() * 1000

	def __get_token(self):
		if self.__is_token_stale():
			self.__get_fresh_token()
		return self.token

	def get_token(self):
		return "Bearer {}".format(self.__get_token())

class APIWrapper:
	URL_FORMAT = "https://spclient.wg.spotify.com/open-backend-2/v1/artists/{}"
	USER_AGENT = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:73.0) Gecko/20100101 Firefox/73.0"

	def __init__(self):
		self.token_manager = WebPlayerToken()

	def get_player_artist_info(self, spotify_id):
		url = APIWrapper.URL_FORMAT.format(spotify_id)
		t = self.token_manager.get_token()
		r = requests.get(url, headers={"User-Agent": APIWrapper.USER_AGENT, "Accept": "application/json",  "Authorization": t})
		if not r:
			raise Exception("Couldn't get player artist info")

		return r.text #r.json()


if __name__ == "__main__":
	result = APIWrapper().get_player_artist_info("30F64wQIHvLiFTGaNZ73nU")
	j = json.loads(result)
	print(json.dumps(j, indent=2))
