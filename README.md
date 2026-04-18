# Brain Drain Intelligence Tracker
### AU Health Intelligence · Dashboard 02

Interactive intelligence platform tracking physician and nurse emigration flows from African Union member states to European health systems.

![Next.js](https://img.shields.io/badge/Next.js-14-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Recharts](https://img.shields.io/badge/Recharts-2.10-green)

---

## What This Is

A policy-grade dashboard mapping the structural haemorrhage of trained health workers from Africa to Europe — quantifying emigration rates, migration corridors, EU reception data, and composite drain indices across 15 AU member states.

The dashboard connects two health system crises in a single analytical frame: African workforce deficits and European dependency on foreign-trained professionals.

---

## Data Sources

| Source | What It Provides |
|--------|-----------------|
| WHO National Health Workforce Accounts (NHWA) 2022 | Physician/nurse density per 100k by country |
| World Bank Health Nutrition and Population Statistics 2023 | Workforce stock estimates and emigration proxies |
| OECD Health Statistics 2023 | Foreign-trained physician stock in EU receiving countries |
| Africa CDC Health Workforce Report 2022 | Regional workforce gap analysis |
| Lancet Migration: Health Worker Migration from Africa, 2023 | Emigration rate estimates and corridor data |
| EU Directive 2013/55/EU | Professional qualifications recognition flows |
| NHS Digital Workforce Statistics 2022 | UK-specific foreign-trained physician data |

---

## Key Metrics

- **Brain Drain Index**: Composite 0–100 score weighting emigration rate, workforce density deficit, annual net loss, and trajectory
- **Emigration Rate**: Estimated % of domestically-trained physicians currently working abroad
- **Migration Corridors**: Origin–destination pairs with estimated physician stock and specialty breakdown
- **EU Reception Analysis**: African-origin physician share of total foreign-trained workforce by EU member state

---

## Quick Start

```bash
git clone https://github.com/au-health-intelligence/brain-drain-intelligence-tracker
cd brain-drain-intelligence-tracker
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

**Windows:**
```cmd
cd C:\Users\YourName\Downloads\brain-drain-intelligence-tracker
npm install
npm run dev
```

---

## Architecture

- **Next.js 14 App Router** — server components handle data scoring
- **TypeScript** — all data entities fully typed
- **Tailwind CSS** — utility base with custom dark cartographic aesthetic
- **Recharts** — BarChart, LineChart for workforce and corridor visualisation
- **Google Fonts** — Syne (display) + Space Mono (data/mono)

Data is embedded in `/app/api/data/route.ts`. In a production WHO or AU Commission environment, this route connects to WHO NHWA API, World Bank DataBank, and OECD.Stat SDMX feeds.

---

## Aesthetic

Dark cartographic — void black backgrounds, amber data highlights, migration flow lines, gridded surface. Designed to feel like field intelligence rather than institutional reporting.

---

## Coverage

- **Countries**: 15 AU member states (highest drain burden)
- **Migration Corridors**: 10 Africa → EU pairs
- **EU Receiving Countries**: 8
- **Reference Year**: 2022

---

## Author

**Ofile Mfetane** — Health systems data analyst and developer based in Botswana.
Building applied analytics tools for African and European public health and policy research contexts.

[LinkedIn](https://linkedin.com/in/ofile-mfetane) · [Medium](https://medium.com/@ofilemfetane) · [GitHub](https://github.com/eu-health-intelligence)

---

## Licence

MIT — use freely. Cite original data sources when reproducing outputs.
