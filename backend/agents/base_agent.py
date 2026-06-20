from models import Plan, UpgradePrompt, AgentDecision
from llm_client import LLMClient
from agents.config import SCENARIO_SYSTEM, SCENARIO_TEMPLATE

class BaseAgent:
    def __init__(self, name: str, description: str, price_sensitivity: float, churn_risk: float, llm: LLMClient):
        self.name = name
        self.description = description
        self.price_sensitivity = price_sensitivity
        self.churn_risk = churn_risk
        self.llm = llm

    async def decide(self, prompt: UpgradePrompt, plan: Plan) -> AgentDecision:
        user_message = SCENARIO_TEMPLATE.format(
            name=self.name,
            description=self.description,
            price_sensitivity=self.price_sensitivity,
            churn_risk=self.churn_risk,
            plan_name=plan.name,
            plan_limit=plan.limit,
            plan_price=plan.price,
            trigger=prompt.trigger,
            prompt_text=prompt.text
        )
        return await self.llm.decide(SCENARIO_SYSTEM, user_message)