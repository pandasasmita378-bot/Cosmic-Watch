# AI-LOG: Cosmic Watch Project

## 1. Overview
This document details the usage of Large Language Models (LLMs) and AI tools during the development of **Cosmic Watch**. AI was utilized primarily for boilerplate generation, debugging, and architectural guidance. All logic and implementations were reviewed, tested, and integrated manually by the development team.

## 2. Tools Used
* **LLM Assistant:** Google Gemini / ChatGPT (Specify which one you used)
* **Purpose:** Code generation, Error resolution, Documentation support.

## 3. Usage Breakdown

### A. Frontend Development
* **Boilerplate Code:** Generated initial React component structures (`Navbar`, `Home`, `Login`) to accelerate UI setup.
* **3D Visualization:** Assisted in generating the `react-three-fiber` code for the interactive 3D Earth and asteroid orbit visualization in `Earth3D.jsx`.
* **Styling:** Generated Tailwind CSS utility classes for the "Space Theme" (dark mode, grids, and responsive layouts).

### B. Backend Development
* **API Structure:** Generated the skeleton for Express.js routes and controllers (`authController.js`, `asteroidController.js`).
* **Database Models:** Assisted in defining the Mongoose schema for User and Watchlist models.
* **Authentication:** Provided the logic for JWT (JSON Web Token) implementation and `bcrypt` password hashing.
* **NASA API Integration:** Helped parse the complex nested JSON response from the NASA NeoWs API to extract relevant asteroid data (Diameter, Velocity, Miss Distance).

### C. DevOps & Deployment
* **Containerization:** Generated the initial `Dockerfile` for both frontend and backend services.
* **Orchestration:** Assisted in writing the `docker-compose.yml` file to link the Frontend, Backend, and MongoDB services together.

## 4. Verification & Originality
While AI tools provided the foundational code and debugging assistance:
1.  **Business Logic:** The specific "Risk Analysis" algorithm and "Hazardous" scoring logic were defined and refined by the team.
2.  **Integration:** The connection between the frontend (React) and backend (Express) was manually configured and tested.
3.  **Debugging:** AI was used to explain specific error messages (e.g., `MODULE_NOT_FOUND`, Docker syntax errors), but the fixes were applied and verified by the team.

---
*Signed,*
*Team Cosmic Watch*