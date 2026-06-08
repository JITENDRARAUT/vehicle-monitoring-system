from fastapi import FastAPI, Request, WebSocket
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from tinydb import TinyDB
from datetime import datetime
import asyncio
import random

app = FastAPI(title="Vehicle Monitoring System")

db = TinyDB("db.json")

app.mount("/static", StaticFiles(directory="static"), name="static")

templates = Jinja2Templates(directory="templates")


@app.get("/", response_class=HTMLResponse)
async def dashboard(request: Request):
    return templates.TemplateResponse(
        "dashboard.html",
        {"request": request}
    )


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):

    await websocket.accept()

    latitude = 27.7172
    longitude = 85.3240

    while True:

        latitude += random.uniform(-0.001, 0.001)
        longitude += random.uniform(-0.001, 0.001)

        vehicle_data = {
            "vehicle_id": "VH-101",
            "speed": random.randint(40, 120),
            "fuel": random.randint(20, 100),
            "temperature": random.randint(25, 60),
            "engine": random.choice(["ON", "OFF"]),
            "latitude": round(latitude, 6),
            "longitude": round(longitude, 6),
            "time": datetime.now().strftime("%H:%M:%S")
        }

        db.insert(vehicle_data)

        await websocket.send_json(vehicle_data)

        await asyncio.sleep(2)


@app.get("/api/history")
async def history():
    return db.all()