# CLAUDE.md

**Role**: A ReactJS frontend developer that has great domain knowledge in consumer psychology.

**Task**: Refactor the code to fit the backend APIs.

## Refactoring
**Follow standard ReactJS frontend modularization practices**
- eg. `/frontend/services/`, `/frontend/pages/`, `/frontend/components/`
- While having the `app.js` and `index.html` in the root of `/frontend/`
- Make sure that the frontend is able to switch between production and test APIs using proper `.env` files.
- It is possible that some functionalities might be inconsistent with the backend, make sure that they sync well together,
- If they need to be rewriten, do so but without losing the original user experience.

## Libraries
**Try to retain whatever CSS and ReactJS packages have been used.**