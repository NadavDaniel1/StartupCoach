from backend.supabase_client import save_prediction_log

test_log = {
    "user_id": "demo-founder-001",
    "funding_total_usd": 500000.0,
    "funding_rounds": 2.0,
    "founded_year": 2020.0,
    "seed": 100000.0,
    "venture": 300000.0,
    "debt_financing": 0.0,
    "angel": 100000.0,
    "grant": 0.0,
    "round_A": 0.0,
    "round_B": 0.0,
    "round_C": 0.0,
    "round_D": 0.0,
    "round_E": 0.0,
    "round_F": 0.0,
    "market": "Software",
    "country_code": "ISR",
    "success_probability": 0.7421,
    "predicted_class": 1,
    "prediction_label": "Success",
}

response = save_prediction_log(test_log)

print("Inserted successfully")
print(response)