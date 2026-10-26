Ahmed Fawzy Abdelkader - Assignment 3
Multi-page portfolio with four public API integrations

RUN
Open index.html in a modern browser. An internet connection is needed for the
live widgets. A local HTTP server is recommended for development. There is no
build step, package installation, backend, or API key configuration.

PAGES
index.html       Home, introduction, About Me, random inspirational quote
experience.html Education, work experience, activities, achievements
projects.html    All five original projects plus live GitHub repositories
skills.html      Original skills and interactive skill addition
insights.html    Current weather and technology news by topic
contact.html     Contact links and original form validation demo

All original CV sections, descriptions, images, logos, and the downloadable PDF
are preserved from Assignment 2. Assignment 2 files remain unchanged.
Shared styles.css and script.js retain themes, welcome dismissal, section and
project toggles, skill validation, and contact validation. Features initialize
only on the pages that contain their controls. The theme choice persists across
pages using the existing cv-theme localStorage key. Contact verifies fields
locally; it does not deliver messages. Added skills last for the current visit.

API INTEGRATIONS (api.js)
1. Quotes: https://dummyjson.com/quotes/random
   Random quote and author; New quote button fetches another quote.
   Documentation: https://dummyjson.com/docs/quotes

2. Weather: https://api.open-meteo.com/v1/forecast
   City selection: Cairo, Alexandria, Dubai, London, New York.
   Displays current temperature in Celsius, condition, matching icon, and local
   observation time/timezone. Changes fetch new data; refresh also available.
   Documentation: https://open-meteo.com/en/docs
   Free for this noncommercial assignment; no key. Attribution and CC BY 4.0
   license links are shown on the page.

3. GitHub: https://api.github.com/users/Ahmed-Fawzy14/repos
   Shows up to 12 recently updated public repositories with name, description,
   primary language, star count, and repository link. No token is required.
   Public unauthenticated requests have a lower rate limit; limit failures show
   a helpful message. No token should be added to this public static site.
   Documentation: https://docs.github.com/en/rest/repos/repos#list-repositories-for-a-user

4. News: https://hn.algolia.com/api/v1/search_by_date
   Hacker News stories matching Artificial intelligence, Software engineering,
   Cloud & DevOps, or Cybersecurity, ordered newest first. Up to 9 results show
   headline, publication date, points, original link, and discussion link.
   These are topic keyword matches from community submissions, not editorial
   category labels or a general breaking-news feed. No key is required.
   Documentation: https://hn.algolia.com/api

All widgets use fetch and async/await, automatically load on relevant pages,
announce loading and completion, handle HTTP/network/timeout/invalid-data
failures, and allow retry. Empty repository/news responses have explicit
messages. Requests time out after 15 seconds. Controls disable during requests
to prevent duplicate loads. Services fail independently. Remote strings use
textContent; links allow only HTTP/HTTPS. No simulated results are shipped.

FILES
Six HTML pages; styles.css; script.js; api.js; images/; assets/; link.txt;
this README.txt. No external frontend libraries or build dependencies.

VALIDATION
Automated local browser checks passed on 26 October 2026:
- Six-page navigation, unique current-page marker, no missing controlled panels
- All five project cards and original project reveal behavior
- Cross-page dark theme persistence
- Skill additions and duplicate validation; invalid and valid contact form
- Mobile layouts at 390px without horizontal overflow; navigation visible
- API success, network/HTTP errors, invalid payloads, empty results, retry
- Quote refresh, city and news topic changes, safe text and URL rendering
- No JavaScript page errors during the controlled checks
All four actual services also returned usable data in the browser:
quote; 12 public repositories; Cairo weather; 9 AI news stories.
Availability and rate limits remain controlled by their respective providers.

DEPLOYMENT / SUBMISSION
Upload the contents of this folder to the static host root (GitHub Pages or
Netlify, for example) so all six HTML files and assets share a directory.
Live portfolio: https://ahmed-fawzy14.github.io/ahmed-fawzy-cv/
Deployed to the existing GitHub Pages repository for Assignment 3.
link.txt contains this published website URL.
