from fastapi import APIRouter, Depends, HTTPException, Body
from config import supabase
from deps import get_current_user
from typing import List
from services.case_similarity import find_similar_cases

router = APIRouter()


# 🔍 1️⃣ CASE SIMILARITY CHECK
@router.post("/cases/similarity-check")
def similarity_check(
    description: str = Body(..., embed=True),
    user=Depends(get_current_user)
):
    # Fetch cases from Supabase
    response = supabase.table("cases") \
        .select("id,title,crime_type") \
        .execute()

    cases = response.data

    if not cases:
        return {"possible_duplicates": []}

    # Combine title + crime_type
    texts = [
        (c.get("title", "") + " " + (c.get("crime_type") or "")).strip()
        for c in cases
    ]

    # Run similarity logic
    matches = find_similar_cases(description, texts)

    # Build response safely
    results = []
    for i, score in matches:
        if i < len(cases):
            results.append({
                "case_id": cases[i]["id"],
                "title": cases[i]["title"],
                "score": round(float(score), 4)
            })

    return {
        "input_description": description,
        "possible_duplicates": results
    }


# 📄 2️⃣ LIST ALL CASES
@router.get("/cases")
def list_cases(user=Depends(get_current_user)):
    response = supabase.table("cases") \
        .select("*") \
        .order("created_at", desc=True) \
        .execute()

    return {
        "count": len(response.data),
        "cases": response.data
    }


# 🔄 3️⃣ UPDATE CASE STATUS
@router.patch("/cases/{case_id}")
def update_status(
    case_id: str,
    status: str = Body(..., embed=True),
    user=Depends(get_current_user)
):
    # Optional: validate allowed statuses
    allowed_status = ["open", "investigating", "closed"]
    if status not in allowed_status:
        raise HTTPException(
            status_code=400,
            detail=f"Status must be one of {allowed_status}"
        )

    response = supabase.table("cases") \
        .update({"status": status}) \
        .eq("id", case_id) \
        .execute()

    if not response.data:
        raise HTTPException(status_code=404, detail="Case not found")

    return {
        "message": "Status updated successfully",
        "case_id": case_id,
        "new_status": status
    }
