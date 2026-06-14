from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import pandas as pd

from rag.generate_answer import generate_answer
from backend.supabase_client import save_prediction_log

# Initialize FastAPI application
app = FastAPI(title="StartupCoach API", description="API for predicting startup success based on funding data.")

# Load the trained model and feature list
model = joblib.load("models/startup_success_model.pkl")
model_features = joblib.load("models/model_features.pkl")

# Define input data model for prediction
class StartupInput(BaseModel):
    funding_total_usd: float
    funding_rounds: float
    founded_year: float
    seed: float = 0
    venture: float = 0
    debt_financing: float = 0
    angel: float = 0
    grant: float = 0
    round_A: float = 0
    round_B: float = 0
    round_C: float = 0
    round_D: float = 0
    round_E: float = 0
    round_F: float = 0
    market: str = "Other"
    country_code: str = "Other"

# Define input data model for chat endpoint
class ChatInput(BaseModel):
    message: str

# Define API endpoints
@app.get("/")
def root():
    return {"message": "StartupCoach API is running"}

# Endpoint to predict startup success based on input data
@app.post("/predict")
def predict_startup(data: StartupInput):
    startup_data = data.model_dump()

    # Keep original input for logging before transforming it for the model
    original_input = startup_data.copy()

    market = startup_data.pop("market")
    country_code = startup_data.pop("country_code")

    input_df = pd.DataFrame([startup_data])

    market_col = f"market_{market}"
    country_col = f"country_code_{country_code}"

    # Fallback for unseen categories
    if market_col not in model_features:
        market_col = "market_Other"

    if country_col not in model_features:
        country_col = "country_code_Other"

    input_df[market_col] = True
    input_df[country_col] = True

    # Ensure all model features are present in the input DataFrame
    for col in model_features:
        if col not in input_df.columns:
            input_df[col] = 0

    # Reorder columns to match model features
    input_df = input_df[model_features]

    # Predict success probability and class
    probability = model.predict_proba(input_df)[0][1]
    prediction = model.predict(input_df)[0]

    predicted_class = int(prediction)
    prediction_label = "Success" if predicted_class == 1 else "Failure"

    # Save prediction log to Supabase
    log_data = {
        "user_id": "demo-founder-001",
        **original_input,
        "success_probability": round(float(probability), 4),
        "predicted_class": predicted_class,
        "prediction_label": prediction_label,
    }

    try:
        save_prediction_log(log_data)
    except Exception as error:
        # Do not fail the prediction if logging fails
        print(f"Failed to save prediction log: {error}")

    # Return the prediction results
    return {
        "success_probability": round(float(probability), 4),
        "success_percentage": f"{probability:.2%}",
        "prediction": prediction_label
    }

# Endpoint for chat interactions
@app.post("/chat")
def chat(data: ChatInput):
    try:
        answer = generate_answer(data.message)

        return {
            "response": answer,
            "homework": [
                "Talk to 3 potential customers and ask about their current problem, not about your solution."
            ]
        }

    except Exception as error:
        return {
            "response": "Sorry, StartupCoach could not generate an answer right now. Please try again later.",
            "error": str(error),
            "homework": []
        }