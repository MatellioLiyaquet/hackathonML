import pickle
import sys
import json

bfile = open('trainingPickle', 'rb')
db = pickle.load(bfile)

try:
    test_Sent=[sys.argv[1]]
    test_trans=db['vectorizer'].transform(test_Sent)
    predict = db['classifier'].predict(test_trans)
    import pandas as pd
    output = predict.tolist()
    x = json.dumps(output)
    print(x)

except:
  print("An exception occurred")    




