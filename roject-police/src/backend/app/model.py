import pandas as pd
from sklearn.ensemble import RandomForestClassifier
import joblib

data = pd.read_csv("crime_data.csv")

X = data[['hour', 'area_code']]
y = data['crime_type']

model = RandomForestClassifier()
model.fit(X, y)

joblib.dump(model, "crime_model.pkl")