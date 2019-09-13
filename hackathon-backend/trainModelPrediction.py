#!/usr/bin/env python
# coding: utf-8

import re
import pickle 
import nltk
from nltk.corpus import stopwords
from sklearn.datasets import load_files
nltk.download('stopwords')
import pandas
import json

# reading data from csv file
reviews = pandas.read_csv('tmp/csv/Tweets_Prediction.csv')

# Retrieving dependent and independent variables
X,y = reviews.tweets,reviews.sentiments

# Creating Corpus and Cleaning up dataset
corpus = []
for i in range(0, len(X)):
    review = re.sub(r'\W', ' ', str(X[i]))
    review = review.lower()
    review = re.sub(r'^br$', ' ', review)
    review = re.sub(r'\s+br\s+',' ',review)
    review = re.sub(r'\s+[a-z]\s+', ' ',review)
    review = re.sub(r'^b\s+', '', review)
    review = re.sub(r'\s+', ' ', review)
    review = re.sub(r'@+', ' ', review)
    corpus.append(review)  
    

db = {} 


# Converting text into numeric values and removing stopwords using NLTK library
from sklearn.feature_extraction.text import CountVectorizer
vectorizer = CountVectorizer(max_features = len(corpus), min_df = 3, max_df = 0.6, stop_words = stopwords.words('english'))
X = vectorizer.fit_transform(corpus).toarray()
db['vectorizer'] = vectorizer


# Converting text into numeric values
from sklearn.feature_extraction.text import TfidfTransformer
transformer = TfidfTransformer()
X = transformer.fit_transform(X).toarray()

# Spliting into training and test datasets
from sklearn.model_selection import train_test_split
text_train, text_test, sent_train, sent_test = train_test_split(X, y, train_size=0.30, random_state=101)

from sklearn.linear_model import LogisticRegression
from sklearn.neighbors import KNeighborsClassifier
from sklearn.svm import SVC
from sklearn.metrics import accuracy_score


# Classification Logistic Regression Model

Accuracy=[]

try:
    classifier = LogisticRegression()
    Model = classifier.fit(text_train,sent_train)
    pred = Model.predict(text_test)
    # Use score method to get accuracy of model
    score = classifier.score(text_test, sent_test)
    from sklearn.metrics import classification_report
    report = classification_report(sent_test,pred)
    print(report)
    db['model'] = Model
except Exception:
    print( " Exception occures")
accuracy = accuracy_score(sent_test,pred)*100
Accuracy.append(accuracy)
print('Accuracy of '+classifier.__class__.__name__+'is '+str(accuracy))

# Writing Pickle File
dbfile = open('picklePrediiction', 'ab')
pickle.dump(db, dbfile)                      
dbfile.close()

