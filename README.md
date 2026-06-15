# Tom Clues

Tom Clues is a mini game collection website / app prototype. The playable games are Mastermind, Bulls & Cows, Word Clues, and Sliding Puzzle.

## Current Scope

- Game hub home screen.
- Bright, bold, card-based casual game style.
- Hanging detective silhouette with a subtle floating animation.
- Mastermind game screen with Easy and Hard clue modes.
- Bulls & Cows game screen with 4-digit A/B clues.
- Word Clues game screen with Easy, Normal, and Hard word lengths.
- Sliding Puzzle game screen with Easy, Medium, Hard, Hell, and unranked Practice.
- 100 levels, 7-move limit, timer, and per-level local ranking.
- 100 Bulls & Cows levels, 10-guess limit, timer, and per-level local ranking.
- 50 Word Clues levels per difficulty, timer, and per-level local ranking.
- 25 Sliding Puzzle levels per difficulty, timer, move count, and per-level local ranking.
- Mouse, touch, and keyboard controls.

## Local Testing

Open `index.html` directly, or run any static file server from the project directory.

```powershell
python -m http.server 5173
```

Then open:

```text
http://localhost:5173
```

## APK Direction

The recommended path is to add PWA offline caching first, then wrap the same web app with Capacitor for Android APK output.
