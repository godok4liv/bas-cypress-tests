

Pharmacy BAS Automation Suite
This repository contains the end-to-end (E2E) automation framework for the Business Automation System (BAS). The project focuses on streamlining pharmacy operations, ensuring data integrity, and preventing theft through automated security audits.

🚀 Key Objectives
Workflow Integrity: Automating Procurement → Stocking → Selling.

Security: Monitoring staff activity through automated Audit Log verification.

Scalability: Testing multi-branch operations with isolated data.

Customer Engagement: Validating prescription reminders and notifications.

🛠 Tech Stack
Framework: Cypress.io

Language: JavaScript / TypeScript

Reporting: Allure Reports

Design Pattern: Page Object Model (POM)

IDE: VS Code

📁 Folder Structure
Plaintext
├── .vscode/                 # Editor settings & extensions
├── cypress/
│   ├── e2e/                 # Test scenarios (Onboarding, Sales, Security)
│   ├── fixtures/            # Test data (logos, user credentials)
│   ├── support/             # Custom commands & Page Objects
├── allure-results/          # Raw data for Allure reports
└── cypress.config.js        # Main configuration


💻 Getting Started
1. Prerequisites
Ensure you have Node.js installed.

2. Installation
Bash
# Install dependencies
npm install
3. Running Tests
Open Cypress UI: npx cypress open

Run all tests (Headless): npm run cy:run

Generate & View Allure Report: npm run test:allure

🔒 Security & Audit Features
The suite includes specialized tests to ensure the system's "Transparency and Security" goals:

RBAC Checks: Ensures staff cannot access sensitive financial or branch-level settings.

Audit Logs: Every price override or stock adjustment is verified against the backend log.

Data Consistency: Cross-checks the UI stock levels against the database using cy.task