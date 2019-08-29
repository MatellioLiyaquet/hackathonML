import pandas
import numpy as np
import base64 as base64
import matplotlib.pyplot as plt

Tweet= pandas.read_csv("tmp/csv/Tweets.csv")

Mood_count=Tweet['sentiments'].value_counts()
Index = [1,2,3]
plt.bar(Index,Mood_count)
plt.xticks(Index,['negative','neutral','positive'],rotation=45)
plt.ylabel('Mood Count')
plt.xlabel('Mood')
plt.title('Count of Moods')
plt.figure(1,figsize=(20, 20))
#plt.show()

from io import BytesIO
figfile = BytesIO()
plt.savefig(figfile, format='png')
figfile.seek(0)
my_base64_jpgData = base64.b64encode(figfile.read())
print(my_base64_jpgData)