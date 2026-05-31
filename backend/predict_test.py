import joblib
import pandas as pd


# Load the trained model
model = joblib.load('models/startup_success_model.pkl')

# Load feature list
model_features = joblib.load('models/model_features.pkl')

# Example input data
test_cases = [
    {
        "name": "Israeli AI Seed Startup",
        "data": {
            "funding_total_usd": 750000,
            "funding_rounds": 1,
            "founded_year": 2022,
            "seed": 750000,
            "venture": 0,
            "debt_financing": 0,
            "angel": 0,
            "grant": 0,
            "round_A": 0,
            "round_B": 0,
            "round_C": 0,
            "round_D": 0,
            "round_E": 0,
            "round_F": 0,
            "market_Software": True,
            "country_code_ISR": True
        }
    },
    {
        "name": "Israeli AI Venture Startup",
        "data": {
            "funding_total_usd": 5000000,
            "funding_rounds": 3,
            "founded_year": 2019,
            "seed": 500000,
            "venture": 4500000,
            "debt_financing": 0,
            "angel": 0,
            "grant": 0,
            "round_A": 2500000,
            "round_B": 2000000,
            "round_C": 0,
            "round_D": 0,
            "round_E": 0,
            "round_F": 0,
            "market_Software": True,
            "country_code_ISR": True
        }
    }
]

# Prepare input data for prediction
for case in test_cases:
    # Convert to DataFrame and ensure all model features are present
    input_df = pd.DataFrame([case["data"]])

    for col in model_features:
        if col not in input_df.columns:
            input_df[col] = 0

# Reorder columns to match model features
input_df = input_df[model_features]

# Make predictions
probability = model.predict_proba(input_df)[0][1]
prediction = model.predict(input_df)[0]
    
print(f"\n{case['name']}")
print(f"Success probability: {probability:.2%}")
print(f"Prediction: {'Success' if prediction == 1 else 'Failure'}")