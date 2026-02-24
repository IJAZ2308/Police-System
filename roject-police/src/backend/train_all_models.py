import pandas as pd
import numpy as np
import joblib
import os

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.cluster import KMeans
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score

os.makedirs("models", exist_ok=True)

# =========================================
# 1️⃣ CRIME INCIDENT MODEL
# =========================================
print("Training Crime Incident Model...")

crime = pd.read_csv("data/crime_incidents.csv")
crime = crime.dropna()

crime["incident_date"] = pd.to_datetime(crime["incident_date"])
crime["month"] = crime["incident_date"].dt.month

le_crime = LabelEncoder()
crime["crime_type"] = le_crime.fit_transform(crime["crime_type"])
crime["status"] = LabelEncoder().fit_transform(crime["status"])

X = crime[["zone_id", "crime_type", "severity_score", "month"]]
y = crime["status"]

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

crime_model = RandomForestClassifier()
crime_model.fit(X_train, y_train)

joblib.dump(crime_model, "models/crime_model.pkl")

print("Crime Model Accuracy:", accuracy_score(y_test, crime_model.predict(X_test)))


# =========================================
# 2️⃣ HOTSPOT MODEL (CLUSTERING)
# =========================================
print("Training Hotspot Model...")

zones = pd.read_csv("data/crime_zones.csv")

kmeans = KMeans(n_clusters=5)
zones["cluster"] = kmeans.fit_predict(zones[["latitude", "longitude"]])

joblib.dump(kmeans, "models/hotspot_model.pkl")

print("Hotspot Model Trained")


# =========================================
# 3️⃣ COMPLAINT NLP MODEL
# =========================================
print("Training Complaint NLP Model...")

complaints = pd.read_csv("data/citizen_complaints.csv")
complaints = complaints.dropna()

vectorizer = TfidfVectorizer(max_features=5000)
X_text = vectorizer.fit_transform(complaints["complaint_text"])
y = LabelEncoder().fit_transform(complaints["category"])

X_train, X_test, y_train, y_test = train_test_split(X_text, y, test_size=0.2)

complaint_model = LogisticRegression(max_iter=200)
complaint_model.fit(X_train, y_train)

joblib.dump(complaint_model, "models/complaint_model.pkl")
joblib.dump(vectorizer, "models/complaint_vectorizer.pkl")

print("Complaint Model Accuracy:",
      accuracy_score(y_test, complaint_model.predict(X_test)))


# =========================================
# 4️⃣ SOCIAL MEDIA THREAT MODEL
# =========================================
print("Training Threat Detection Model...")

threats = pd.read_csv("data/social_media_threats.csv")
threats = threats.dropna()

vectorizer2 = TfidfVectorizer(max_features=5000)
X_text = vectorizer2.fit_transform(threats["post_text"])
y = LabelEncoder().fit_transform(threats["threat_level"])

X_train, X_test, y_train, y_test = train_test_split(X_text, y, test_size=0.2)

threat_model = LogisticRegression(max_iter=200)
threat_model.fit(X_train, y_train)

joblib.dump(threat_model, "models/threat_model.pkl")
joblib.dump(vectorizer2, "models/threat_vectorizer.pkl")

print("Threat Model Accuracy:",
      accuracy_score(y_test, threat_model.predict(X_test)))


# =========================================
# 5️⃣ EMERGENCY RESPONSE TIME MODEL
# =========================================
print("Training Response Time Model...")

response = pd.read_csv("data/emergency_responses.csv")
response = response.dropna()

X = response[["distance_km", "traffic_level"]]
y = response["response_time_minutes"]

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

response_model = RandomForestRegressor()
response_model.fit(X_train, y_train)

joblib.dump(response_model, "models/response_model.pkl")

print("Response Model Trained")


# =========================================
# 6️⃣ CRIMINAL RISK MODEL
# =========================================
print("Training Criminal Risk Model...")

criminals = pd.read_csv("data/criminal_database.csv")
criminals = criminals.dropna()

X = criminals[["past_crimes", "age"]]
y = LabelEncoder().fit_transform(criminals["risk_level"])

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

risk_model = RandomForestClassifier()
risk_model.fit(X_train, y_train)

joblib.dump(risk_model, "models/risk_model.pkl")

print("Risk Model Accuracy:",
      accuracy_score(y_test, risk_model.predict(X_test)))

print("\n✅ ALL MODELS TRAINED SUCCESSFULLY 🚔🔥")