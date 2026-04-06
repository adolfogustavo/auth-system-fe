# validate

Run full project validation and fix any errors found.

## Steps

1. Execute `npm run validate` (compile + lint + test)
2. If there are compilation errors, fix them
3. If there are lint errors, fix them
4. If there are test failures, fix them
5. Re-run `npm run validate` until all checks pass

## Rules

- **NEVER disable linter rules** with comments like `eslint-disable` or `@ts-ignore`
- **NEVER suppress warnings** by adding ignore comments
- If there's no clear fix for a lint warning or error, **STOP and ask the user** what they want to do
- Present the options clearly:
  - Option A: Refactor the code to satisfy the rule
  - Option B: Disable the rule (only if user explicitly approves)
  - Option C: Other approaches the user might suggest
