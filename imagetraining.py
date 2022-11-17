import sys
import pymysql
from pymysql.constants import CLIENT

conn1 = pymysql.connect(host='146.56.144.143',
                       user='aestera',
                       password='aestera',
                       db='sns',
                       charset='utf8',
                       client_flag=CLIENT.MULTI_STATEMENTS
                       )
cur1 = conn1.cursor()

conn2 = pymysql.connect(host='146.56.144.143',
                       user='aestera',
                       password='aestera',
                       db='sns_user',
                       charset='utf8',
                       client_flag=CLIENT.MULTI_STATEMENTS
                       )
cur2 = conn2.cursor()

def image_train(image_addr):

  from keras.models import load_model
  from PIL import Image, ImageOps 
  import numpy as np

  np.set_printoptions(suppress=True)
  model = load_model('keras_model.h5', compile=False)
  class_names = open('labels.txt', 'r').readlines()
  data = np.ndarray(shape=(1, 224, 224, 3), dtype=np.float32)
  image = Image.open(image_addr).convert('RGB')
  size = (224, 224)

  import PIL.Image
  if not hasattr(PIL.Image, 'Resampling'):
    PIL.Image.Resampling = PIL.Image

  image = ImageOps.fit(image, size, Image.Resampling.LANCZOS)
  image_array = np.asarray(image)
  normalized_image_array = (image_array.astype(np.float32) / 127.0) - 1
  data[0] = normalized_image_array

  prediction = model.predict(data)
  index = np.argmax(prediction)
  class_name = class_names[index]
  
  sql1 = f"UPDATE sns SET class = '{class_name}' WHERE idx = 1;"
  cur1.execute(sql1)
  conn1.commit()

  sql2 = f"UPDATE {sys.argv[2]} SET {class_name} = {class_name} + 1 where con = 3"
  cur2.execute(sql2)
  conn2.commit()

if __name__ == '__main__':
  image_train(sys.argv[1])
