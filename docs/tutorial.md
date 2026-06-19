---
title: Tutorial
---

# Tutorial

Build a product-card experiment from scaffold to production bundle. Use [Quick Start](/getting-started/quick-start) instead when you want the shortest minimal-boilerplate walkthrough.

## 1. Scaffold

```bash
npx create-experiment product-upsell
cd product-upsell
nvm use
```

Choose `product-card`, one variation, the default `sgd` namespace, and no E2E testing for this walkthrough.

## 2. Configure the target

Update `src/config.js`:

```js
export const selectors = {
    primary: '[data-testid="product-list"]',
    fallbacks: ['main', 'body'],
};

export const MODEL_CODE_MAP = {
    default: 'SM-XXXXXXX',
    uk: 'SM-XXXXXXX',
};
```

Replace the sample model codes with the approved codes for the experiment. Keep the selector chain ordered from the most specific target to the broadest fallback.

## 3. Configure copy

The scaffold keeps the translations object private and exports the resolved value:

```js
const translations = {
    uk: {
        title: 'Upgrade to the latest model',
        from: 'From',
        ctaText: 'Shop now',
    },
};

export const translationByMarket = translations[locale] || translations.uk;
```

Add every supported URL locale and retain a known fallback.

## 4. Review product loading

`src/helpers.js` resolves the market model code, calls the Samsung product-card API, and returns `{ data, error }`.

```jsx
const { data } = await fetchProductCard();
if (!data) return;
```

Returning silently prevents a failed API response from breaking the host page.

## 5. Render and track

Keep tracking after `render()`:

```jsx
render(
    <ExperimentCard
        title={translationByMarket.title}
        priceText={`${translationByMarket.from} ${formatPrice(data.promotionPrice)}`}
        ctaText={translationByMarket.ctaText}
        ctaLink={data.configuratorUrl}
        imageSrc={data.thumbUrl ? `https:${data.thumbUrl}` : undefined}
        imageAlt={data.imageAlt || data.displayName || ''}
    />,
    container,
);

setupTracking(container, {
    label: 'product-upsell: v1 cta clicked',
});
```

The product card renders an anchor, so `setupTracking()` can use its default selector of `'a'`.

## 6. Preview

```bash
pnpm start 0
```

Paste the copied bundle into Adobe Target, or configure `targetUrl` in `experiment.config.js` and run:

```bash
pnpm live
```

## 7. Build

```bash
pnpm lint
pnpm build
```

The final bundle is `dist/v1-index.jsx`.
