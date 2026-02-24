from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import cases, citizen, fir

# NEW IMPORTS
import joblib
import random

app = FastAPI()

# ✅ CORS (already correct)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ ROUTES
app.include_router(citizen.router, prefix="/citizen")
app.include_router(fir.router, prefix="/fir")
app.include_router(cases.router, prefix="/cases")

# ============================
# 🤖 LOAD AI MODEL
# ============================
try:
    model = joblib.load("crime_model.pkl")
except:
    model = None


# ============================
# 🏠 HOME ROUTE
# ============================
@app.get("/")
def home():
    return {"message": "🚔 AI Police Backend Running"}


# ============================
# 🤖 AI CRIME PREDICTION API
# ============================
@app.post("/predict")
def predict(data: dict):
    if not model:
        return {"error": "Model not loaded"}

    hour = data.get("hour")
    area = data.get("area_code")

    prediction = model.predict([[hour, area]])

    return {
        "prediction": prediction[0],
        "status": "success"
    }


# ============================
# 🎥 CCTV AI DETECTION API
# ============================
@app.get("/detect")
def detect():
    alerts = [
        "✅ Normal Activity",
        "⚠ Suspicious Movement",
        "🚨 Weapon Detected",
        "🚨 Fight Detected"
    ]

    return {
        "alert": random.choice(alerts)
    }


# ============================
# 📊 CRIME ANALYTICS API
# ============================
@app.get("/crime-stats")
def crime_stats():
    return {
        "theft": random.randint(20, 100),
        "assault": random.randint(10, 50),
        "robbery": random.randint(5, 30),
    }


# ============================
# 📍 HEATMAP DATA API
# ============================
@app.get("/heatmap")
def heatmap():
    return [
        {"lat": 13.0827, "lng": 80.2707},
        {"lat": 13.05, "lng": 80.25},
        {"lat": 13.09, "lng": 80.28},
    ]