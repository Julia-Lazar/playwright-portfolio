# Playwright Portfolio · UI + API test automation

![tests](https://github.com/Julia-Lazar/playwright-portfolio/actions/workflows/playwright.yml/badge.svg)

End-to-end and API tests written in **Playwright + TypeScript**, running in **GitHub Actions** on every push.

## What is tested
| Area | System under test | Tests |
|---|---|---|
| Login (valid + 3 negative cases, data-driven) | Sauce Demo (UI) | `tests/ui/login.spec.ts` |
| Sorting, cart, full checkout, form validation | Sauce Demo (UI) | `tests/ui/shop.spec.ts` |
| Booking CRUD chain + auth (403) | Restful Booker (API) | `tests/api/booking.spec.ts` |
| Accessibility (axe-core) | Sauce Demo (UI) | `tests/ui/a11y.spec.ts` |

## Tech & design decisions
- **Page Object Model** in `pages/`: locators live in one place.
- **Custom fixtures** in `fixtures/`: tests ask for `{ loginPage }` instead of building objects.
- **Log in once** (`auth.setup.ts` + `storageState`): faster, and login tests use a fresh browser on purpose.
- **Stable locators**: `getByTestId` with the app's `data-test` attributes, web-first assertions, no hard waits.
- **API tests create their own data** and use the dynamic ID: the public API is shared and resets often.
- **CI**: retries only on CI, trace on first retry, HTML report uploaded as an artifact even when tests fail.

## Run it
```bash
npm ci
npx playwright install
npm test            # everything
npm run test:smoke  # only @smoke
npm run report      # open the HTML report
```

## Findings
- API's quirk: 201 status code instead of 204 after deleting a resource

## What I would add next
- Visual regression for the product grid · API schema validation with zod · tests on Firefox/WebKit · sharding in CI