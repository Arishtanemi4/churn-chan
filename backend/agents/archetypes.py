# backend/agents/freelancer_designer.py
from agents.base_agent import BaseAgent
from agents.config import ARCHETYPES

class FreelancerDesigner(BaseAgent):
    def __init__(self, llm):
        traits = ARCHETYPES["freelancer_designer"]
        super().__init__("Freelancer Designer", traits["description"], traits["price_sensitivity"], traits["churn_risk"], llm)

# backend/agents/startup_engineer.py
from agents.base_agent import BaseAgent
from agents.config import ARCHETYPES

class StartupEngineer(BaseAgent):
    def __init__(self, llm):
        traits = ARCHETYPES["startup_engineer"]
        super().__init__("Startup Engineer", traits["description"], traits["price_sensitivity"], traits["churn_risk"], llm)

# backend/agents/procurement_manager.py
from agents.base_agent import BaseAgent
from agents.config import ARCHETYPES

class ProcurementManager(BaseAgent):
    def __init__(self, llm):
        traits = ARCHETYPES["procurement_manager"]
        super().__init__("Procurement Manager", traits["description"], traits["price_sensitivity"], traits["churn_risk"], llm)