import sys

#idd=('admin','legend', 'test1')
idd = tuple(sys.argv[1].split(","))

def fun(idd):
  id=[]
  for i in range(0,len(idd)):
      id.append(idd[i])
  return id

id=fun(idd)

people=[id,['noodle','rawfish','soup','meat','barger','tteokbokki','rice','pizza','chicken','salad'],[],[],[]]

import pymysql
conn = pymysql.connect(host='146.56.144.143',
                      user='aestera',
                      password='aestera',
                      db='sns_user',
                      charset='utf8')

cur = conn.cursor()

for i in range(0,len(id)):
    sql = "select * from "+id[i]
    cur.execute(sql)
    res = cur.fetchall()
    conn.commit()



  #global people=[]
    k=2
    for j in range(0,3):
      people[k].append(list(res[j]))
      k+=1

for i in range(0,len(id)):
  del people[2][i][0]
  del people[3][i][0]
  del people[4][i][0]


  #people=[[id],[class이름],[like],[day],[count]]
  #->people[0]이용해서 db에서 정보 가져오기 -> 가중치 줘서 리스트에 넣기

def score(i,j): #i=>id, j=>class 순서
  res=0
  res+=people[2][i][j]*3 #좋아요에 대한 score #가중치 3
  res+=people[4][i][j]*2 #총 몇번 먹었는지에 대한 score #가중치 2
  if people[3][i][j]==3: #n일 전에 먹었는지에 대한 score #가중치 3.5
    res+=(-1)*1*3.5
  elif people[3][i][j]==2:
    res+=(-1)*2*3.5
  elif people[3][i][j]==1:
    res+=(-1)*3*3.5
  elif people[3][i][j]==0:
    res+=(-1)*100 #오늘 먹은 음식에 대해 추천 안함
  return res

food_score=[]
for i in range(0,10):
  food_score.append(0)

for i in range(0,len(id)): #id 개수만큼 for loop
  for j in range(0,10): #class 개수만큼 for loop
    res=score(i,j)
    food_score[j]+=res


sort_food_score=sorted(food_score,reverse=True)

result = people[1][food_score.index(sort_food_score[0])]+","+people[1][food_score.index(sort_food_score[1])]+","+people[1][food_score.index(sort_food_score[2])]
print(result)