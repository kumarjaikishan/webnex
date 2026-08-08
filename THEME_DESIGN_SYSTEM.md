# Webnex Labs — Design System & Theme Guidelines

This reference document defines the UI theme tokens, color palette, typography, glassmorphism rules, and component patterns for **Webnex Labs** to ensure 100% visual consistency across all pages and features.

---

## 🎨 Color Palette & Tokens

| Token Name | Hex Code | Purpose & Usage |
| :--- | :--- | :--- |
| **`void`** | `#06060B` | Deepest dark background (page body & primary background). |
| **`panel`** | `#101018` | Primary container background (cards, sidebars, modals). |
| **`panel2`** | `#15151F` | Secondary/nested panel background (table rows, active items). |
| **`edge`** | `#232333` | Subtle border color for containers, dividers, and inputs. |
| **`mist`** | `#9797AC` | Muted secondary text, labels, and metadata. |
| **`paper`** | `#F3F2FA` | Primary high-contrast headings & readable text. |
| **`violet`** | `#7C6CFB` | Primary brand accent, glowing highlights, selection backgrounds. |
| **`cyan`** | `#3FD6E0` | Secondary energetic cyan accent for badges, links, and status tags. |

---

## 🌌 Gradient Backgrounds

### 1. Primary Gradient (`bg-grad-primary`)
- **CSS**: `linear-gradient(90deg, #7C6CFB 0%, #3FD6E0 100%)`
- **Use Case**: Primary CTA buttons, gradient text titles (`bg-clip-text text-transparent`), active sidebar tabs.

### 2. Aurora Glow (`bg-aurora`)
- **CSS**: `radial-gradient(60% 60% at 20% 20%, rgba(124,108,251,0.25) 0%, rgba(6,6,11,0) 60%), radial-gradient(50% 50% at 85% 15%, rgba(63,214,224,0.18) 0%, rgba(6,6,11,0) 60%)`
- **Use Case**: Hero section background glow, high-impact CTA card backgrounds.

---

## 🔤 Typography & Fonts

| Type Family | CSS Class | Font Family | Recommended Usage |
| :--- | :--- | :--- | :--- |
| **Display** | `font-display` | `Space Grotesk`, sans-serif | Hero titles, page headings, section headers (`h1`, `h2`). |
| **Body** | `font-body` | `Inter`, sans-serif | Default body text, descriptions, paragraph text. |
| **Mono** | `font-mono` | `JetBrains Mono`, monospace | Currency values (`$1,500`), dates, tags, status codes, invoice numbers. |

---

## 🧩 Standard Component Patterns

### 1. Primary Button
```jsx
<button className="px-6 py-3 rounded-full bg-grad-primary text-void font-semibold hover:brightness-110 active:scale-[0.99] transition focus-ring">
  Action Label
</button>
```

### 2. Card Container
```jsx
<div className="bg-panel border border-edge rounded-2xl p-6 shadow-xl space-y-4">
  {/* Card Content */}
</div>
```

### 3. Text Inputs & Select Fields
```jsx
<input
  type="text"
  className="w-full rounded-xl bg-void border border-edge px-4 py-3 text-paper focus-ring outline-none transition placeholder:text-mist/50"
/>
```

### 4. Status Badges
- **Active / Paid / Success**: `bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono text-xs px-2.5 py-0.5 rounded-full`
- **Pending / Sent / Draft**: `bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono text-xs px-2.5 py-0.5 rounded-full`
- **Overdue / Error / Danger**: `bg-rose-500/10 text-rose-400 border border-rose-500/20 font-mono text-xs px-2.5 py-0.5 rounded-full`

### 5. Modals & Overlays
```jsx
<div className="fixed inset-0 z-50 bg-void/80 backdrop-blur-sm flex items-center justify-center p-4">
  <div className="bg-panel border border-edge rounded-2xl max-w-xl w-full p-6 text-paper">
    {/* Modal Body */}
  </div>
</div>
```

---

## ⚡ Form & Input Accessibility
- Always add `focus-ring` class to interactive buttons and inputs (`outline: 2px solid #7C6CFB`).
- Text selection highlight uses Webnex violet background (`#7C6CFB`) with dark `#06060B` text.
