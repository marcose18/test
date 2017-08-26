import time
import hashlib
import requests
timestamp = time.time()
m = hashlib.md5()
m.update(str(timestamp) + "saltstring" + "http://localhost:8080/insert")

b = "http://localhost:8080/?" + "&signature=" + m.hexdigest() + "&entity=city" + "&name=delhi" + "&timestamp=" + str(timestamp)

temp = requests.get(b)
print b
print temp.text
print temp.headers 

