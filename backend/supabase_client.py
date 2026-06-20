import os
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("Missing SUPABASE_URL or SUPABASE_KEY in .env")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)


def save_prediction_log(log_data: dict):
    response = (
        supabase
        .table("prediction_logs")
        .insert(log_data)
        .execute()
    )

    return response

def get_prediction_history():
    response = (
        supabase
        .table("prediction_logs")
        .select("*")
        .order("created_at", desc=True)
        .execute()
    )

    return response.data


def delete_prediction_log(prediction_id: int):
    response = (
        supabase
        .table("prediction_logs")
        .delete()
        .eq("id", prediction_id)
        .execute()
    )

    return response