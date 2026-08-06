# Markets reference

These market groups and codes are available when you configure E2E tests.

The group codes in this page are the current CLI choices from `experiment-framework/lib/markets.js`.
The generated `markets` array uses country identifiers such as `BE` and `BE_FR`; canonical team references may call those `BENL` and `BEFR`.

## Multi-country groups

Each group runs one E2E test per country. Selecting `BENELUX`, for example, creates three test cases.

| Group code | Name | Countries | URL paths |
|---|---|---|---|
| `BENELUX` | Benelux | `BE`, `BE_FR`, `NL` | `be`, `be_fr`, `nl` |
| `NORDICS` | Nordics | `SE`, `NO`, `DK`, `FI` | `se`, `no`, `dk`, `fi` |
| `IBERIA` | Iberia | `ES`, `PT` | `es`, `pt` |

## Major single markets

| Group code | Name | Country code | URL path |
|---|---|---|---|
| `UK` | UK | `UK` | `uk` |
| `FRANCE` | France | `FR` | `fr` |
| `GERMANY` | Germany | `DE` | `de` |
| `ITALY` | Italy | `IT` | `it` |
| `POLAND` | Poland | `PL` | `pl` |
| `CANADA` | Canada | `CA` | `ca` |

## Additional European markets

| Group code | Name | Country code | URL path |
|---|---|---|---|
| `AL` | Albania | `AL` | `al` |
| `AT` | Austria | `AT` | `at` |
| `BA` | Bosnia | `BA` | `ba` |
| `BG` | Bulgaria | `BG` | `bg` |
| `HR` | Croatia | `HR` | `hr` |
| `CZ` | Czech Republic | `CZ` | `cz` |
| `EE` | Estonia | `EE` | `ee` |
| `GR` | Greece | `GR` | `gr` |
| `HU` | Hungary | `HU` | `hu` |
| `IE` | Ireland | `IE` | `ie` |
| `LV` | Latvia | `LV` | `lv` |
| `LT` | Lithuania | `LT` | `lt` |
| `MK` | Macedonia | `MK` | `mk` |
| `RO` | Romania | `RO` | `ro` |
| `RS` | Serbia | `RS` | `rs` |
| `SK` | Slovakia | `SK` | `sk` |
| `SI` | Slovenia | `SI` | `si` |
| `CH` | Switzerland | `CH` | `ch` |

## URL resolution

Market URLs are constructed as:

```
{baseUrl}/{urlPath}/{pagePath}
```

For example, `UK` on the homepage:

```
https://samsung.com/uk/
```

`BENELUX` Belgium (FR):

```
https://samsung.com/be_fr/
```

## Adding a custom market

The interactive CLI currently offers only the listed choices. The resolver supports custom codes programmatically, and you can always edit `e2e/config.js` after scaffolding.
