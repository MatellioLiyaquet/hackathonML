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


reviews = pandas.read_csv('tmp/csv/Tweets_Prediction.csv')

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
    review = re.sub(r'@+', ' ', review)
    corpus.append(review)  
    

 

from sklearn.feature_extraction.text import CountVectorizer
vectorizer = CountVectorizer(max_features = len(corpus), min_df = 3, max_df = 0.6, stop_words = stopwords.words('english'))
X = vectorizer.fit_transform(corpus).toarray()


from sklearn.feature_extraction.text import TfidfTransformer
transformer = TfidfTransformer()
X = transformer.fit_transform(X).toarray()


from sklearn.model_selection import train_test_split
text_train, text_test, sent_train, sent_test = train_test_split(X, y, train_size=0.30, shuffle=True, random_state=42)

from sklearn.linear_model import LogisticRegression
from sklearn.neighbors import KNeighborsClassifier
from sklearn.svm import SVC
from sklearn.metrics import accuracy_score



Classifiers = [
    LogisticRegression(),
    # KNeighborsClassifier(3),
    # SVC(kernel="rbf", C=0.025, probability=True),
 ]

Accuracy=[]
Model=[]
for classifier in Classifiers:
    try:
        fit = classifier.fit(X,y)
        pred = fit.predict(text_test)
        # Use score method to get accuracy of model
        score = classifier.score(text_test, sent_test)
        from sklearn.metrics import classification_report
        report = classification_report(sent_test,pred)
        print(report)
       
    except Exception:
        print( " Exception occures")
    accuracy = accuracy_score(sent_test,pred)*100
    Accuracy.append(accuracy)
    Model.append(classifier.__class__.__name__)
    print('Accuracy of '+classifier.__class__.__name__+'is '+str(accuracy))



