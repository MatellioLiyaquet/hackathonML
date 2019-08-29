import pandas
import numpy as np
import base64 as base64

Tweet= pandas.read_csv("tmp/csv/Tweets.csv")

Mood_count=Tweet['sentiments'].value_counts()
Index = [1,2,3]
plt.bar(Index,Mood_count)
plt.xticks(Index,['negative','neutral','positive'],rotation=45)
plt.ylabel('Mood Count')
plt.xlabel('Mood')
plt.title('Count of Moods')
plt.figure(1,figsize=(12, 12))
plt.show()

# from io import BytesIO
# figfile = BytesIO()
# plt.savefig('tmp/plots/plot1.png')
# figfile.seek(0)  # rewind to beginning of file
# import base64
# # figdata_png = base64.b64encode(figfile.read())
# figdata_png = base64.b64encode(figfile.getvalue())
# print(figdata_png)