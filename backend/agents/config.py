TEMPERATURE = 0.8

ARCHETYPES = {
    "freelancer_designer": {
        "description": "A freelance designer managing multiple client projects with tight budgets.",
        "price_sensitivity": 0.8,
        "churn_risk": 0.5
    },
    "startup_engineer": {
        "description": "A fast-moving engineer at an early-stage startup seeking velocity.",
        "price_sensitivity": 0.4,
        "churn_risk": 0.7
    },
    "procurement_manager": {
        "description": "An enterprise procurement manager strictly focused on ROI and compliance.",
        "price_sensitivity": 0.9,
        "churn_risk": 0.2
    }
}

SCENARIO_SYSTEM = """You are simulating one real SaaS user. Decide honestly whether you upgrade, wait, or leave. Reply ONLY as JSON: {"decision": "upgrade" | "wait" | "leave", "reason": "string"}."""

SCENARIO_TEMPLATE = """Persona Name: {name}
Description: {description}
Price Sensitivity: {price_sensitivity}
Churn Risk: {churn_risk}

Plan Offered: {plan_name}
Plan Limit: {plan_limit}
Plan Price: ${plan_price}

Upgrade Prompt (Trigger: {trigger}):
{prompt_text}"""