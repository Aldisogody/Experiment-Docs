# Path and Market

The runtime includes small URL helpers for market-aware experiment logic. They do not validate Samsung market codes; they only parse the browser path.

## getPath()

Returns the current pathname, query string, and hash.

### Signature

```ts
getPath(): string
```

Outside a browser, it returns an empty string.

### Example

```js
// URL: https://www.samsung.com/uk/shop/?cid=test#offers
getPath(); // "/uk/shop/?cid=test#offers"
```

### Returns

`string`

### Since

Unreleased

## getPathSegments()

Splits a path into raw, non-empty pathname segments. Query strings and hashes are ignored.

### Signature

```ts
getPathSegments(path?: string): string[]
```

### Parameters

| Parameter | Type | Default | Description |
|---|---|---|---|
| `path` | `string` | `getPath()` | Browser path or explicit path to parse. |

### Example

```js
getPathSegments('/UK//Galaxy-S25/buy/?cid=test#offers');
// ["UK", "Galaxy-S25", "buy"]
```

### Returns

`string[]`

### Since

Unreleased

## getMarket()

Returns the lowercase first pathname segment.

### Signature

```ts
getMarket(path?: string): string | null
```

### Parameters

| Parameter | Type | Default | Description |
|---|---|---|---|
| `path` | `string` | `getPath()` | Browser path or explicit path to parse. |

### Example

```js
getMarket('/UK/galaxy-s25/buy/'); // "uk"
getMarket('/'); // null
```

### Returns

The lowercase first segment, or `null` when no segment exists.

### Since

Unreleased

### See Also

- [Markets Reference](/reference/markets)
- [`runScript()`](/framework-api/run-script)
