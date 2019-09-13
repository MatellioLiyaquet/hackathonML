import pandas
import numpy as np
import base64 as base64
import matplotlib.pyplot as plt
Tweet= pandas.read_csv("tmp/csv/Tweets_Prediction.csv", low_memory=False)
import matplotlib.pyplot as plt

# Ploting PIE Charts
Mood_count=Tweet['sentiments'].value_counts()
labels = 'positive','negative'
sizes = Mood_count
explode = (0, 0)

fig1, ax1 = plt.subplots()
ax1.pie(sizes, explode=explode, labels=labels, colors=['green', 'red'], autopct='%1.1f%%', shadow=True, startangle=90)
ax1.axis('equal')  # Equal aspect ratio ensures that pie is drawn as a circle.

#plt.show()

from io import BytesIO
figfile = BytesIO()
plt.savefig('tmp/plots/plot3.jpg', format='png')
figfile.seek(0)
try:
    my_base64_jpgData = base64.b64encode(figfile.read())
    print(my_base64_jpgData)
except:
    print("error occured") 