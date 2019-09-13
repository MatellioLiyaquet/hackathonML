#!/usr/bin/env python
# coding: utf-8

import sys
# import numpy as np
import re
import pickle 
import nltk
from nltk.corpus import stopwords
from sklearn.datasets import load_files
nltk.download('stopwords')
import pandas
import json


reviews = pandas.read_csv('tmp/csv/Tweets_Relevancy.csv')

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
    

db = {} 

from sklearn.feature_extraction.text import CountVectorizer
vectorizer = CountVectorizer(max_features = 200000, min_df = 3, max_df = 0.6, stop_words = stopwords.words('english'))
X = vectorizer.fit_transform(corpus).toarray()
db['vectorizer'] = vectorizer

from sklearn.feature_extraction.text import TfidfTransformer
transformer = TfidfTransformer()
X = transformer.fit_transform(X).toarray()


from sklearn.model_selection import train_test_split
text_train, text_test, sent_train, sent_test = train_test_split(X, y, shuffle = True)

from sklearn.linear_model import LogisticRegression
from sklearn.neighbors import KNeighborsClassifier
from sklearn.svm import SVC, LinearSVC, NuSVC
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier, AdaBoostClassifier, GradientBoostingClassifier
from sklearn.naive_bayes import BernoulliNB
from sklearn.discriminant_analysis import LinearDiscriminantAnalysis
from sklearn.discriminant_analysis import QuadraticDiscriminantAnalysis
from sklearn.metrics import accuracy_score




Classifiers = [
    LogisticRegression(),
    # KNeighborsClassifier(3),
    # SVC(kernel="rbf", C=0.025, probability=True),
    # DecisionTreeClassifier(),
    # RandomForestClassifier(n_estimators=200),
    # AdaBoostClassifier(),
    # GaussianNB()
    # BernoulliNB()
 ]

Accuracy=[]
Model=[]
for classifier in Classifiers:
    try:
        fit = classifier.fit(text_train,sent_train)
        pred = fit.predict(text_test)
        # Use score method to get accuracy of model
        score = classifier.score(text_test, sent_test)
        from sklearn.metrics import classification_report
        report = classification_report(sent_test,pred)
        print(report)
        db['model'] = fit
    except Exception:
        print( " Exception occures")
    accuracy = accuracy_score(sent_test,pred)*100
    Accuracy.append(accuracy)
    Model.append(classifier.__class__.__name__)
    print('Accuracy of '+classifier.__class__.__name__+'is '+str(accuracy))

dbfile = open('pickleRelevancy', 'ab')
pickle.dump(db, dbfile)                      
dbfile.close()



