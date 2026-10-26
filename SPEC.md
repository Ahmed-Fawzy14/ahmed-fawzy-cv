# Portfolio website specification

Version 1.1 · 26 October 2026 · Ahmed Fawzy Abdelkader

## Purpose and scope

Extend the Assignment 2 interactive CV into a multi-page personal portfolio that retains the original CV content and integrates four public APIs. Visitors can review Ahmed's background and projects, explore current data, and find contact details.

Assignment source: `../Design of Web-Based System_ Assignment 3-2.pdf`. The brief permits one or more APIs and either a single-page or multi-page site; this implementation uses six pages and four APIs. The stated deadline is 26 October 2026.

Live site: https://ahmed-fawzy14.github.io/ahmed-fawzy-cv/

## Information architecture

| Page | Content | Main actions |
| --- | --- | --- |
| `index.html` / Home | Original hero, portrait, profile, quote widget | Explore projects, download CV, dismiss greeting, request a quote |
| `experience.html` / Experience | Education, three internships, two leadership entries, achievements | Jump to sections; expand or collapse content |
| `projects.html` / Projects | Five original curated projects; up to 12 live GitHub repositories | Reveal project details, visit repositories, refresh live repositories |
| `skills.html` / Skills | Original four skill groups; additional skills | Add a skill with validation |
| `insights.html` / Insights | Current weather; recent technology stories | Choose city, choose news topic, refresh each independently |
| `contact.html` / Contact | Email, phone, LinkedIn, GitHub; validation form | Follow contact links, verify name/email/message |

The original nine CV sections remain present across these pages. All five curated projects, their descriptions, organization logos, portrait, and downloadable CV are retained. Assignment 2 source files are left intact.

## Shared navigation and visual design

- Every page has the same six navigation links, a home wordmark, a theme button, and a footer with Back to top.
- Exactly one primary link has `aria-current="page"` and a visible active pill. Contact has a prominent action style.
- On phones, navigation uses a three-column, two-row grid. Every primary link has a touch target at least 44px tall. All six links remain visible without a menu interaction.
- Longer pages have an On this page navigation: About/Quotes, Education/Experience/Leadership/Achievements, Selected projects/Live repositories, or Weather/News.
- Page titles and descriptions explain the content. Section labels are local to each page rather than continuing the old single-page numbering.
- The inherited blue palette, neutral surfaces, 1180px content width, rounded cards, and responsive typography remain consistent. Data cards add source labels, balanced spacing, hover/focus borders, and readable metadata.
- API cards use one column on small screens, two at medium widths, and three on larger screens.
- Light and dark themes support the same controls. The `cv-theme` localStorage preference persists across pages; storage failure does not prevent switching within a page.

## API contracts

All requests are browser-side HTTPS GET requests using `fetch` and `async/await`. No account setup, SDK, private token, or API key is required.

| Feature | Service and endpoint | Request | Required displayed data |
| --- | --- | --- | --- |
| Quotes | `https://dummyjson.com/quotes/random` | A new request on page load and New quote | `quote`, `author` |
| Weather | `https://api.open-meteo.com/v1/forecast` | Selected latitude/longitude; `current=temperature_2m,weather_code,is_day`; `timezone=auto` | City, rounded Celsius temperature, WMO-code condition, matching accessible icon, observation time and timezone |
| GitHub | `https://api.github.com/users/Ahmed-Fawzy14/repos` | `sort=updated`, `direction=desc`, `per_page=12`, `type=owner` | Name, description or explicit missing-description text, primary language or missing-language text, star count, repository link |
| News | `https://hn.algolia.com/api/v1/search_by_date` | Selected topic in `query`; `tags=story`; `hitsPerPage=9` | Headline, source hostname where available, date, points, original article link, discussion link |

Weather cities: Cairo, Alexandria, Dubai, London, New York. Cairo is the initial city. Open-Meteo weather codes map to clear sky, partly cloudy, overcast, fog, drizzle, rain, snow, or thunderstorm; unknown codes have an explicit unavailable condition and thermometer icon. Weather attribution and CC BY 4.0 links appear on the page.

News topics: Artificial intelligence (`artificial intelligence`), Software engineering (`software`), Cloud & DevOps (`cloud`), Cybersecurity (`security`). AI is the initial topic. These are keyword matches from technology-oriented Hacker News community submissions, ordered by submission date. They are not editorial category tags, a comprehensive news feed, or necessarily newly published articles. The interface identifies the source and filtering approach.

GitHub results are the latest 12 repositories, not a complete repository directory. The curated projects remain separate and available even if GitHub fails. Quotes are inspirational sample content provided by DummyJSON; the provider determines text and author attribution. A random request may return a previously seen quote.

Provider references: [DummyJSON](https://dummyjson.com/docs/quotes), [Open-Meteo](https://open-meteo.com/en/docs), [GitHub](https://docs.github.com/en/rest/repos/repos#list-repositories-for-a-user), [Algolia HN Search](https://hn.algolia.com/api).

## API interaction states

| State | Interface behavior |
| --- | --- |
| Initial request | Announce Loading, disable the widget's button and selector, set `aria-busy=true` |
| Successful response | Validate response shape, build content off the live DOM, replace results, announce completion, restore controls |
| Refresh in progress | Retain and dim prior results so content does not disappear; show loading text and disabled controls |
| HTTP failure | Show an error, restore controls, offer Retry; 403/429 responses mention service access/request limits |
| Network failure | Explain that the connection failed and offer Retry |
| Timeout | Abort after 15 seconds, explain the delay, offer Retry |
| Invalid response | Show readable invalid/unreadable-data feedback instead of partial results |
| Empty repository/news list | Announce no results; news suggests another topic |
| Failed refresh after success | Keep previously loaded results and explicitly state that older data is still shown |

Each widget owns its own request state. One failure does not prevent other widgets from working. Changing a selector starts a request immediately. Refresh is also available for the current selection. Selectors disable during requests, preventing overlapping changes and response races. Reloading a page resets city/topic selection to its default.

The original city/source labels remain attached to retained results, so a failed selection request does not relabel older data as the newly requested data. Data is not automatically polled or cached across page loads.

## Retained CV interactions

- Introduction, profile, education, experience, activities, projects, skills, achievements, and contact panels start expanded. Controls synchronize visibility, labels, and `aria-expanded`.
- Five project detail panels start collapsed when JavaScript runs. Without JavaScript their descriptions remain readable.
- The welcome message appears on Home and is dismissible. Dismissal returns keyboard focus to the first hero action.
- Skills reject blank values, duplicates (case-insensitive), and names over 60 characters. Whitespace is normalized; insertion uses text rather than HTML. Added skills are stored in sessionStorage and survive navigation in the same browser tab/session. If storage is unavailable, additions still work for the current page. The restore path accepts at most 100 valid entries.
- Contact requires trimmed name, email, and message, with field errors and focus on the first invalid input. Successful validation shows confirmation. This is a validation exercise and does not send or store messages; actual email/phone/social links remain available.

## Accessibility, resilience, and implementation

- Semantic headings, landmarks, labeled selectors/forms, visible keyboard focus, and a skip link that focuses `main`.
- Loading and result messages use polite live status regions; weather icons have text alternatives. Errors are communicated in text as well as color.
- Reduced-motion preference disables smooth scrolling and minimizes transitions. Print rules reveal collapsed CV content and hide interactive controls.
- Original content and primary navigation remain available without JavaScript. Live widgets explain that JavaScript is needed.
- Remote strings use `textContent`; external links accept only HTTP/HTTPS and use `noopener noreferrer` when opening a new tab. An invalid remote URL remains readable text without a clickable destination.
- HTML pages contain content directly. Shared `styles.css`, `script.js`, and `api.js` supply design and behavior; no framework, build system, backend, or frontend dependency is required.
- Provider outages, browser/network restrictions, and public API limits can affect live data. The UI surfaces failures rather than presenting fixtures as live results.
- Browser checks and visual review cover the scenarios below; this is not a formal WCAG certification or exhaustive compatibility audit.

## Assignment traceability

| PDF requirement | Implementation evidence | Verification |
| --- | --- | --- |
| Preserve Assignment 2 content | Nine original sections redistributed across six pages, original assets retained | Static DOM text comparison against Assignment 2, excluding revised section-number labels |
| Home/About, Skills, Projects, Contact | Dedicated pages and shared navigation | All six pages load with one main heading and one current primary link |
| At least one external API | Four independent providers | Controlled response tests and live browser requests |
| GitHub names, descriptions, stars/languages | Projects live repository cards | Fixture field assertions and live results |
| Selected-city temperature, condition, icon | Insights weather widget | City-change assertions and live current conditions |
| Random quote and new-quote button | Home quote widget | Initial result and changed fixture after clicking New quote |
| Category-specific latest headlines | Insights HN topic searches, newest submission first | Topic request/result assertion; feed limitations disclosed |
| Fetch/async-await and DOM updates | `api.js` request helper and provider renderers | Browser interaction tests |
| Loading and failed requests | Disabled controls, live status, timeout, error/retry | Delayed response, HTTP, network, timeout, malformed shape, retry tests |
| Responsive design and clear navigation | Mobile grid, active pills, section shortcuts | 320px, 390px, 768px, 1440px overflow checks; 44px mobile primary targets |
| Retain smooth interactions | Original toggles, themes, skills, contact validation | Regression, keyboard, reduced-motion, and print checks |
| Online deployment and URL | Existing GitHub Pages site; `link.txt` | Separate live six-page and API verification after deployment |
| ZIP containing pages, scripts, assets | `Ahmed_Fawzy_Assignment3.zip` | Package inventory and asset checks |

## Verification and acceptance

Development verification scripts live outside the submitted site:

- `../../tmp/site-tools/test-assignment3.mjs`: local HTTP server, controlled API responses, CV preservation, navigation, interaction and layout assertions, keyboard skip, no-JavaScript fallback, print and reduced motion, API loading/error/retry, request timeout, safe text and links, live service checks.
- `../../tmp/site-tools/check-assignment3-live.mjs`: deployed page HTTP checks, navigation, no JavaScript page errors, and successful real responses for all four APIs.
- Review screenshots: `../../tmp/assignment3-checks/`, including desktop light/dark and mobile Insights.

Acceptance requires no failed assertions, readable mobile/desktop screenshots, all six deployed pages reachable, successful live service checks at verification time, a matching packaged version, and a correct URL in `link.txt`.

## Delivery

Publish the site folder contents at the GitHub Pages repository root. Preserve the existing images and downloadable CV. Include six HTML pages, `styles.css`, `script.js`, `api.js`, asset folders, `README.txt`, `SPEC.md`, and `link.txt` in the submission ZIP. Keep local tests and temporary tooling outside the submitted site.
