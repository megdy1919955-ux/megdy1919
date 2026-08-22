# Security Specification & Invariants

## Data Invariants
1. **Room Identity & Path Invariant**: Every room document stored at `/rooms/{roomId}` must have `roomId == roomId` path parameter, matching regex `^[a-zA-Z0-9_\-]+$`.
2. **Owner-Only Mutation Invariant**: Only the room owner (matching `ownerId`) can create, update, or modify the room theme and wallpaper. Non-owners or guests cannot mutate room settings.
3. **Public Read Invariant**: Any visitor/participant in the room can read the room's theme and wallpaper document to render the synchronized background, mics, and lighting in real time.
4. **Data Integrity Invariant**: All required fields (`roomId`, `ownerId`, `wallpaperUrl`) must be validated against type and maximum length limits.

## The Dirty Dozen Payloads (Rejection Matrix)
1. **Unauthenticated Write**: An unauthenticated user attempts to write a new room theme -> **DENIED**.
2. **Non-Owner Overwrite**: User B attempts to overwrite User A's room theme document -> **DENIED**.
3. **Path Injection Attack**: An attacker attempts to use a 2KB junk character string as roomId -> **DENIED** via `isValidId()`.
4. **Empty Wallpaper URL**: Payload missing `wallpaperUrl` or with empty string -> **DENIED**.
5. **Junk Ghost Fields Attack**: Payload with shadow admin elevation fields -> **DENIED**.
6. **Owner Spoofing on Update**: Non-owner attempts to reassign `ownerId` to hijack room -> **DENIED**.
7. **Oversized Wallpaper URL**: Payload with > 2048 characters URL -> **DENIED**.
8. **Malicious Theme Config Payload**: Injected script string into theme configuration -> **DENIED**.
9. **Creation with Mismatched Path ID**: `incoming().roomId != roomId` -> **DENIED**.
10. **Immutable Owner ID Violation**: Update where `incoming().ownerId != existing().ownerId` -> **DENIED**.
11. **Blanket Query Scraping**: Malicious unbounded search list query -> **DENIED**.
12. **Malformed Date-Time Attack**: Client submitting corrupted epoch data -> **DENIED**.
