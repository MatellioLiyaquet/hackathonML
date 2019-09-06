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


reviews = pandas.read_csv('tmp/csv/Tweets.csv')

X,y = reviews.tweets,reviews.sentiments

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
    

db = {} 

from sklearn.feature_extraction.text import CountVectorizer
vectorizer = CountVectorizer(max_features = 2000, min_df = 3, max_df = 0.6, stop_words = stopwords.words('english'))
X = vectorizer.fit_transform(corpus).toarray()
db['vectorizer'] = vectorizer

from sklearn.feature_extraction.text import TfidfTransformer
transformer = TfidfTransformer()
X = transformer.fit_transform(X).toarray()


from sklearn.model_selection import train_test_split
text_train, text_test, sent_train, sent_test = train_test_split(X, y, test_size = 0.20, random_state = 42)


from sklearn.linear_model import LogisticRegression
classifier = LogisticRegression()
classifier.fit(text_train,sent_train)
db['classifier'] = classifier

dbfile = open('trainingPickle', 'ab')
pickle.dump(db, dbfile)                      
dbfile.close()


#!/usr/bin/env python
# coding: utf-8


# e_tok = re.compile(f'([{string.punctuation}«»®´·º½¾¿¡§£₤‘’])')
# def tokenize(s): return re_tok.sub(r' \1 ', s).split()

# from sklearn.model_selection import train_test_split
# X_train, X_test, y_train, y_test = train_test_split(X, y, test_size = 0.20)



# tf_train = vect.fit_transform(X_train.ravel())
# tf_test = vect.transform(X_test)

# p = tf_train[y_train==1].sum(0) + 1
# print(p)
# q = tf_train[y_train==0].sum(0) + 1
# r = np.log((p/p.sum()) / (q/q.sum()))
# b = np.log(len(p) / len(q))
# pre_preds = tf_test * r.T + b
# print(pre_preds)
# preds = pre_preds.T > 0
# accuracy = (preds == y_test).mean()
# print(accuracy)

