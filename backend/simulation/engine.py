import asyncio
from typing import List
from models import SimRequest, SimResponse, PairResult, AgentDecision, PersonaConfig, UpgradePrompt, Plan, Decision
from llm_client import LLMClient
from agents.base_agent import BaseAgent
from agents.config import ARCHETYPES
import simulation.config as sim_config

class SimulationEngine:
    def __init__(self, llm: LLMClient, runs_per_combo: int = sim_config.RUNS_PER_COMBO, max_concurrency: int = sim_config.MAX_CONCURRENCY):
        self.llm = llm
        self.runs_per_combo = runs_per_combo
        self.max_concurrency = max_concurrency

    def _build_agent(self, persona: PersonaConfig) -> BaseAgent:
        if persona.archetype and persona.archetype in ARCHETYPES:
            traits = ARCHETYPES[persona.archetype]
            return BaseAgent(
                name=persona.name,
                description=traits["description"],
                price_sensitivity=traits["price_sensitivity"],
                churn_risk=traits["churn_risk"],
                llm=self.llm
            )
        return BaseAgent(
            name=persona.name,
            description=persona.description,
            price_sensitivity=persona.price_sensitivity,
            churn_risk=persona.churn_risk,
            llm=self.llm
        )

    def _aggregate(self, persona: str, prompt_id: str, plan: Plan, decisions: List[AgentDecision]) -> PairResult:
        total = len(decisions)
        if total == 0:
            return PairResult(persona=persona, prompt_id=prompt_id, upgrade_pct=0, wait_pct=0, leave_pct=0, expected_uplift=0, sample_reasons=[])

        upgrades = sum(1 for d in decisions if d.decision == Decision.UPGRADE)
        waits = sum(1 for d in decisions if d.decision == Decision.WAIT)
        leaves = sum(1 for d in decisions if d.decision == Decision.LEAVE)

        upgrade_pct = upgrades / total
        expected_uplift = upgrade_pct * plan.price

        sample_reasons = []
        seen_decisions = set()
        for d in decisions:
            if d.reason and d.decision not in seen_decisions:
                sample_reasons.append(d.reason)
                seen_decisions.add(d.decision)
                if len(sample_reasons) >= 3:
                    break

        return PairResult(
            persona=persona,
            prompt_id=prompt_id,
            upgrade_pct=upgrade_pct,
            wait_pct=waits / total,
            leave_pct=leaves / total,
            expected_uplift=expected_uplift,
            sample_reasons=sample_reasons
        )

    async def run(self, request: SimRequest) -> SimResponse:
        runs = request.runs_per_combo or self.runs_per_combo
        sem = asyncio.Semaphore(self.max_concurrency)

        async def _run_single(agent: BaseAgent, prompt: UpgradePrompt, plan: Plan) -> AgentDecision:
            async with sem:
                return await agent.decide(prompt, plan)

        results = []
        for persona in request.personas:
            agent = self._build_agent(persona)
            for prompt in request.prompts:
                tasks = [_run_single(agent, prompt, request.plan) for _ in range(runs)]
                decisions = await asyncio.gather(*tasks)
                results.append(self._aggregate(persona.name, prompt.id, request.plan, decisions))

        return SimResponse(results=results)