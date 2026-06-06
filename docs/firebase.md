# Firebase Setup

Husky Snow uses Firebase anonymous auth plus Firestore for cross-device multiplayer. Local browser mode is only a fallback when Firestore writes fail.

## Required App Variables

Set these as GitHub repository variables so the Pages workflow can build the app:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_MEASUREMENT_ID`
- `VITE_HUSKY_AI_WORKER_URL`

The Firebase web config is public by design, but the key should still be domain-restricted in Google Cloud/Firebase.

## Firestore Rules

Rules live in `firestore.rules`. They allow signed-in anonymous users to:

- create game sessions as the host
- read sessions by Game ID
- join by updating player state
- write player messages
- let only the host write storyteller/system/error messages

Deploy them with:

```bash
firebase login
firebase use matts-husky-game
firebase deploy --only firestore:rules
```

After deploy, test: create game, join from another browser/device, select different characters, send an action, roll D20, reload, then continue the saved session.
