import pandas
import numpy as np
import base64 as base64
import matplotlib.pyplot as plt
Tweet= pandas.read_csv("tmp/csv/Tweets.csv", low_memory=False)

Mood_count=Tweet['sentiments'].value_counts()
Index = [1,2]
plt.bar(Index,Mood_count, color=['green', 'red'])
plt.xticks(Index,['positive','negative'],rotation=0)
plt.ylabel('Mood Count')
plt.xlabel('Mood')
plt.title('Count of Moods')
plt.figure(1,figsize=(100, 20))
#plt.show()

from io import BytesIO
figfile = BytesIO()
plt.savefig('tmp/plots/plot1.jpg', format='png')
figfile.seek(0)
try:
    my_base64_jpgData = base64.b64encode(figfile.read())
    print(my_base64_jpgData)
except:
    print("error occured")    