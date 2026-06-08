# Markets Reference

All Samsung markets available when selecting E2E test targets during scaffolding.

The group codes in this page are CLI choices. The generated `markets` array uses country identifiers such as `BE` and `BE_FR`; canonical team references may call those `BENL` and `BEFR`.

## Multi-country groups

These groups run one E2E test per country — selecting SEBN generates three test iterations.

| Group code | Name | Countries | URL paths |
|---|---|---|---|
| `SEBN` | Benelux | BE (NL), BE_FR, NL | `be`, `be_fr`, `nl` |
| `SENA` | Nordics | SE, NO, DK, FI | `se`, `no`, `dk`, `fi` |
| `SEIB` | Iberia | ES, PT | `es`, `pt` |

## Major single markets

| Group code | Name | Country code | URL path |
|---|---|---|---|
| `SEUK` | UK | `UK` | `uk` |
| `SEF` | France | `FR` | `fr` |
| `SEG` | Germany | `DE` | `de` |
| `SEI` | Italy | `IT` | `it` |
| `SEPOL` | Poland | `PL` | `pl` |
| `SECA` | Canada | `CA` | `ca` |

## Additional European markets

| Group code | Name | Country code | URL path |
|---|---|---|---|
| `EUROPE_AL` | Albania | `AL` | `al` |
| `EUROPE_AT` | Austria | `AT` | `at` |
| `EUROPE_BA` | Bosnia | `BA` | `ba` |
| `EUROPE_BG` | Bulgaria | `BG` | `bg` |
| `EUROPE_HR` | Croatia | `HR` | `hr` |
| `EUROPE_CZ` | Czech Republic | `CZ` | `cz` |
| `EUROPE_EE` | Estonia | `EE` | `ee` |
| `EUROPE_GR` | Greece | `GR` | `gr` |
| `EUROPE_HU` | Hungary | `HU` | `hu` |
| `EUROPE_IE` | Ireland | `IE` | `ie` |
| `EUROPE_LV` | Latvia | `LV` | `lv` |
| `EUROPE_LT` | Lithuania | `LT` | `lt` |
| `EUROPE_MK` | Macedonia | `MK` | `mk` |
| `EUROPE_RO` | Romania | `RO` | `ro` |
| `EUROPE_RS` | Serbia | `RS` | `rs` |
| `EUROPE_SK` | Slovakia | `SK` | `sk` |
| `EUROPE_SI` | Slovenia | `SI` | `si` |
| `EUROPE_CH` | Switzerland | `CH` | `ch` |

## URL resolution

Market URLs are constructed as:

```
{baseUrl}/{urlPath}/{pagePath}
```

For example, `SEUK` on the homepage:

```
https://samsung.com/uk/
```

`SEBN` Belgium (FR):

```
https://samsung.com/be_fr/
```

## Adding a custom market

The interactive CLI currently offers only the listed choices. The resolver supports custom codes programmatically, and you can always edit `e2e/config.js` after scaffolding.
