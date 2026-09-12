# Aura Social Profile — Brief C Final Project

An accessible, responsive rebuild of **ONE** feature of Instagram: **The Instagram Profile Page**.

---

## Original vs Rebuilt Feature

### 1. Original Product: Instagram
The original Instagram is a massive, multi-faceted social network encompassing algorithmic discovery feeds, short-form video feeds (Reels tab), ephemerality tools (Story camera, AR filters), real-time messaging with WebRTC video calling, creator monetisation, e-commerce shops, algorithmic advertising, and complex multi-account management.

### 2. Rebuilt Feature: The Profile Page
This project isolates and rebuilds the **Instagram Profile Page** feature as a standalone, production-ready, highly accessible web experience.

**What is included:**
- **Profile Header**: Avatar with active story indicators, verified status badge, display name, category indicator, multi-line bio with interactive hashtag/mention styling, external link with copy/visit triggers, followers count, following count, and post count.
- **Profile Actions**: Functional Follow/Following toggle (with live counter update & screen-reader feedback), Direct Message trigger dialog, and Options menu (Share, QR code, Copy Link).
- **Story Highlights Carousel**: Interactive highlight covers with keyboard-scrollable carousel and full modal story viewer with timer progress bar.
- **Profile Navigation Tabs**: Accessible tablist with `role="tablist"` / `role="tab"` (`Posts`, `Reels`, `Tagged`, `Saved`).
- **Responsive Media Grid**: 3-column desktop/tablet layout adapting seamlessly to single/dual column down to 320px mobile screens without horizontal scroll. Includes hover & focus overlays displaying like and comment metrics, plus badges for carousels, reels, and pinned posts.
- **Accessible Post Modal Dialog**:
  - Full keyboard focus trap (tabbing stays inside the modal).
  - Strict focus restoration (focus returns to the triggering post card on close).
  - `Escape` key close listener and backdrop click dismiss.
  - Interactive Like & Bookmark toggle with floating heart animation.
  - Live local commenting system with likeable comments and timestamps.
  - Previous/Next post navigation with keyboard arrow keys (`ArrowLeft`, `ArrowRight`).
- **Top Navigation & Search**: Clean search bar that filters posts by caption or hashtag in real time, brand header, and quick action shortcuts.
- **Reviewer State Switcher**: A dedicated live testing toolbar allowing reviewers to toggle between **Success**, **Loading Skeleton**, **Error 500 ("Unable to load profile")**, and **Empty Posts State** on demand without editing any source code.

---

### 3. What Parts of Instagram Were Intentionally NOT Implemented and Why
To preserve scope discipline and ensure maximum depth and accessibility on the single profile feature:
1. **Global Explore Algorithmic Feed**: Out of scope for a profile page; omitted to focus purely on creator representation.
2. **Story Camera & AR Filter Engine**: Browser WebGL camera filter authoring is a separate product surface from profile viewing.
3. **End-to-End Encrypted Messenger / WebRTC Video Calls**: While a quick direct message trigger modal is provided to satisfy the profile "Message" action, full peer-to-peer real-time call infrastructure was omitted.
4. **Ad Engine & E-Commerce Checkout**: Omitted to keep the profile experience fast, privacy-focused, and free of clutter.

---

### 4. How This Version Is Better Than the Original (Accessibility & Usability)
1. **WCAG 2.1 AA Compliant Modal Focus Management**:
   - In Instagram's web app, opening and closing a post often drops focus to the top of the `<body>` or misaligns virtual scroll positions.
   - **Our rebuild** implements an airtight focus trap (`tabIndex` cycling) and guarantees **exact focus restoration** to the triggering post thumbnail button upon dismissal with `Escape` or clicking close.
2. **Screen Reader Live Announcements (`aria-live="polite"`)**:
   - Like, save, follow, tab changes, and modal states are announced via a dedicated live status region so non-sighted users receive immediate feedback without invasive page reloads.
3. **Transparent State Demonstration for Audits**:
   - Reviewers can test loading skeletons, error boundaries, empty states, and alternate creator profiles in one click via the top Reviewer Bar.
4. **Reduced-Motion Respect (`prefers-reduced-motion`)**:
   - All animations (story progress bars, floating like hearts, skeleton pulses) gracefully disable or switch to instant transitions when requested by user OS preferences.
5. **No Clutter & High-Contrast Visual Identity**:
   - Built on a modern slate/zinc dark aesthetic with distinct focus rings (`focus-visible:ring-2 focus-visible:ring-offset-2`) ensuring 4.5:1+ text contrast and clear visual tracking for keyboard power-users.

---

## How to Run Locally

```bash
# 1. Clone the repository / open the directory
cd aura-social-profile

# 2. Install dependencies
npm install

# 3. Run the development server
npm run dev

# 4. Open http://localhost:3000 in your browser
```

To build for production:
```bash
npm run build
npm run preview
```

---

## Project Architecture

```
/
├── README.md                     # Brief C documentation and comparison
├── metadata.json                 # AI Studio metadata
├── index.html                    # Entry point with meta tags & fonts
├── src/
│   ├── types.ts                  # TypeScript types (Profile, Post, Comment, States)
│   ├── main.tsx                  # React 19 root
│   ├── App.tsx                   # Main container with state switcher & router
│   ├── index.css                 # Tailwind CSS 4 setup & custom utilities
│   ├── data/
│   │   └── mockProfiles.ts       # Rich mock profiles (Photography, Street Art, Empty)
│   ├── components/
│   │   ├── Navbar.tsx            # Accessible top navigation & search
│   │   ├── ReviewerToolbar.tsx   # Reviewer state switcher (Loading/Error/Empty/Success)
│   │   ├── ProfileHeader.tsx     # Profile avatar, stats, bio, actions & highlights
│   │   ├── ProfileNavTabs.tsx    # WAI-ARIA tablist (Posts, Reels, Tagged, Saved)
│   │   ├── PostGrid.tsx          # Responsive 3-column media grid & hover overlays
│   │   ├── PostModal.tsx         # Accessible post dialog with focus trap & comments
│   │   ├── StoryModal.tsx        # Story highlight viewer with progress bars
│   │   ├── FollowersModal.tsx    # Interactive follower list with follow toggles
│   │   ├── DirectMessageModal.tsx# Direct message composer modal
│   │   ├── OptionsMenu.tsx       # Profile options menu dialog
│   │   ├── SkeletonProfile.tsx   # Pixel-accurate skeleton loader
│   │   ├── ErrorView.tsx         # "Unable to load profile" state with Try Again
│   │   ├── EmptyState.tsx        # Empty grid illustration and action prompt
│   │   ├── DocumentationModal.tsx# In-app Brief C interactive documentation viewer
│   │   └── ScreenReaderAnnouncer.tsx # Dedicated aria-live politeness region
```

---

## Accessibility Decisions (A11y)

| Requirement | Implementation Detail |
|---|---|
| **Keyboard Navigation** | Every interactive element is reachable via `Tab`/`Shift+Tab` and triggerable via `Enter`/`Space`. |
| **Focus Rings** | Prominent, high-contrast rings using `focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950`. |
| **Modal Focus Trap** | Captures keyboard focus in a circular loop inside `PostModal`, `StoryModal`, and `FollowersModal`. |
| **Focus Restoration** | Stores `triggerRef.current` and triggers `.focus()` automatically when modal is closed. |
| **Escape Key** | Global keyboard listener closes any active modal or menu cleanly. |
| **ARIA Semantics** | `role="dialog"`, `aria-modal="true"`, `role="tablist"`, `role="tab"`, `aria-selected`, `aria-expanded`, `aria-controls`. |
| **Live Announcements** | `aria-live="polite"` region alerts screen readers when posts are liked/saved, users are followed, or errors occur. |
| **Motion Accessibility** | `motion-reduce:transition-none` and `motion-reduce:animate-none` applied. |

---

## How a Reviewer Can Demonstrate Every State (Without Editing Code)

1. **Success State (Normal)**:
   - Click **"Success State"** in the top Reviewer Bar.
   - Browse the rich 12-post photography grid for `@elena.rosh`.
   - Click any post to test the modal, double-click image to like, submit comments, or press `ArrowLeft`/`ArrowRight` to cycle posts.
   - Click the story avatar ring or any highlight circle to open the Story Player.
   - Click Followers/Following numbers to view the accounts list.

2. **Loading / Skeleton State**:
   - Click **"Skeleton Loading"** in the Reviewer Bar (or click the Refresh button).
   - Observe the pulsating skeleton layout for avatar, bio lines, stat pills, highlights, and grid squares.

3. **Error State ("Unable to load profile")**:
   - Click **"Error State"** in the Reviewer Bar.
   - See the accessible error alert banner and the "Unable to load profile" card.
   - Click **"Try again"** to automatically recover and reload the profile data.

4. **Empty Posts State**:
   - Click **"Empty State"** in the Reviewer Bar (or switch to the demo profile `@new_creator`).
   - Observe the clean camera empty-state illustration, headline, and "Share your first photo" button.

5. **A11y Focus Inspector Mode**:
   - Toggle **"A11y Rings"** in the Reviewer Bar to highlight all focusable DOM elements with a bright focus outline.
   - View live screen-reader announcements in the bottom-right status log.

6. **In-App Project Guide**:
   - Click **"Brief C Project Guide"** in the top navigation or reviewer bar to read this documentation directly inside the application interface.
