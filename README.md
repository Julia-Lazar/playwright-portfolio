# Playwright Portfolio · UI + API test automation

![tests](https://github.com/Julia-Lazar/playwright-portfolio/actions/workflows/playwright.yml/badge.svg)

End-to-end and API tests written in **Playwright + TypeScript**, running in **GitHub Actions** on every push and pull request.

## What is tested
| Area | System under test | Tests |
|---|---|---|
| Login (valid + 3 negative cases, data-driven) | Sauce Demo (UI) | `tests/ui/login.spec.ts` |
| Sorting, cart, full checkout, form validation | Sauce Demo (UI) | `tests/ui/shop.spec.ts` |
| Booking CRUD chain + auth (403) | Restful Booker (API) | `tests/api/booking.spec.ts` |
| Accessibility (axe-core) | Sauce Demo (UI) | `tests/ui/a11y.spec.ts` |

### Systems under test
- **UI:** [Sauce Demo](https://www.saucedemo.com), a demo shop with login, product list, cart and checkout.
- **API:** [Restful Booker](https://restful-booker.herokuapp.com/apidoc/index.html), a hotel booking REST API with token auth.

**Why two different applications?**
I built this project while learning test automation, so I chose the best-known, stable practice target for each layer: Sauce Demo for UI flows and Restful Booker for API testing. Both are public, so anyone can clone the repo and run the tests.

The trade-off: the UI and API suites test two unrelated products, so they don't support each other the way they would in a real project. The framework is ready for that. UI and API are separate Playwright projects with their own `baseURL`, sharing config, CI and the HTML report, so pointing both at one application is a configuration change.

## Tech & design decisions
- **Page Object Model** in `pages/`: locators live in one place.
- **Custom fixtures** in `fixtures/`: tests ask for `{ loginPage }` instead of building objects.
- **Log in once** (`auth.setup.ts` + `storageState`): faster, and login tests use a fresh browser on purpose.
- **Stable locators**: `getByTestId` with the app's `data-test` attributes, web-first assertions, no hard waits.
- **API tests create their own data** and use the dynamic ID: the public API is shared and resets often.
- **Readable reports**: the API chain is split into `test.step` blocks (create → read → update → delete), so a failure points to the broken stage.
- **CI**: runs on every push and pull request; retries only on CI, trace on first retry, HTML report uploaded as an artifact even when tests fail.

## Run it
```bash
npm ci
npx playwright install
npm test            # everything
npm run test:smoke  # only @smoke
npm run report      # open the HTML report
```

## Findings
- **Restful Booker:** `DELETE /booking/{id}` returns **201 Created** instead of the usual **204 No Content** (or 200). The test asserts the actual behaviour and documents the quirk, so a future fix in the API will be noticed.

## Next steps
- [ ] **UI + API on one product**: add a suite for an app that has both layers, creating test data through the API and verifying it in the UI
- [ ] **Log in via API** in UI tests to skip the login screen and speed up the suite
- [ ] **API schema validation** with `zod`
- [ ] **Visual regression** for the product grid (`toHaveScreenshot`)
- [ ] **Cross-browser runs** on Firefox and WebKit
- [ ] **Sharding in CI** to keep feedback fast as the suite grows
