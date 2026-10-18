# QA results — AGROHUB Atelier v5

| Item | Result |
|---|---|
| Responsive overflow 320 / 390 / 768 / 1440 / 1920 px | None |
| Browser runtime exceptions | None |
| Image assets | 16/16 loaded after eager-load test |
| Language switching | UZ, RU, EN passed |
| Category filter | Equipment = 2 matching sample cards |
| Commission calculator | 10,000,000 UZS -> 300,000 UZS commission |
| Mobile menu | Opens as expected |
| Pinned narrative 4 frames | Advances through all 4 on 1440 and 390 px |
| Backend validation | 8/8 tests passed |
| Local lead API | HTTP 201, persisted JSONL (test record deleted before packaging) |
| Hosted form persistence | Requires configured API/backend |
| Vite production build | Not verified because npm registry not available |

Preview screenshots are included in the separate chat attachments. **The standalone demo file is the best way to experience the scrolling motion**; static screenshots cannot depict scroll triggers.
