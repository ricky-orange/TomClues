# Tom Clues

Tom Clues is a mini game collection website / app prototype. The first playable game is Mastermind.

## Current Scope

- Game hub home screen.
- Bright, bold, card-based casual game style.
- Hanging detective silhouette with a subtle floating animation.
- Mastermind game screen with Easy and Hard clue modes.
- 100 levels, 7-move limit, timer, and per-level local ranking.
- Mouse and keyboard controls: left/right selects a slot, up/down changes color, Enter or Space checks the guess.

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
