# pg-manager-restaurant
PG Manager Restaurant - Daily Operations

## Publishing updates

The Android installation checks for service-worker updates on startup, when the app returns to the foreground, when connectivity returns, and hourly while open. Updates wait for the user to select **Atualizar agora**; **Depois** keeps the current version. The app saves the current report before activating the waiting worker and reloading. Local storage and the Outlook `mailto:` flow are preserved.

For every release, update the displayed version in `index.html` and the versioned `CACHE` name in `sw.js`. Publish both files together. Keep the manifest identity and Restaurant local-storage keys unchanged so existing installations retain their data. Verify an upgrade between two versions, deferred activation, draft/settings persistence, and offline loading before publishing. The first upgrade from a version without this notice uses the previous update behavior; later upgrades show the notice.
