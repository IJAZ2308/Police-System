from fastapi import APIRouter, Depends
from config import supabase
from deps import get_current_user
from services.fir_summarizer import summarize_fir

router = APIRouter()

@router.post("/fir")
def upload_fir(case_id: str, raw_text: str, user=Depends(get_current_user)):
    summary = summarize_fir(raw_text)

    supabase.table("fir_reports").insert({
        "case_id": case_id,
        "raw_text": raw_text,
        "summary": summary
    }).execute()

    return {
        "message": "FIR processed",
        "summary": summary
    }
