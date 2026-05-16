# For Cheloja — Setup & Customization

A cinematic monthsary site. No build, no backend — just open `index.html`.

## File map

```
monthsary/
├─ index.html          ← page structure
├─ css/style.css       ← all styling
├─ js/script.js        ← animations, counter, letter, music, easter egg
└─ assets/
   ├─ images/          ← drop photos here (see README.txt inside)
   ├─ music/           ← drop song.mp3 here (see README.txt inside)
   └─ fonts/           ← optional, fonts load from Google Fonts by default
```

## Run it locally

Easiest — just double-click `index.html`. It will open in your browser.

For a smoother dev experience (avoids one-time autoplay quirks and lets the browser load music correctly), serve it from a local web server:

```powershell
# from the monthsary folder
python -m http.server 8080
# then open http://localhost:8080
```

Or with VS Code: install the **Live Server** extension and click *Go Live*.

## Where to customize

All personal text and the anniversary date are easy to find:

| What                          | Where                                                              |
| ----------------------------- | ------------------------------------------------------------------ |
| Anniversary date              | `js/script.js` → `CONFIG.startDate` (currently August 27, 2022)     |
| Cinematic opening lines       | `js/script.js` → `CONFIG.heroLines`                                |
| Typewritten love letter       | `js/script.js` → `CONFIG.letter`                                   |
| Hero quote                    | `index.html` → `.hero__quote`                                      |
| Timeline cards (dates/titles) | `index.html` → `.timeline__item` blocks                            |
| “Why I Love You” cards        | `index.html` → `.reason-card` blocks                               |
| Final section text            | `index.html` → `.finale` block                                     |
| Photos                        | drop into `assets/images/` (see filename list in its README)        |
| Background song               | save as `assets/music/song.mp3`                                    |

The signature quote — *“The moment your smile became my favorite sight”* — already appears as the hero quote and as the title of the 4th timeline card.

## Deploy to GitHub Pages

1. Create a new public GitHub repo (e.g. `monthsary`).
2. From the `monthsary` folder, push it up:

   ```powershell
   git init
   git add .
   git commit -m "for Cheloja"
   git branch -M main
   git remote add origin https://github.com/<your-username>/monthsary.git
   git push -u origin main
   ```
3. On GitHub: **Settings → Pages → Build and deployment → Source = `Deploy from a branch` → Branch = `main` / `(root)`** → Save.
4. Wait ~1 minute. Your site goes live at:
   `https://<your-username>.github.io/monthsary/`

Optional — pretty domain via GitHub Pages custom domain.

## Notes

- Music will not auto-play until Cheloja taps the floating *Play our song* button (browser policy). The button label updates once it’s playing.
- The tiny dim heart icon in the bottom-left is the secret easter egg. Click it. 🤫
- The site falls back gracefully on low-end phones (fewer particles) and respects `prefers-reduced-motion`.
- The live counter updates every second and includes months, days, hours, minutes, seconds — anchored to the day of month, so a “1 month” mark crosses on the 27th of each month.

Made with love. ♡
