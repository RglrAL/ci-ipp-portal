# Your International Protection Guide: navigation handover

## What this is
A working prototype of the portal navigation: one hamburger button, a slide in
panel, and a three level expandable sitemap (section, then category, then
content page). This note explains how to rebuild it in Wagtail simply and
generically. The prototype itself is the reference for look and behaviour.

## Core principle: the menu is the page tree
Do not hard code the menu. In Wagtail the portal pages already form a tree:

```
Portal landing page
  Section            (child page)
    Category         (grandchild page)
      Content page   (great grandchild page)
```

Render the menu by walking that tree from the portal landing page, including
only pages that have "show in menus" ticked. Add a page in Wagtail and it
appears in the menu. There is no separate data to edit, and it works for any
number of items at any depth.

## Three independent layers
1. Data: the Wagtail page tree. Nothing extra to maintain.
2. Markup and CSS: server rendered HTML using the class names below, styled by
   `portal_menu.css` in this folder (a self contained copy of the navigation
   styles). Copy this part as is.
3. JavaScript: a small enhancement that opens and closes the panel and toggles
   each group. The links and the structure work without it.

## Recommended build
Pick whichever suits the existing codebase.

* If the team already uses **wagtailmenus**: build on it and override its menu
  and sub menu templates so they output the markup below. It supports nested
  children, a maximum level setting, and custom links for non page items such as
  About, Glossary and Videos.
* If not: use **Wagtail core**. A short recursive template walks
  `page.get_children.live.in_menu` and includes itself for children. See
  `portal_menu.html` and `menu_node.html` in this folder. Set the depth to 3.

Either way the interactive behaviour is plain front end (`portal_menu.js`). It
is not part of wagtailmenus. Before adding our script, check whether
citizensinformation.ie already has a menu or disclosure script to reuse.

## Markup and class contract
The CSS keys off this structure and these class names. Keep them.

```html
<ul class="portal-menu-list">
  <!-- expandable item (has children) -->
  <li class="portal-menu-group level-1">
    <div class="portal-menu-row">
      <a class="portal-menu-cat" href="...">Section title</a>
      <button class="portal-menu-expand" aria-expanded="false"
              aria-controls="portal-sub-12" aria-label="Show Section title">
        <span></span>
      </button>
    </div>
    <ul id="portal-sub-12" class="portal-menu-sub" hidden>
      ... nested groups or leaves, level increases ...
    </ul>
  </li>

  <!-- leaf item (a real content page) -->
  <li class="portal-menu-leaf level-3">
    <a class="portal-menu-sublink" href="...">Page title</a>
  </li>
</ul>
```

Notes:
* An expandable item is a group with a row: a link plus a button. The link
  navigates to the landing page, the button toggles the children.
* A leaf is a single link.
* `level-1`, `level-2`, `level-3` drive the indentation and styling.
* The button must be a real `button` with `aria-expanded`, and `aria-controls`
  pointing at the id of its child list.

## Behaviour
* One hamburger opens a panel that slides in from the left, with a dark overlay.
* Sections and categories expand in place. Content pages are links.
* Optional: one section open at a time (a marked block in `portal_menu.js`).
  Delete that block to let everything toggle freely.
* Close on the close button, the overlay, or the Escape key.
* Breakpoints: phone at 768px and below, tablet at 1080px and below. On phones
  the search bar is full width and sits above the breadcrumb, the language
  selector moves to its own row below the bar, the logo and title grow, and the
  cards stack to one column.

## Accessibility (keep these when you rebuild)
Already handled in the prototype:
* Real buttons with `aria-expanded` and `aria-controls`.
* Skip to content link, `aria-current` on breadcrumbs, labels on the icon
  buttons and the language selector, alt text on images, decorative icons
  hidden from assistive technology.
* The closed panel is removed from the tab order and from assistive technology
  (visibility hidden), so focus cannot land on off screen links.
* Focus moves into the panel on open and back to the hamburger on close.
* Focus is trapped inside the panel while it is open (see `portal_menu.js`), so
  keyboard focus cannot drift to the page behind the overlay.
* Search button uses the brand green for safe contrast.

Still to do in the real build:
* Test before sign off: automated (axe or Lighthouse), keyboard only, a screen
  reader (NVDA or VoiceOver), and zoom from 200% to 400%.
  citizensinformation.ie must meet WCAG 2.1 AA.

## Placeholder versus real
* The three levels and the full page list are the real structure from the
  content layout sheet.
* All body copy, hero blurbs, content page bodies and hero images are
  placeholders.
* The language selector currently logs the chosen language only. Real
  translation routing is a separate task.

## Files in this handover
* `NAVIGATION_HANDOVER.md`: this note.
* `portal_menu.html`: top level Wagtail template (bar plus panel).
* `menu_node.html`: the recursive node partial.
* `portal_menu.css`: the navigation styles, self contained.
* `portal_menu.js`: minimal, accessible open, close and expand behaviour.
* The live prototype: the visual reference for the wider page styles (heroes,
  cards, page lists). Those rules live in the prototype's `css/styles.css`.
