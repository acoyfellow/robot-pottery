# RoboPottery

A playful clay robot maker for children age 10 and under. Mix generated ceramic heads, bodies, feet, stickers, and glazes; spin the pottery wheel; bake the creation; then wake it up and dance.

## Play locally

```bash
npm install --registry=https://registry.npmjs.org --userconfig=/dev/null
npm run dev
```

## Deploy

```bash
CLOUDFLARE_ACCOUNT_ID=<account-id> npm run deploy
```

## Art

The workshop, robot parts, and ceramic stickers are generated production artwork. Modular sheets are chroma-keyed and cropped into transparent PNG layers for in-browser composition. The game does not use SVG stand-ins.
