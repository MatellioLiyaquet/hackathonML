import requests 
import urllib
query = "RT @peterpham: Bought my @AugustSmartLock at the @apple store..pretty good logo match . can't wait to install it! http://t.co/z8VKMhbnR3 "
# http://13.57.238.187:4200/
API_ENDPOINT = "http://192.168.200.110:3001/api/getAnalysisByText?tweet="+query.encode()

r = requests.get(url = API_ENDPOINT) 
  
# extracting response text  
pastebin_url = r.text

print("The pastebin URL is:%s"%pastebin_url) 