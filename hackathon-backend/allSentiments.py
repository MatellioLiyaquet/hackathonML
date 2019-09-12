import pickle
import sys
import json

bfile = open('trainingPickle', 'rb')
db = pickle.load(bfile)

try:
    #print(sys.argv[1])
    test_Sent=[sys.argv[1]]
    test_trans=db['vectorizer'].transform(test_Sent)
    probabilityGet = db['model'].predict_proba(test_trans)
    import pandas as pd
    output = probabilityGet.tolist()
    x = json.dumps(output)
    print(x)

except:
  print("An exception occurred")    




