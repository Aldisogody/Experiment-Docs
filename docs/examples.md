---
title: Real-World Examples
---

# Real-World Experiment Handling Examples

These examples teach situations and strategies, not complete experiments. Each pattern is intentionally generalized and anonymized; adapt selectors, copy, tracking labels, and configuration to the experiment at hand.

Use these patterns alongside the [`runScript()`](/framework-api/run-script), [`mountExperiment()`](/framework-api/mount-experiment), [`waitFor()` and `watchFor()`](/framework-api/wait-for), and [tracking](/framework-api/tracking) references.

## 1. Wait for Multiple Lazy Dependencies Before Moving Content

**Source:** `coe-158-sebn-miracle-highlight-colours-and-emphasize-on-pdp`

**Stack:** Modern source — `@sogody/experiment-framework`, async DOM utilities, raw DOM movement.

**When to use:** A host page renders both the content to move and its destination asynchronously.

**Problem:** Moving as soon as only one dependency exists can fail or place content incorrectly. Moving visible content can also produce a noticeable jump.

**Approach:** Wait for all required elements with one bounded timeout, exit silently if any dependency never appears, make the move idempotent, and temporarily hide the moving element until the next animation frame.

**Minimal generalized pattern:**

```js
async function moveWhenReady() {
    try {
        const [source, destination] = await Promise.all([
            waitForElement('[data-source]', { timeout: 8000 }),
            waitForElement('[data-destination]', { timeout: 8000 }),
        ]);

        if (source.previousElementSibling === destination) return;

        const previousVisibility = source.style.visibility;
        source.style.visibility = 'hidden';
        destination.after(source);

        requestAnimationFrame(() => {
            source.style.visibility = previousVisibility;
        });
    } catch {
        // A missing lazy dependency is a valid no-op.
    }
}
```

**Modern equivalent:** Prefer `watchFor` for each lazy selector when available, then coordinate the resulting promises inside `runScript`.

## 2. Personalize From Device Detection Without Fighting Host Rewrites

**Source:** `coe-156-miracle-ti-value-personalized-messaging`

**Stack:** Modern source — `@sogody/experiment-framework`, browser device hints, `MutationObserver`.

**When to use:** Messaging depends on a visitor device that can be detected in-browser and mapped to supported business data.

**Problem:** Device APIs may be unavailable, models may be unsupported, and the host application may rewrite the personalized heading after render.

**Approach:** Treat detection as optional, normalize model aliases, require a supported value before rendering, and attach one guarded observer that restores the intended text only when the host changes it.

**Minimal generalized pattern:**

```js
async function resolveSupportedDevice(deviceAliases, valuesByDevice) {
    try {
        const hints = navigator.userAgentData?.getHighEntropyValues
            ? await navigator.userAgentData.getHighEntropyValues(['model'])
            : { model: null };
        const alias = Object.keys(deviceAliases).find((key) => hints.model?.startsWith(key));
        const device = alias ? deviceAliases[alias] : hints.model;
        const value = device ? valuesByDevice[device.toUpperCase()] : null;
        return value > 0 ? { device, value } : null;
    } catch {
        return null;
    }
}

function keepTextApplied(element, text) {
    element.dataset.personalizedText = text;
    const apply = () => {
        if (element.textContent !== text) element.textContent = text;
    };

    apply();
    if (element.dataset.personalizationObserved === 'true') return;

    new MutationObserver(apply).observe(element, {
        childList: true,
        characterData: true,
        subtree: true,
    });
    element.dataset.personalizationObserved = 'true';
}
```

## 3. Maintain Recently Viewed State With a Separate PDP Updater

**Source:** `coe-284-sebn-olympics-2026-campaign-page-recently-viewed-module`

**Stack:** Modern source — separate framework entry point, host product data, Adobe Target profile update.

**When to use:** A later landing page needs browsing history that must be collected on product pages first.

**Problem:** The display experience cannot infer reliable history unless product views continuously update a persistent visitor profile.

**Approach:** Deploy a small PDP-only updater separately from the renderer. Parse old and legacy formats defensively, put the current product first, deduplicate, cap the history, and resend after host product-selection events.

**Minimal generalized pattern:**

```js
function parseHistory(raw) {
    try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
        if (typeof parsed === 'string') {
            return parsed.split(',').map((id) => ({ id: id.trim(), category: 'other' }));
        }
    } catch {
        return [];
    }
    return [];
}

function updateRecentProfile(currentItems, storedValue) {
    const deduped = new Map();
    [...currentItems, ...parseHistory(storedValue)].forEach((item) => {
        if (item.id && !deduped.has(item.id)) deduped.set(item.id, item);
    });

    const recentItems = [...deduped.values()].slice(0, 2);
    sendProfileUpdate({ 'profile.recentItems': JSON.stringify(recentItems) });
}

hostEvents.on('productSelectionChanged', () => {
    updateRecentProfile(readCurrentProducts(), readStoredProfile());
});
```

**Modern equivalent:** Keep the updater in its own `runScript` entry point and use a profile-update-only Web SDK event rather than requesting or rendering Target decisions.

## 4. Blend Personalization With Deduplicated Fallback Products

**Source:** `coe-284-sebn-olympics-2026-campaign-page-recently-viewed-module`

**Stack:** Modern source — Preact renderer, URL-driven categories, host mutation observers.

**When to use:** Personalized recommendations may not fill the full module and configured products must complete the list.

**Problem:** Recent items can overlap fallback products or represent the same model family, and category navigation can leave stale cards mounted.

**Approach:** Select a small personalized prefix, deduplicate fallback items by model family and exact ID, fill the remaining capacity, and rebuild only when the active category changes.

**Minimal generalized pattern:**

```js
const familyKey = (id) => id.slice(0, 8);

function buildRecommendations(recent, fallback, category, limit = 8) {
    const personalized = recent
        .filter((item) => item.category === category)
        .slice(0, 2);

    const usedIds = new Set(personalized.map((item) => item.id));
    const usedFamilies = new Set(personalized.map((item) => familyKey(item.id)));

    const fillers = fallback
        .filter((id) => !usedIds.has(id) && !usedFamilies.has(familyKey(id)))
        .filter((id, index, all) => all.findIndex((other) => familyKey(other) === familyKey(id)) === index)
        .slice(0, limit - personalized.length)
        .map((id) => ({ id, category }));

    return [...personalized, ...fillers];
}

function rebuildForCategory(category) {
    if (category === lastCategory) return;
    lastCategory = category;
    document.querySelector('[data-recommendations]')?.remove();
    renderRecommendations(buildRecommendations(recentItems, configuredItems[category] ?? [], category));
}
```

## 5. Resolve Personalization Through an Explicit Fallback Chain

**Source:** `coe-602-sebn-crm-leadership-campaign`

**Stack:** Modern source — `@sogody/experiment-framework`, cookies, URL parameters, Target profile data.

**When to use:** The same personalized value may arrive from a deep link, a first-party cookie, or a persisted profile.

**Problem:** Sources have different freshness and reliability. Combining them implicitly can select stale data or render an empty experience.

**Approach:** Define priority in one function, return on the first valid value, record values that should be persisted, and exit before mounting when every source is empty.

**Minimal generalized pattern:**

```js
function resolvePersonalizedValue({ search, cookieValue, profileValue }) {
    const queryValue = new URLSearchParams(search).get('offer');

    const candidates = [
        ['url', queryValue],
        ['cookie', cookieValue],
        ['profile', profileValue],
    ];

    for (const [source, value] of candidates) {
        const normalized = String(value ?? '').trim();
        if (normalized) {
            return {
                value: normalized,
                source,
                profileUpdates: source === 'profile' ? {} : { 'profile.savedOffer': normalized },
            };
        }
    }

    return { value: null, source: null, profileUpdates: {} };
}

const resolved = resolvePersonalizedValue(inputs);
if (!resolved.value) return;
```

## 6. Reject Unresolved Adobe Target Placeholders

**Source:** `coe-602-sebn-crm-leadership-campaign`

**Stack:** Modern source — Adobe Target literal placeholders, Preact state initialization.

**When to use:** A Target profile placeholder controls eligibility, prior interaction state, or personalized content.

**Problem:** In local builds or misconfigured delivery, the literal placeholder is non-empty and can be mistaken for a real profile value.

**Approach:** Recognize placeholder syntax before applying business rules. Keep the placeholder as a single-quoted literal in source and treat unresolved values as absent.

**Minimal generalized pattern:**

```js
const unresolvedPrefix = '$' + '{';

function isResolvedTargetValue(value) {
    const normalized = String(value ?? '').trim();
    const looksUnresolved = normalized.startsWith(unresolvedPrefix)
        && normalized.endsWith('}');

    return Boolean(normalized) && !looksUnresolved;
}

function hasCompletedAction(rawValue) {
    return isResolvedTargetValue(rawValue) && rawValue === 'true';
}

// This literal is replaced by Target at delivery time.
const rawProfileFlag = '${user.example_flag}';
const initialCompletedState = hasCompletedAction(rawProfileFlag);
```

## 7. Use a Selector Cascade Across Page Templates

**Source:** `coe-602-sebn-crm-leadership-campaign`

**Stack:** Modern source — raw DOM mounting across home, category, product, and navigation layouts.

**When to use:** One experience must appear at the same logical position on pages with different markup.

**Problem:** A single brittle selector silently excludes valid templates, while a broad fallback can mount in the wrong location.

**Approach:** Order selectors from most specific to most general, choose the first existing anchor, and stop without rendering if no approved anchor exists.

**Minimal generalized pattern:**

```js
function firstMatchingElement(selectors) {
    return selectors
        .map((selector) => document.querySelector(selector))
        .find(Boolean) ?? null;
}

const anchor = firstMatchingElement([
    '[data-primary-navigation]',
    '[data-category-header]',
    '[data-product-anchor-navigation]',
    '[data-floating-navigation]',
]);

if (!anchor) return;

const container = document.createElement('div');
container.dataset.experimentContainer = 'true';
anchor.insertAdjacentElement('beforebegin', container);
```

## 8. Inject the Same Promotion Into Multiple Locations Safely

**Source:** `coe-108-sebn-b2c-solden-2026-pd-promo-signposting`

**Stack:** Modern source — Preact, multiple `waitFor` branches, per-location duplicate guards.

**When to use:** The same offer must appear in two host modules that load independently.

**Problem:** One location may load before the other, callbacks may run more than once, and a page can already contain an injected instance.

**Approach:** Treat each location as an independent mount, wait for its own dependencies, and guard duplicates inside the nearest owning container rather than globally.

**Minimal generalized pattern:**

```js
function injectOnce(owner, createContainer, renderContent) {
    if (!owner || owner.querySelector('[data-promotion-instance="true"]')) return;

    const container = createContainer();
    container.dataset.promotionInstance = 'true';
    renderContent(container);
}

watchFor('[data-offer-list]', (list) => {
    injectOnce(list, () => {
        const item = document.createElement('li');
        list.prepend(item);
        return item;
    }, renderPromotion);
});

watchFor('[data-trade-in] [data-offer-copy]', (copy) => {
    const owner = copy.closest('[data-buying-option]');
    injectOnce(owner, () => {
        const block = document.createElement('div');
        copy.before(block);
        return block;
    }, renderPromotion);
});
```

## 9. Apply Path-Specific Copy Within Market Configuration

**Source:** `coe-313-miracle-ios-switching-ticker-banner`

**Stack:** Modern source — Preact, market configuration, exact-path overrides.

**When to use:** Most pages in a market share copy, but a small number of products require different wording.

**Problem:** Duplicating the entire market configuration for each product makes localization drift likely.

**Approach:** Resolve the market first, then layer a narrow path override over the market default. Fall back to the default when no exact override exists.

**Minimal generalized pattern:**

```js
const config = {
    marketA: {
        default: {
            title: 'Default localized title',
            subtitle: 'Default localized supporting copy',
        },
        pathOverrides: {
            '/market-a/products/model-one/': {
                title: 'Model-specific localized title',
            },
        },
    },
};

function getCopies(market, pathname) {
    const marketConfig = config[market];
    if (!marketConfig) return null;

    return {
        ...marketConfig.default,
        ...(marketConfig.pathOverrides[pathname] ?? {}),
    };
}
```

## 10. Resolve Language and Store Variants From the Route

**Source:** `coe-313-miracle-ios-switching-ticker-banner`, `coe-602-sebn-crm-leadership-campaign`

**Stack:** Modern source — route parsing for localized and multistore configuration.

**When to use:** A country has a language-specific site or multiple storefronts with different copy and placement.

**Problem:** Reading only the first path segment merges distinct audiences, such as Belgium French and Portugal education, business, or member stores.

**Approach:** Centralize route resolution, check specific multistore paths before the country fallback, and use the resolved key for both copy and placement.

**Minimal generalized pattern:**

```js
function resolveStoreKey(pathname) {
    const parts = pathname.split('/').filter(Boolean);
    const [country, second, third] = parts;

    if (country === 'be' && second === 'fr') return 'be_fr';

    if (country === 'pt' && second === 'multistore') {
        if (third === 'education-store') return 'pt-education';
        if (third === 'member-store') return 'pt-member';
    }

    if (country === 'pt' && second === 'business') return 'pt-business';
    return country;
}

const storeKey = resolveStoreKey(window.location.pathname);
const storeConfig = config[storeKey];
if (!storeConfig) return;
```

## 11. Recalculate Dynamic Price Comparisons Idempotently

**Source:** `coe-1324-mx-buy-page-kpn-subscription-ux-improvement`

**Stack:** Source map — Preact, `create-experiment` runtime, host-price mutation observer.

**When to use:** A host buying tool changes model, plan, or sticky-bar prices without a full page load.

**Problem:** A one-time calculation becomes stale. Repeated updates can nest experiment markup, destroy host subscription copy, or leave invalid savings visible.

**Approach:** Re-read canonical host values on every mutation, preserve original markup in data attributes, skip unchanged states using a signature, and fully restore the host UI when inputs are missing or savings are no longer positive.

**Minimal generalized pattern:**

```js
function applyPriceComparison() {
    const data = readCurrentPriceData();

    if (!data || data.fullPrice <= data.bundlePrice) {
        removeComparisonAndRestoreHostMarkup();
        return;
    }

    const signature = [
        data.fullPrice,
        data.bundlePrice,
        data.productName,
    ].join('|');

    if (data.priceNode.dataset.experimentSignature === signature) return;

    const originalTail = data.priceNode.dataset.originalTail
        ?? readSubscriptionMarkup(data.priceNode);

    data.priceNode.dataset.originalTail = originalTail;
    data.priceNode.dataset.experimentSignature = signature;
    data.priceNode.replaceChildren(
        buildComparisonNode(data),
        document.createElement('br'),
        htmlToFragment(originalTail),
    );
}

runScript(() => {
    applyPriceComparison();
    new MutationObserver(applyPriceComparison).observe(document.body, {
        attributes: true,
        characterData: true,
        childList: true,
        subtree: true,
    });
});
```

## 12. Move One Banner Between Normal and Sticky Navigation States

**Source:** `coe-2767-abandoned-browser-by-ecid`

**Stack:** Source map — Preact, `create-experiment` runtime, class-based host state observation.

**When to use:** The host page swaps between normal and sticky navigation and the experiment must remain adjacent to the active navigation.

**Problem:** Rendering a second banner for sticky mode duplicates state and tracking. Leaving the original in place can make it disappear off-screen.

**Approach:** Create one guarded container, mount it according to the initial host class, then move the same node when the sticky signal changes.

**Minimal generalized pattern:**

```js
function placeBanner(container, { sticky, normalAnchor, stickyAnchor }) {
    const anchor = document.querySelector(sticky ? stickyAnchor : normalAnchor);
    if (!anchor) return;

    anchor.insertAdjacentElement(sticky ? 'afterbegin' : 'beforebegin', container);
}

function observePlacement(container, selectors) {
    const signal = document.querySelector(selectors.stickySignal);
    if (!signal) return null;

    const apply = () => placeBanner(container, {
        sticky: signal.classList.contains('is-sticky-transition'),
        normalAnchor: selectors.normalAnchor,
        stickyAnchor: selectors.stickyAnchor,
    });

    apply();
    const observer = new MutationObserver(apply);
    observer.observe(signal, { attributes: true, attributeFilter: ['class'] });
    return observer;
}
```

**Modern equivalent:** Use `mountExperiment` for the initial placement and `watchFor` to obtain the sticky signal before attaching the class observer.

## 13. Gate Messaging With Paid-Media Attribution in the Landing URL

**Source:** `coe-1943-a-series-usp-banner-for-all-paid-media-users`

**Stack:** Source map — Preact, `create-experiment` runtime, URL eligibility guard.

**When to use:** Messaging should appear only for visitors arriving through a named paid-media route and product family.

**Problem:** Page type alone is insufficient because organic and paid visitors can land on the same page.

**Approach:** Normalize the landing URL, require all attribution and product tokens before mounting, and keep this gate ahead of all DOM work.

**Minimal generalized pattern:**

```js
function isEligiblePaidLanding(location) {
    const url = new URL(location.href);
    const channel = (url.searchParams.get('channel') ?? '').toLowerCase();
    const campaign = (url.searchParams.get('campaign') ?? '').toLowerCase();
    const path = url.pathname.toLowerCase();

    return channel === 'paid'
        && campaign.includes('product-family')
        && path.includes('/products/');
}

runScript(() => {
    if (!isEligiblePaidLanding(window.location)) return;

    const container = mountOnFirstApprovedAnchor();
    if (!container) return;
    renderMessage(container);
});
```

## 14. Choose Different Presentation Patterns by Page Type

**Source:** `coe-1001-cro-installation-service`

**Stack:** Source map — Preact, `create-experiment` runtime, route-based page classification.

**When to use:** One proposition belongs in a slim category-page banner but needs a richer product-page upsell.

**Problem:** Forcing one component and placement onto structurally different page types creates awkward UI and brittle conditions.

**Approach:** Classify the route first, return for unsupported pages, and give each page type its own component, anchor, and mount position while sharing only the proposition data that is truly common.

**Minimal generalized pattern:**

```js
function getPageType(pathname, eligibleProductIds) {
    const path = pathname.toLowerCase();
    if (path === '/market/category/') return 'category';
    if (eligibleProductIds.some((id) => path.includes(id))) return 'product';
    return null;
}

runScript(() => {
    const pageType = getPageType(window.location.pathname, configuredProductIds);
    if (!pageType) return;

    if (pageType === 'category') {
        const container = mountExperiment('[data-category-banner]', [], 'afterbegin');
        if (container) renderSlimBanner(container);
        return;
    }

    const container = mountExperiment('[data-product-offers]', [], 'afterbegin');
    if (container) renderProductUpsell(container);
});
```

## 15. Reorder Existing Content by Semantic Landmarks

**Source:** `coe-654-a-series-reordering-content-device-detection-pdp`

**Stack:** Legacy built artifact — `@sogody/experiment-framework`, raw DOM reordering.

**When to use:** Existing host sections must be reordered, but positional selectors are unstable.

**Problem:** `nth-child` selectors break when optional modules appear. Sequential moves can also invalidate later lookups and expose visible layout jumping.

**Approach:** Describe sections through semantic landmarks, resolve all order-sensitive nodes before moving, hide only the owning container, and restore its previous visibility in `finally`.

**Minimal generalized pattern:**

```js
function findSection(container, landmark) {
    const marker = container.querySelector(landmark.selector);
    return marker?.closest(landmark.sectionSelector) ?? null;
}

runScript(() => {
    const container = document.querySelector('[data-feature-container]');
    if (!container) return;

    const source = findSection(container, landmarks.source);
    const followOne = findSection(container, landmarks.followOne);
    const followTwo = findSection(container, landmarks.followTwo);
    const target = findSection(container, landmarks.target);
    if (!source || !target) return;

    const previousVisibility = container.style.visibility;
    container.style.visibility = 'hidden';

    try {
        target.after(source);
        if (followOne) source.after(followOne);
        if (followTwo) (followOne ?? source).after(followTwo);
    } finally {
        container.style.visibility = previousVisibility;
    }
});
```

**Modern equivalent:** Keep the semantic resolver as plain DOM code, but run it through `runScript` and use `watchFor` when the feature container is lazy-rendered.

## 16. Patch an Existing Host Component Instead of Duplicating It

**Source:** `coe-707-sebn-miracle-contingency-crm-voucher`

**Stack:** Legacy built artifact — raw DOM patching of a host carousel, host component reinitialization.

**When to use:** The page already has the correct component type and adding another instance would duplicate navigation, spacing, or behavior.

**Problem:** Host components can clone slides, regenerate titles, and reinitialize controls, overwriting a one-time patch.

**Approach:** Wait for the host component, patch only the required fields, mark injected or wired nodes, synchronize host-controlled text after mutations, and call the host component's supported refresh API when structure changes.

**Minimal generalized pattern:**

```js
function patchHostSlide(slide, patch) {
    const title = slide.querySelector('[data-slide-title]');
    const description = slide.querySelector('[data-slide-description]');
    if (!title || !description) return false;

    const syncTitle = () => {
        const current = slide.querySelector('[data-slide-title]');
        if (current && current.textContent !== patch.title) current.textContent = patch.title;
    };

    syncTitle();
    description.replaceChildren(
        document.createTextNode(`${patch.description} `),
        Object.assign(document.createElement('strong'), { textContent: patch.value }),
    );

    if (slide.dataset.titleSyncAttached !== 'true') {
        new MutationObserver(syncTitle).observe(slide, { childList: true, subtree: true });
        slide.dataset.titleSyncAttached = 'true';
    }

    wireCtaOnce(slide, patch);
    return true;
}

watchFor('[data-host-carousel]', () => {
    if (!patchHostSlide(resolveTargetSlide(), buildPatch())) return;
    refreshHostCarousel?.();
});
```

**Modern equivalent:** Use `watchFor` for the host root and keep patching inside `runScript`; use `mountExperiment` only when the host component cannot be safely extended.

## 17. Track Impressions After Viewport Entry and Interactions After Render

**Source:** `coe-602-sebn-crm-leadership-campaign`

**Stack:** Modern source — Preact hooks, `IntersectionObserver`, Adobe Analytics interaction tracking.

**When to use:** A rendered component needs one exposure event plus click or dismiss events.

**Problem:** Firing an impression on injection overcounts content below the fold, while binding interactions before render attaches listeners to nothing.

**Approach:** Render first, observe the rendered root, unobserve after the first intersection, and bind interactions only after their DOM exists.

**Minimal generalized pattern:**

```js
function trackOnceInView(element, label, threshold = 0.1) {
    if (!element) return null;

    const observer = new IntersectionObserver((entries, currentObserver) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        trackEvent(label);
        currentObserver.unobserve(element);
    }, { threshold });

    observer.observe(element);
    return observer;
}

render(<Banner />, container);

const banner = container.querySelector('[data-banner]');
trackOnceInView(banner, 'experiment: impression');
setupTracking(container, { selector: '[data-primary-action]', label: 'experiment: primary action' });
setupTracking(container, { selector: '[data-dismiss]', label: 'experiment: dismiss' });
```

## 18. Align Control and Variant Exposure to the Same Logical Landmark

**Source:** `eo-916-mx-intuitive-ai-style-summary-on-pdp`

**Stack:** Modern source — separate control and variant entry points, shared viewport tracking helper.

**When to use:** The test KPI depends on visitors actually reaching the area changed by the variant.

**Problem:** Tracking control at page load and variant at viewport entry creates unequal exposure populations.

**Approach:** Define a shared logical landmark. The control observes the existing host section; the variant inserts its replacement at the equivalent position and observes the replacement with the same threshold and event semantics.

**Minimal generalized pattern:**

```js
function observeExposure(element, experience) {
    if (!element) return;
    trackOnceInView(element, `experiment: ${experience}: exposed`, 0.1);
}

// Control entry point
runScript(() => {
    const landmark = document.querySelector(config.controlLandmark);
    observeExposure(landmark, 'control');
});

// Variant entry point
runScript(() => {
    const anchor = document.querySelector(config.variantAnchor);
    if (!anchor) return;

    const container = document.createElement('section');
    anchor.after(container);
    render(<VariantContent />, container);
    observeExposure(container, 'variant');
});
```
