"use strict";

// The deferred script runs after the HTML is parsed. Each feature uses listeners
// rather than inline handlers, and the original CV remains readable without JS.

// Option 3: switch themes and remember a choice when storage is available.
const themeButton = document.querySelector("#theme-toggle");
const themeColor = document.querySelector('meta[name="theme-color"]');
let savedTheme = "light";
try {
  savedTheme = localStorage.getItem("cv-theme") === "dark" ? "dark" : "light";
} catch {
  // A browser may block storage; the toggle still works for the current visit.
}

function applyTheme(theme) {
  const isDark = theme === "dark";
  document.documentElement.dataset.theme = theme;
  themeButton.setAttribute("aria-pressed", String(isDark));
  themeButton.textContent = isDark ? "Light mode" : "Dark mode";
  themeColor.setAttribute("content", isDark ? "#0b1321" : "#4169e1");
}

applyTheme(savedTheme);
themeButton.hidden = false;
themeButton.addEventListener("click", () => {
  const theme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  applyTheme(theme);
  try {
    localStorage.setItem("cv-theme", theme);
  } catch {
    // Storage is optional, so its failure must not interrupt other features.
  }
});

// Option 5: show a non-blocking welcome message when the page loads.
const welcomeBanner = document.querySelector("#welcome-banner");
document.querySelector("#welcome-message").textContent =
  "Welcome to my portfolio! Explore my work and get to know me.";
welcomeBanner.hidden = false;
document.querySelector("#dismiss-welcome").addEventListener("click", () => {
  welcomeBanner.hidden = true;
  document.querySelector(".hero-actions a").focus({ preventScroll: true });
});

// Options 2 and 6: keep expanded state, labels, and visibility in sync.
function setExpanded(button, expanded) {
  // Contact has separate links and form panels; aria-controls can name both.
  const panelIds = button.getAttribute("aria-controls").split(/\s+/);
  panelIds.forEach((id) => {
    document.getElementById(id).hidden = !expanded;
  });
  button.setAttribute("aria-expanded", String(expanded));
  button.textContent = `${expanded ? "Hide" : "Show"} ${button.dataset.label}`;
  if (button.classList.contains("section-toggle")) {
    button.closest("section").classList.toggle("is-collapsed", !expanded);
  }
}

document.querySelectorAll(".section-toggle, .detail-toggle").forEach((button) => {
  button.hidden = false;
  // CV sections start visible; individual project details start collapsed.
  setExpanded(button, !button.classList.contains("detail-toggle"));
  button.addEventListener("click", () => {
    setExpanded(button, button.getAttribute("aria-expanded") !== "true");
  });
});

// Option 4: add skills safely as text, rejecting blanks and duplicates.
const skillForm = document.querySelector("#skill-form");
const skillInput = document.querySelector("#new-skill");
const skillFeedback = document.querySelector("#skill-feedback");
const addedSkills = document.querySelector("#added-skills");
const skillNames = new Set(
  Array.from(document.querySelectorAll(".skill-group p"))
    .flatMap((paragraph) => paragraph.textContent.split("·"))
    .map((skill) => skill.trim().toLocaleLowerCase())
);
document.querySelector(".skill-playground").hidden = false;

skillForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const skill = skillInput.value.trim().replace(/\s+/g, " ");
  let error = "";
  if (!skill) error = "Enter a skill before adding it.";
  else if (skill.length > 60) error = "Keep the skill name to 60 characters or fewer.";
  else if (skillNames.has(skill.toLocaleLowerCase())) error = "That skill is already listed.";

  skillInput.setAttribute("aria-invalid", String(Boolean(error)));
  skillFeedback.classList.toggle("is-error", Boolean(error));
  if (error) {
    skillFeedback.textContent = error;
    skillInput.focus();
    return;
  }

  const item = document.createElement("span");
  item.className = "added-skill";
  // textContent displays user input literally, preventing HTML injection.
  item.textContent = skill;
  if (addedSkills.childElementCount > 0) {
    addedSkills.append(document.createTextNode(" · "));
  }
  addedSkills.append(item);
  document.querySelector("#additional-skills").hidden = false;
  skillNames.add(skill.toLocaleLowerCase());
  skillFeedback.textContent = `${skill} added to the skills list.`;
  skillInput.value = "";
  skillInput.focus();
});

skillInput.addEventListener("input", () => {
  skillInput.removeAttribute("aria-invalid");
  skillFeedback.textContent = "";
  skillFeedback.classList.remove("is-error");
});

// Option 1: validate required values and email format with per-field feedback.
const contactForm = document.querySelector("#contact-form");
const contactFeedback = document.querySelector("#contact-feedback");
const contactFields = [
  document.querySelector("#contact-name"),
  document.querySelector("#contact-email"),
  document.querySelector("#contact-message"),
];
let contactAttempted = false;
contactForm.hidden = false;

function validateField(field) {
  const value = field.value.trim();
  const errorElement = document.getElementById(`${field.name}-error`);
  let error = "";
  if (!value) {
    error = `Please enter your ${field.name}.`;
  } else if (field.name === "email" &&
    (field.validity.typeMismatch || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))) {
    error = "Enter a valid email address, such as name@example.com.";
  }
  field.setAttribute("aria-invalid", String(Boolean(error)));
  errorElement.textContent = error;
  return !error;
}

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  contactAttempted = true;
  const results = contactFields.map(validateField);
  const valid = results.every(Boolean);
  contactFeedback.classList.toggle("is-error", !valid);
  if (!valid) {
    contactFeedback.textContent = "Please correct the highlighted fields and check your message again.";
    contactFields[results.indexOf(false)].focus();
    return;
  }
  contactFeedback.textContent =
    `Thanks, ${contactFields[0].value.trim()}! Your details have been verified successfully.`;
});

contactFields.forEach((field) => {
  field.addEventListener("input", () => {
    contactFeedback.textContent = "";
    contactFeedback.classList.remove("is-error");
    if (contactAttempted) validateField(field);
  });
});
