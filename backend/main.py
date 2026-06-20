from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

import config
from models import SimRequest, SimResponse
from llm_client import LLMClient
from simulation.engine import SimulationEngine
from agents.config import ARCHETYPES

app = FastAPI(title="Subscription Upgrade Simulator")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Change to your frontend's localhost port in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

llm = LLMClient()
engine = SimulationEngine(llm)

@app.get("/health")
async def health():
    return {"status": "ok"}

@app.get("/personas")
async def get_personas():
    return ARCHETYPES

@app.post("/simulate", response_model=SimResponse)
async def simulate(request: SimRequest):
    return await engine.run(request)

if __name__ == "__main__":
    uvicorn.run("main:app", host=config.SERVER_HOST, port=config.SERVER_PORT, reload=True)