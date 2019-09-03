import pandas
import numpy as np
import base64 as base64
from wordcloud import WordCloud,STOPWORDS
import matplotlib.pyplot as plt

Tweet= pandas.read_csv("tmp/csv/Tweets.csv")
df=Tweet[Tweet['sentiments']==1]
words = ' '.join(df['tweets'])

cleaned_word = " ".join([word for word in words.split()
                            if 'http' not in word
                                and not word.startswith('@')
                                and word != 'RT'
                            ])

wordcloud = WordCloud(stopwords=STOPWORDS,
                      background_color='white',
                      width=1000,
                      height=1000
                     ).generate(cleaned_word)



plt.figure(1,figsize=(12, 12))
plt.imshow(wordcloud)
plt.axis('off')
# plt.show()

from io import BytesIO
figfile = BytesIO()
plt.savefig('tmp/plots/plot2.jpg', format='png')
figfile.seek(0)
my_base64_jpgData = base64.b64encode(figfile.read())
print(my_base64_jpgData)