# Markets in E2E Tests

For the complete list of all available markets and their codes, see the [Markets Reference](/reference/markets).

## How market codes map to URLs

Each market has a `urlPath` that maps to a URL path segment on samsung.com:

| Market | Code | URL path | Example URL |
|---|---|---|---|
| United Kingdom | `UK` | `uk` | `https://samsung.com/uk/` |
| Germany | `DE` | `de` | `https://samsung.com/de/` |
| Belgium (FR) | `BE_FR` | `be_fr` | `https://samsung.com/be_fr/` |
| Netherlands | `NL` | `nl` | `https://samsung.com/nl/` |

## Multi-country groups

When you select a multi-country group at scaffold time, the E2E tests run against all countries in the group. For example, selecting **SEBN (Benelux)** generates three test iterations:

```
smoke test — Belgium (NL)    → https://samsung.com/be/
smoke test — Belgium (FR)    → https://samsung.com/be_fr/
smoke test — Netherlands     → https://samsung.com/nl/
```

This happens automatically because `urlsConfig.markets` is populated with all countries in the group, and the smoke spec loops over `urlsConfig.markets`.

The E2E config uses scaffold identifiers such as `BE` and `BE_FR`. Team targeting and reporting references may use canonical labels such as `BENL` and `BEFR`; do not substitute them without also updating `e2e/config.js`.

## Changing the market after scaffolding

Edit `e2e/config.js` directly:

```js
export const urlsConfig = {
    baseUrl: 'https://samsung.com',
    bundlePath: 'dist/v1/v1.js',
    markets: [
        // Add or remove entries here
        { code: 'UK', urlPath: 'uk', name: 'United Kingdom' },
        { code: 'DE', urlPath: 'de', name: 'Germany' },
    ],
    // ...
};
```

The test loop will automatically pick up the updated market list on the next run.
