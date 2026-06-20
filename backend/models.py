from enum import Enum
from pydantic import BaseModel
from typing import Optional, List

class Decision(str, Enum):
    UPGRADE = "upgrade"
    WAIT = "wait"
    LEAVE = "leave"

class Plan(BaseModel):
    name: str
    limit: int
    price: float

class PersonaConfig(BaseModel):
    name: str
    description: str
    price_sensitivity: float
    churn_risk: float
    archetype: Optional[str] = None

class UpgradePrompt(BaseModel):
    id: str
    text: str
    trigger: str

class SimRequest(BaseModel):
    plan: Plan
    personas: List[PersonaConfig]
    prompts: List[UpgradePrompt]
    runs_per_combo: Optional[int] = None

class AgentDecision(BaseModel):
    decision: Decision
    reason: str

class PairResult(BaseModel):
    persona: str
    prompt_id: str
    upgrade_pct: float
    wait_pct: float
    leave_pct: float
    expected_uplift: float
    sample_reasons: List[str]

class SimResponse(BaseModel):
    results: List[PairResult]