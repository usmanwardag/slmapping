import csv
from matplotlib import pyplot as plt
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import scale
import statsmodels.api as sm

plt.rc('font', family='serif')
plt.style.use('ggplot')

rows = []
with open('../../data/italian/rt_new.csv', 'r') as f:
	reader = csv.reader(f)

	for row in reader:
		rows.append(row)

data = {}
for tick in range(1, 8):
	data[tick] = [row for row in rows if row[2] == str(tick)]

#rts = [float(d1[4]) - float(d2[4]) for d1, d2 in zip(data[5], data[4])]
rts = [float(d[4]) for d in data[1]]
features = [d[5:] for d in data[1]]
features = [[float(f) for f in feature] for feature in features]
features = scale(features)

names = rows[0][5:]
names = ['LD', 'SD', 'LD+SD', 'LD*SD', 'T_Len', 'P_Len', 'T_Freq', 
		'P_Freq', 'F1_T', 'F2_T', 'F1_P', 'F2_P']

scores, stds, r_2 = [], [], []
"""
for i in range(200):
	X_train, X_test, y_train, y_test = train_test_split(features, rts, test_size=0.25)
	regr = LinearRegression()
	regr.fit(X_train, y_train)

	#scores.append(regr.feature_importances_)
	#stds.append(np.std([tree.feature_importances_ for tree in regr.estimators_],
    #         axis=0))

	r_2.append(regr.score(X_test, y_test)) 

#scores = np.mean(scores, axis=0)
#std = np.mean(stds, axis=0)
print(r_2[:10])
r_2 = np.mean(r_2)

#indices = np.argsort(scores)[::-1]

print(r_2)

#plt.figure(figsize=(11,6.5))
#plt.bar(range(len(names)), scores[indices],
#       color="r", yerr=std[indices], align="center")
#plt.xticks(range(len(names)), [names[i] for i in indices])
#plt.xlim([-1, len(names)])
#plt.show()
"""
"""


X2 = sm.add_constant(features)
est = sm.OLS(rts, X2)
est2 = est.fit()
print(est2.summary())

"""