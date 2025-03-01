from fastapi import FastAPI
import joblib
import numpy as np
import pandas as pd  # Import Pandas to handle DataFrame conversion
from pydantic import BaseModel

# Load K-Means model (No scaler needed)
kmeans_model = joblib.load("/Users/Admin/Desktop/KBTU2025/diplomka/model/kmeans_model.pkl")

# Initialize FastAPI
app = FastAPI()

# Define the correct column names from your dataset
column_names = [
    "EXT1", "EXT2", "EXT3", "EXT4", "EXT5", "EXT6", "EXT7", "EXT8", "EXT9", "EXT10",
    "EST1", "EST2", "EST3", "EST4", "EST5", "EST6", "EST7", "EST8", "EST9", "EST10",
    "AGR1", "AGR2", "AGR3", "AGR4", "AGR5", "AGR6", "AGR7", "AGR8", "AGR9", "AGR10",
    "CSN1", "CSN2", "CSN3", "CSN4", "CSN5", "CSN6", "CSN7", "CSN8", "CSN9", "CSN10",
    "OPN1", "OPN2", "OPN3", "OPN4", "OPN5", "OPN6", "OPN7", "OPN8", "OPN9", "OPN10"
]

class UserResponse(BaseModel):
    answers: list  # List of user responses

@app.post("/predict")
def predict_cluster(user_response: UserResponse):
    # Convert input list to DataFrame with correct column names
    df_input = pd.DataFrame([user_response.answers], columns=column_names)

    # Predict cluster
    cluster = kmeans_model.predict(df_input)[0]

    return {"cluster_group": int(cluster)}





