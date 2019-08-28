#!/usr/bin/env python
# coding: utf-8

# In[1]:

import sys
import numpy as np
import re
import pickle 
import nltk
from nltk.corpus import stopwords
from sklearn.datasets import load_files
nltk.download('stopwords')
import pandas
import json


# In[2]:


reviews = pandas.read_csv('tmp/csv/Tweets.csv')
# print(type(reviews))
X,y = reviews.text,reviews.airline_sentiment
type(X)


# In[4]:


y


# In[7]:


corpus = []
for i in range(0, len(X)):
    review = re.sub(r'\W', ' ', str(X[i]))
    review = review.lower()
    review = re.sub(r'^br$', ' ', review)
    review = re.sub(r'\s+br\s+',' ',review)
    review = re.sub(r'\s+[a-z]\s+', ' ',review)
    review = re.sub(r'^b\s+', '', review)
    review = re.sub(r'\s+', ' ', review)
    corpus.append(review)  
    
    


# In[6]:


X.shape


# In[8]:


# print(corpus)


# In[9]:


from sklearn.feature_extraction.text import CountVectorizer
vectorizer = CountVectorizer(max_features = 2000, min_df = 3, max_df = 0.6, stop_words = stopwords.words('english'))
X = vectorizer.fit_transform(corpus).toarray()


# In[10]:


from sklearn.feature_extraction.text import TfidfTransformer
transformer = TfidfTransformer()
X = transformer.fit_transform(X).toarray()


# In[11]:


# print(type(X))


# In[12]:


from sklearn.model_selection import train_test_split
text_train, text_test, sent_train, sent_test = train_test_split(X, y, test_size = 0.20, random_state = 42)


# In[13]:


from sklearn.linear_model import LogisticRegression
classifier = LogisticRegression()
classifier.fit(text_train,sent_train)


# In[14]:


sent_pred = classifier.predict(text_test)


# In[49]:


test_Sent=[sys.argv[1]]


# In[50]:


test_trans=vectorizer.transform(test_Sent)


# In[51]:


predict = classifier.predict(test_trans)

print(predict)

# In[ ]:




