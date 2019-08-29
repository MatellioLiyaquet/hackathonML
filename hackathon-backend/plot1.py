import matplotlib
import matplotlib.pyplot as plt
import numpy as np
import base64 as base64

y = [2,4,6,8,10,12,14,16,18,20]
x = np.arange(10)
fig = plt.figure()
ax = plt.subplot(111)
ax.plot(x, y, label='$y = numbers')
plt.title('Legend inside')
ax.legend()
plt.show()

from io import BytesIO
figfile = BytesIO()
plt.savefig('tmp/plots/plot1.png')
figfile.seek(0)  # rewind to beginning of file
import base64
# figdata_png = base64.b64encode(figfile.read())
figdata_png = base64.b64encode(figfile.getvalue())
print(figdata_png)