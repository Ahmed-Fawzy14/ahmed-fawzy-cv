# Ahmed Fawzy Abdelkader - Assignment 2

An interactive extension of the Assignment 1 CV webpage, built with HTML, CSS,
and plain JavaScript. All original CV content and assets are retained.

## Run

Open `index.html` in a browser. No build step or package installation is needed.
The published site is https://ahmed-fawzy14.github.io/ahmed-fawzy-cv/.

## All six assignment features

1. **Contact form validation:** Name, email, and message are required. JavaScript
   checks trimmed values and email format, displays field errors, focuses the first
   invalid field, and gives success feedback. This is a local validation demo;
   it does not send or store messages. Existing contact links remain available.
2. **Show/hide sections:** All nine webpage sections have buttons with synchronized
   visibility, labels, and `aria-expanded` states. Every section starts expanded.
3. **Dark/light mode:** The header button switches themes and remembers the
   choice using localStorage. It also works if storage is blocked.
4. **Dynamic skills list:** The Skills section has an input and Add skill button.
   New entries appear immediately in an Additional Skills row that matches the
   original list, separated by middle dots. Empty values and duplicates are
   rejected. User input is added through textContent. Additions last for the visit.
5. **Welcome message:** JavaScript shows a dismissible inline greeting at load.
6. **Interactive projects:** Each of the five projects has a button to reveal
   its original description without reloading the page.

## Files

- `index.html` - original CV content and new interaction interfaces
- `styles.css` - original styling, responsive controls, dark theme, and print rules
- `script.js` - all six features, organized and commented by assignment option
- `images/` - profile photo and organization logos
- `assets/Ahmed_Fawzy_CV.pdf` - downloadable CV
- `link.txt` - published website URL

Buttons are keyboard accessible, status messages are announced to assistive
technology, and the original CV remains readable without JavaScript. Printing
reveals collapsed CV content and omits the interactive demo controls.
