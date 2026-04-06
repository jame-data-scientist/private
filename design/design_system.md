# Design System Specification: Cyber-Tactical Encryption

## 1. Overview & Creative North Star
**Creative North Star: "The Neon Bastion"**

This design system moves beyond the "gamer" trope of cluttered interfaces and aggressive neon. Instead, it adopts a philosophy of **Cyber-Tactical Precision**. We are building a digital vault—a space that feels surgically clean, impenetrably secure, and technologically superior. 

By utilizing intentional asymmetry, we break the "bootstrap" grid. Large, aggressive headlines are juxtaposed against microscopic, high-density data labels. The interface should feel like a high-end heads-up display (HUD) where the depth is not created by physical shadows, but by light emission and atmospheric "fog" (tonal layering). We prioritize "Negative Space as Security," giving encrypted messages room to breathe to emphasize their importance.

---

## 2. Colors & Surface Architecture

The palette is rooted in the "Deep Black" spectrum, moving away from flat neutrals into high-contrast luminous accents.

### Surface Hierarchy & Nesting
We achieve structure through **Luminance Steps**, not lines. 
- **Base Layer:** Use `surface_container_lowest` (#0e0e10) for the primary application canvas.
- **Primary Containers:** Use `surface_container` (#201f21) for the main chat feed.
- **Elevated Inputs:** Use `surface_container_highest` (#353437) for active input areas.

**The "No-Line" Rule:** 1px solid borders are strictly prohibited for layout sectioning. To separate a sidebar from a chat window, use a shift from `surface` to `surface_container_low`. The eye should perceive a change in "density" rather than a hard edge.

**The "Glass & Gradient" Rule:** Floating elements (modals, tooltips) must use `surface_variant` with a 60% opacity and a `backdrop-filter: blur(12px)`. To provide "visual soul," primary actions should utilize a linear gradient from `primary_container` (#00f5ff) to `secondary_container` (#641fac) at a 135-degree angle.

---

## 3. Typography

The typography scale balances the brutalist, geometric nature of `Space Grotesk` (our high-tech surrogate for Orbitron) with the hyper-legibility of `Inter`.

- **Display & Headlines (Space Grotesk):** These are your "HUD" elements. Use `display-lg` for landing moments and `headline-sm` for chat headers. Letter spacing should be set to `-0.02em` for headlines to feel "tight" and engineered.
- **Body & Chat (Inter):** All encrypted communication happens in `body-lg`. It is clean, humanist, and provides a necessary contrast to the technical headers.
- **Labels (Inter):** Use `label-sm` in all-caps with `+0.05em` letter spacing for metadata (timestamps, encryption keys, "Seen" statuses). This mimics the aesthetic of technical schematics.

---

## 4. Elevation & Depth

In a dark gamer aesthetic, traditional "drop shadows" are invisible. We use **Photonic Depth**.

- **The Layering Principle:** Stacking order is vital. A `surface_container_high` card sitting on a `surface_dim` background creates a natural lift.
- **Ambient Glows:** For "floating" items like active FABs or notifications, replace shadows with a `box-shadow` using the `primary_fixed` color (#63f7ff) at 10% opacity with a 20px blur. This creates an "inner light" effect.
- **The "Ghost Border" Fallback:** Where interactive boundaries are required (e.g., input focus), use the `outline_variant` token at 20% opacity. This "Ghost Border" provides a hint of structure without breaking the seamless darkness.
- **Interaction Shimmer:** When hovering over interactive surfaces, apply a subtle 2% increase in luminance to the background color.

---

## 5. Components

### Buttons
- **Primary:** Gradient fill (`primary_container` to `secondary_container`). No border. `label-md` text in `on_primary_fixed` (#002021).
- **Secondary:** `surface_container_highest` fill with a `primary` "Ghost Border" (20% opacity).
- **Tertiary:** No fill. `primary` text. High-density padding.

### Input Fields
- **Default State:** `surface_container_highest` background. No border. Bottom-aligned `label-sm` for the "HUD" feel.
- **Focus State:** 1px "Ghost Border" using `primary`. A subtle 4px outer glow of `primary_fixed` at 15% opacity.

### Cards & Lists
- **No Dividers:** Lists (like message threads) must never use horizontal lines. Use a `12px` vertical gap between message clusters.
- **Active State:** Instead of a border, an active chat item in the sidebar should use a `secondary_container` (#641fac) background at 20% opacity with a 2px vertical "accent bar" of `primary` on the left edge.

### Additional: The "Encryption Badge"
- A signature component for this app. A small, `surface_container_highest` pill containing the `primary` "Locked" icon and the `label-sm` text "ENCRYPTED". It should have a backdrop-blur and a 10% `primary` glow.

---

## 6. Do's and Don'ts

### Do:
- **Use Asymmetry:** Place metadata (time/status) in unexpected corners to evoke a custom-built feel.
- **Lean into Blur:** Use frosted glass for any element that sits "above" the main content.
- **Color Coding:** Use `secondary` (Purple) for "System" or "AI" messages and `primary` (Cyan) for "User" actions.

### Don't:
- **Don't use Pure White:** Use `on_surface_variant` (#b9caca) for secondary text to avoid retina fatigue.
- **Don't use Heavy Borders:** A 100% opaque border is a failure of the "Neon Bastion" philosophy.
- **Don't Over-Glow:** If everything glows, nothing is important. Reserve glows for active states and critical alerts.
- **Don't Use Dividers:** If you feel the need for a line, use a 16px space instead. Space is the ultimate separator in high-end design.
