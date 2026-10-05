# Voice Room Seat Synchronization & Artifacts Delivery Plan

Resolve user seat duplication and state desynchronization when re-entering the room after exit or minimize, and deliver pristine full-length artifacts for the complete voice room and session services.

## User Review & Critical Decisions

> [!IMPORTANT]
> The following decisions were confirmed based on your input:
> - **Code Delivery Method**: Complete, unshortened source code files will be generated as dedicated downloadable artifacts to allow thorough manual review and testing without truncation.
> - **Primary Bug Scenario**: Re-entering the voice room after exiting or minimizing, which causes the user avatar and name to duplicate across seats or ghost on previously occupied slots.

- **Confirmed Decision 1**: Export all 4 requested core files (`VoiceRoomScreen.tsx`, `RoomModalManager.tsx`, `roomSessionService.ts`, and `roomThemeFirestoreService.ts`) as full-length artifacts.
- **Confirmed Decision 2**: Implement atomic seat release and strict deduplication in both local memory and Firestore on exit/minimize to prevent duplicate seat ghosts.

---

## 1. Overview & Core Concept

- **What It Does**: Ensures that any user occupying a mic seat in a voice room has exactly one authoritative seat at any given moment. When minimizing, exiting, or rejoining, old seat allocations are reliably vacated in real time in both the local state and cloud persistence layer (Firestore).
- **Target Audience / Persona**: Room hosts, moderators, speakers, and audience members who frequently minimize rooms to browse the app or exit and rejoin without experiencing ghosting or duplicate seats.
- **Key Value**: 100% deterministic microphone and seat occupancy without duplicate avatars, broken counters, or sync latency loops.

---

## 2. User Experience & Visual Design

- **Key User Flows**:
  1. *Room Minimize & Restore Flow*:
     - User is speaking on Mic #3.
     - User clicks "احتفاظ" (Keep in background / Minimize).
     - Global circular floating pill appears with active audio indicator.
     - User taps floating pill to expand back into room: The user seamlessly remains on Mic #3 without ghost copies or duplicate entries on other mics.
  2. *Room Exit & Re-Entry Flow*:
     - User leaves room completely via "خروج".
     - All Firestore seat documents for this user are synchronously cleared/vacated.
     - User clicks the room card from the lobby to rejoin: Room initializes cleanly with the user in the audience, ready to take an empty seat without lingering on the old seat.
  3. *Direct Seat Switching Flow*:
     - User jumps from Mic #2 to Mic #5: Old mic #2 clears instantaneously, counter transfers cleanly, and no intermediate ghost state is rendered.

- **Visual Identity & Theme**:
  - Maintains the existing luxury Super Legend royal dark neon theme (`#0B0F19`, `#1A2234`, `#F59E0B`, `#EC4899`).
  - Seat states clearly show live status (speaking pulse, admin mute lock, host crown badge, VIP aura).

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Dual-Layer Vacate on Exit and Minimize**
  - *Chosen Approach*: Execute deterministic seat vacating on both the component lifecycle unmount / exit handler and via a dedicated before-unload / route listener.
  - *Why*: Prevents stale presence records in Firestore when network lag or rapid UI navigation occurs.
  - *Alternatives Considered*: Relying solely on client unmount callbacks, which fail if the component re-renders or unmounts abruptly.

- **Decision 2: Global User-Centric Seat Deduplication Filter**
  - *Chosen Approach*: Enforce a strict single-seat rule in `allMicSeats` state mapping: if any seat matches `userId`, `userName`, or current user identity, all other seats with the same identity are vacated immediately, regardless of Firestore batch ordering.
  - *Why*: Eliminates race conditions where Firestore snapshot delivery lags behind local optimistic state updates.

- **Decision 3: Complete Artifacts Export**
  - *Chosen Approach*: Write each file completely into `/.aistudio/artifacts/brain/b0930b00-6fa0-4271-bcbd-a20d8c71916e/` so the full 6,350+ lines of `VoiceRoomScreen.tsx` and 1,800+ lines of `RoomModalManager.tsx` are accessible intact.
  - *Why*: Bypasses chat token limits and delivers 100% complete, unclipped production code.

---

## 4. Technical Architecture & Data Strategy

### System Architecture & State Synchronization Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      Voice Room Client                      │
│                                                             │
│   ┌──────────────────────┐       ┌──────────────────────┐   │
│   │  VoiceRoomScreen     │ ────> │   RoomModalManager   │   │
│   │  (Active Mic Grid)   │       │   (Action Modals)    │   │
│   └──────────┬───────────┘       └──────────────────────┘   │
│              │                                              │
│              ▼                                              │
│   ┌──────────────────────────────────────────────────────┐  │
│   │           Unified Deduplication Interceptor          │  │
│   │      (Enforces max 1 seat per unique user)           │  │
│   └──────────────────────┬───────────────────────────────┘  │
└──────────────────────────┼──────────────────────────────────┘
                           │
             Real-time Sync & State Handlers
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                  Persistence & Audio Engines                │
│                                                             │
│  ┌───────────────────────┐       ┌───────────────────────┐  │
│  │  roomRealtimeService  │       │   roomSessionService  │  │
│  │  (Firestore Seats/PK) │       │   (Global App State)  │  │
│  └───────────┬───────────┘       └───────────────────────┘  │
│              │                                              │
│              ▼                                              │
│  ┌───────────────────────┐                                  │
│  │   Cloud Firestore     │                                  │
│  │   /rooms/{id}/seats   │                                  │
│  └───────────────────────┘                                  │
└─────────────────────────────────────────────────────────────┘
```

### Data Model & State Mutators

1. **`vacateRoomSeatInFirestore`**:
   - Cleans both `seat_${seatId}` and standard `${seatId}` documents to maintain consistent document IDs.
2. **`subscribeToRoomSeats`**:
   - Deduplicates incoming snapshots so that if a user ID appears on more than one seat, only the most recently updated seat is retained.
3. **`handleSoloExit` & `handleKeepInBackground`**:
   - Synchronously dispatches seat vacancy before terminating or minimizing the session.
