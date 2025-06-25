import uuid
from fastapi import FastAPI, HTTPException
import requests
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any, Optional
import uvicorn

app = FastAPI(title="Weather Data System", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage for weather data
weather_storage: Dict[str, Dict[str, Any]] = {}

class WeatherRequest(BaseModel):
    date: str
    location: str
    notes: Optional[str] = ""

class WeatherResponse(BaseModel):
    id: str


@app.post("/weather", response_model=WeatherResponse)
async def create_weather_request(request: WeatherRequest):
    
    """
    You need to implement this endpoint to handle the following:
    1. Receive form data (date, location, notes)
    2. Calls WeatherStack API for the location
    3. Stores combined data with unique ID in memory
    4. Returns the ID to frontend
    """
    weather_url = "http://api.weatherstack.com/current"
    params = {
        "access_key": "de78da516b894e222213ed03e6a78cab",
        "query": request.location,
        "historical_date": request.date,
        "units": "m"
    }

    response = requests.get(weather_url, params=params)
    if response.status_code != 200:
        raise HTTPException(status_code=500, detail= "Failed to fetch weather data")
    
    weather_data = response.json()

    if "error" in weather_data:
        raise HTTPException(status_code = 400, detail=weather_data["error"].get("info", "Weather API error"))

    record_id = str(uuid.uuid4())
    weather_storage[record_id]= {
        "date": request.date,
        "location": request.location,
        "notes": request.notes,
        "weather": weather_data

    }
    return WeatherResponse(id=record_id)
    
@app.get("/weather/{weather_id}")
async def get_weather_data(weather_id: str):
    """
    Retrieve stored weather data by ID.
    This endpoint is already implemented for the assessment.
    """
    if weather_id not in weather_storage:
        raise HTTPException(status_code=404, detail="Weather data not found")
    
    return weather_storage[weather_id]


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)