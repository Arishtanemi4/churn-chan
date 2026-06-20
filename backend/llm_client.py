import json
import ollama
import config
from models import AgentDecision, Decision
from agents.config import TEMPERATURE

class LLMClient:
    def __init__(self, model: str = config.MODEL, host: str = config.OLLAMA_HOST):
        self.model = model
        self._client = ollama.AsyncClient(host=host)

    async def decide(self, system: str, user: str) -> AgentDecision:
        try:
            resp = await self._client.chat(
                model=self.model,
                messages=[
                    {"role": "system", "content": system},
                    {"role": "user", "content": user}
                ],
                format="json",
                options={"temperature": TEMPERATURE},
            )
            raw = resp["message"]["content"]
            data = json.loads(raw)
            
            decision_str = data.get("decision", "").lower()
            try:
                decision = Decision(decision_str)
            except ValueError:
                decision = Decision.WAIT
                
            return AgentDecision(decision=decision, reason=data.get("reason", ""))
        except Exception:
            return AgentDecision(decision=Decision.WAIT, reason="")