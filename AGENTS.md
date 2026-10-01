# Project Directives & Workflow Rules

## 1. Automatic GitHub Synchronization Rule
- Target Repository: `https://github.com/megdy1919955-ux/megdy1919.git`
- Branch: `main`
- Mandatory Action: After EVERY successful change, feature addition, bug fix, or refactor, the assistant MUST immediately stage all modified files, commit them with a clear descriptive message, and execute `git push origin main`.
- Never wait for the user to ask for a commit or push. The GitHub repository must always remain 100% in sync with the latest working state.
- Ensure all tests/lint/compiles pass cleanly before pushing to protect the production codebase from breaking.

## 2. Codebase Integrity & Quality
- Preserve existing user features, layout styles, and business logic.
- Avoid introducing any breaking changes or wiping historical modules.
- Maintain high visual polish, correct Arabic localization, and seamless user experience.
