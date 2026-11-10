# UX principles (Linear / Apple bar)

Check every component, demo and page against these before showing it. Fix what fails; don't explain it away.

## Clarity

- **One job per component.** If the API needs a boolean to switch between two behaviours, it is probably two components or a variant.
- **One primary action per view.** In a demo, a dialog footer or a page section, only one filled button. Secondary actions are outline or ghost.
- **Hierarchy by type and space.** Weight, size and muted text order content; borders and color come last.
- **Honest states.** Empty keeps its frame and offers the next step. Loading keeps the size of the content it replaces. Errors say what happened and how to recover.

## Speed

- **Feels instant.** Press feedback on the first frame (`tap` from `lib/motion`), no layout shift when content arrives.
- **Keyboard first.** Escape closes, Enter submits, arrows move through lists, Home and End jump, Tab leaves composite widgets in one stop. Focus is always visible and lands where the next action is.
- **Undo over confirm.** Alert Dialog only for what cannot come back.

## Feel

- **Motion explains a change.** Springs from `lib/motion`, origin toward the trigger, exits faster than entries, reduced motion swaps to a fade.
- **Direct manipulation.** Things look like what they do: draggable thumbs show it, rows that open are fully clickable, editable fields reveal themselves on focus.
- **Precise details.** Tabular numbers, aligned baselines, truncation with the full value available, hit targets of 32px on desk and 44px on touch.
- **Every direction.** Works in RTL with the same markup; arrows flip in horizontal widgets.

## Consistency

- Same behaviour and same prop names as the closest existing component (Select and Combobox share `value`, `onValueChange`, `open`, `onOpenChange`, `name`, `required`).
- Same words across components and docs: the guidelines pages define them.

## Review before showing

1. What is the one job, and is it obvious in the default demo?
2. Is there exactly one primary action?
3. Does it work with keyboard only, with a screen reader name on every control?
4. Are default, hover, focus, pressed, disabled, loading, empty, error and invalid designed?
5. Does it hold at 390, in dark, in Spanish and in RTL?
6. Would it sit naturally next to Select, Dialog and Tabs?
