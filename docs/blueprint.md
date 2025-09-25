# **App Name**: ChatPay Money Hub

## Core Features:

- Multi-Tab UI: Provides a dashboard, obligations, debts, budget, and reports in a tabbed interface.
- Debt Visualization: Offers an interactive debt breakdown using a pie chart to show how debts are allocated, generated from locally-stored JSON data.
- Repayment Tooling: Uses historical spending habits to dynamically create future payday projections.
- Envelope Budgeting: Implements an envelope budgeting system, helping users allocate funds to different categories, powered by LLM reasoning about prior debts, expenses and income.
- Debt Pressure Analysis: Estimates credit card, loan, and BNPL burdens, which can serve as an always-available decision-making tool for large purchases.
- Data Persistence: Persists user data locally using useLocalStorage for continuous accessibility.
- Financial Snapshot Export/Import: Allows users to export their financial data as a JSON snapshot for backup and portability, and import previous snapshots to revert their budget to a prior date.
- Financial Goals and Smart Monitoring: Combines visualizing savings progress, tracking BNPL accounts, and flagging high risk for a comprehensive financial overview.
- AI Cash Flow Advisor and Monthly Trend Dashboard: Integrates AI-driven insights for cash flow adjustments with auto-charted trends for debt, surplus, and savings to provide proactive financial management.
- Scenario Simulator and Debt Countdown: Combines 'What If?' simulations for income/debt changes with milestone-based progress bars for debt payoff motivation.
- Cloud Save/Import System and Mobile Optimization: Enables saving across devices with Google Drive sync and optimizes the app for mobile with vertical scroll, slide deck layouts, and dark/light auto-detect.
- Efficiency & Burnout Prevention: Helps you find the most cost‑efficient number of extra shifts while keeping your risk below a tolerance you set.
- Money Hub: A single panel integrating Income Summary, Spending & Debts, and a Plan timeline with a What-if extra shift optimizer.
- Standby/Callback Pay and Scenario Compare Panel: Calculates paycheck math for standby/callback scenarios, combined with a panel to compare extra shifts, payoff time, and burnout risk.
- Advanced Shift Differentials and OT Baseline Selection: Offers minute-accurate slicing for shift differentials, combined with OT baseline selection for precise income modeling.
- Persist Scenario A/B + Debt Plan Integration: Scenarios A & B are saved to localStorage (chatpay:scenario:A/B) so your setups persist. “Apply to Debt Plan” writes a boost to chatpay:debt:scenarioBoost: Monthly boost or Per pay period.
- Income & Shift Modeling, Taxes, and Burnout/Efficiency: Offers income/shift modeling, integrated federal tax estimator, and burnout/efficiency optimizer.
- Obligations, Debts, and Budget Management: Full CRUD operations for obligations and debts, combined with budget envelope management.
- Import/Export and State Persistence: Allows import/export of financial data and persists app state in localStorage.
- UI Polish & Usability: Accessible Modals, Tabs, Utility Chips, Tooltips, Consistent Buttons/Inputs, and Tailwind Styles. Use modern and latest stable dependencies
- Bill Negotiation Tool: Uses an LLM to help the user negotiate down their bills with service providers. The user will provide details about the bill, and the LLM will output a script that the user can read to the service provider.
- Investment Tracking: Allow users to track their investments, including stocks, bonds, and mutual funds.
- Net Worth Calculation: Automatically calculate the user's net worth by subtracting liabilities from assets.
- Tax Optimization Tool: Suggests ways to optimize the user's tax liability, such as contributing to a retirement account or claiming deductions.
- Gamification: Add gamification elements to the app, such as points, badges, and leaderboards, to encourage users to engage with the app more frequently.
- Advanced Reporting: Create more advanced reports, such as income statements, balance sheets, and cash flow statements.
- Customizable Alerts: Allow users to customize alerts for things like upcoming bills, low balances, and changes in net worth.
- AI-Powered Financial Education: Provide users with personalized financial education content based on their individual circumstances. The LLM will use reasoning to decide what content to suggest.
- Integration with Financial Institutions: Automatically import transactions from banks, credit cards, and other financial institutions.
- Zip Aware Tax Calculations: Calculate taxes based on the user's zip code to provide accurate tax information.
- Income Viability Calculation: Calculates total gross income - (tax burden + cost of living) to determine income viability.

## Style Guidelines:

- Primary accent locked to #0A84FF (iOS-style accent)
- --bg: #0B0C0E (dark) / #FFFFFF (light)
- --surface: #121317 / #F8FAFC
- --surface-2: #17181C / #F1F5F9
- --text: #E6EAF0 / #0B0C0E
- --muted: #98A2B3 / #667085
- --primary: #0A84FF
- --success: #22C55E
- --warning: #F59E0B
- --danger: #EF4444
- --chart-1..5: #0A84FF, #22C55E, #8B5CF6, #F59E0B, #EF4444
- Headlines: Playfair — Display (44/52), H1 (34/40), H2 (28/34), H3 (22/28); weight 600.
- Body: PT Sans — Body (16/24), Secondary (14/20), Caption (12/16); weights 400/500.
- Stroke 1.5px; sizes 16/20/24; icon + label in tabs; icon-only buttons require aria-label. Mappings: Dashboard `Dashboard`, Budget `Wallet`, Debts `CreditCard`, Reports `BarChart`, Scenario `Layers`, Money Hub `CircleDollarSign`.
- Durations: 120ms (micro), 200ms (standard), 300ms (entrance). Easing: cubic-bezier(0.2, 0.8, 0.2, 1).
- Patterns: fade+slide 8px on mount; chart count-ups ≤600ms; cancel on route change or user input.
- 8-pt baseline; spacing tokens in 4/8 increments.
- Mobile: single column + sticky Money Summary; bottom tab bar.
- Tablet/desktop: responsive 12-col grid (16–24px gutters); content max-width 1200px.
- Component padding: xs 8 / sm 12 / md 16 / lg 24.