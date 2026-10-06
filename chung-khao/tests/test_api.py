import pytest
from fastapi.testclient import TestClient
from src.app import app

client = TestClient(app)


def test_health_check():
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert "workflow" in data


def test_generate_itinerary_3_agent_workflow():
    payload = {
        "group_size": 3,
        "duration_days": 3,
        "budget_vnd": 3500000,
        "preferences": [
            "Văn hóa Cồng chiêng",
            "Thác nước & Trekking",
            "Cà phê Buôn Ma Thuột"
        ]
    }
    response = client.post("/api/v1/generate-itinerary", json=payload)
    assert response.status_code == 200
    res_json = response.json()
    assert res_json["success"] is True
    assert "data" in res_json
    data = res_json["data"]

    # Kiểm tra summary và workflow status
    assert data["trip_summary"]["group_size"] == 3
    assert data["trip_summary"]["duration_days"] == 3
    assert "gemini-3.1-pro-preview" in data["trip_summary"]["agent_workflow_status"]
    assert len(data["itinerary_days"]) == 3

    # Kiểm tra Pydantic Guardrail: Tổng chi phí <= Ngân sách
    assert data["trip_summary"]["total_estimated_cost"] <= payload["budget_vnd"]

    # Kiểm tra sự tồn tại của nguồn Google Grounding
    assert "grounding_sources" in data
    assert len(data["grounding_sources"]) > 0


def test_search_discover_endpoint():
    payload = {
        "query": "cà phê view đẹp và chèo thuyền thác Đắk Lắk"
    }
    response = client.post("/api/v1/search-discover", json=payload)
    assert response.status_code == 200
    res_json = response.json()
    assert res_json["success"] is True
    assert len(res_json["results"]) > 0
    assert "grounding_sources" in res_json


def test_generate_itinerary_invalid_budget():
    payload = {
        "group_size": 2,
        "duration_days": 2,
        "budget_vnd": 200000,  # Below 500,000 VND
        "preferences": ["Văn hóa"]
    }
    response = client.post("/api/v1/generate-itinerary", json=payload)
    assert response.status_code == 422
