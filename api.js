"use strict";

// Each widget owns its state. One failed service never blocks the other widgets.
// No credentials, SDKs, or proxy are needed for these public endpoints.
(() => {
  const text = (tag, value, className) => {
    const node = document.createElement(tag);
    node.textContent = value;
    if (className) node.className = className;
    return node;
  };
  const externalLink = (label, address) => {
    const node = text("a", label);
    try {
      const url = new URL(address);
      if (!["https:", "http:"].includes(url.protocol)) throw new Error();
      node.href = url.href;
      node.target = "_blank";
      node.rel = "noopener noreferrer";
    } catch { /* Keep an invalid remote URL as readable text, without a link. */ }
    return node;
  };
  async function json(url) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    try {
      const response = await fetch(url, { signal: controller.signal, headers: { Accept: "application/json" } });
      if (!response.ok) {
        if (response.status === 403 || response.status === 429) {
          throw new Error("The service has reached its request limit. Please try again later.");
        }
        throw new Error(`The service returned an error (${response.status}). Please try again.`);
      }
      return await response.json();
    } catch (error) {
      if (error.name === "AbortError") throw new Error("The request took too long. Please try again.");
      if (error instanceof SyntaxError) throw new Error("The service returned unreadable data. Please try again.");
      throw error;
    } finally { clearTimeout(timeout); }
  }
  const invalid = () => { throw new Error("The service returned unexpected data. Please try again."); };
  function weatherCondition(code, day) {
    if (code === 0) return ["Clear sky", day ? "☀️" : "🌙"];
    if ([1, 2].includes(code)) return ["Partly cloudy", "⛅"];
    if (code === 3) return ["Overcast", "☁️"];
    if ([45, 48].includes(code)) return ["Fog", "🌫️"];
    if ([51, 53, 55, 56, 57].includes(code)) return ["Drizzle", "🌦️"];
    if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return ["Rain", "🌧️"];
    if ([71, 73, 75, 77, 85, 86].includes(code)) return ["Snow", "🌨️"];
    if ([95, 96, 99].includes(code)) return ["Thunderstorm", "⛈️"];
    return ["Conditions unavailable", "🌡️"];
  }
  const providers = {
    async quotes(panel, results) {
      const data = await json("https://dummyjson.com/quotes/random");
      if (typeof data.quote !== "string" || typeof data.author !== "string") invalid();
      const blockquote = text("blockquote", data.quote, "quote-text");
      results.append(blockquote, text("p", `— ${data.author}`, "quote-author"));
      return "A fresh quote for your day.";
    },
    async github(panel, results) {
      const data = await json("https://api.github.com/users/Ahmed-Fawzy14/repos?sort=updated&direction=desc&per_page=12&type=owner");
      if (!Array.isArray(data)) invalid();
      results.classList.add("api-grid");
      for (const repo of data) {
        if (typeof repo.name !== "string" || typeof repo.html_url !== "string") invalid();
        const card = text("article", "", "live-card");
        const title = text("h3", "");
        title.append(externalLink(repo.name, repo.html_url));
        card.append(title, text("p", repo.description || "No description provided."),
          text("p", `${repo.language || "Language not specified"} · ${Number(repo.stargazers_count) || 0} stars`, "live-meta"));
        results.append(card);
      }
      return data.length ? `${data.length} recently updated public repositories.` : "No public repositories found.";
    },
    async weather(panel, results) {
      const city = panel.querySelector("select");
      const [latitude, longitude] = city.value.split(",");
      const name = city.selectedOptions[0].textContent;
      const params = new URLSearchParams({ latitude, longitude, current: "temperature_2m,weather_code,is_day", timezone: "auto" });
      const data = await json(`https://api.open-meteo.com/v1/forecast?${params}`);
      const current = data.current;
      if (!current || !Number.isFinite(current.temperature_2m) || !Number.isFinite(current.weather_code) || typeof current.time !== "string") invalid();
      const [condition, symbol] = weatherCondition(current.weather_code, current.is_day);
      const icon = text("span", symbol, "weather-icon");
      icon.setAttribute("role", "img");
      icon.setAttribute("aria-label", condition);
      results.append(text("h3", name), icon,
        text("p", `${Math.round(current.temperature_2m)} °C`, "weather-temperature"),
        text("p", condition), text("p", `Updated ${current.time.replace("T", " at ")} (${data.timezone || "local time"})`, "live-meta"));
      return `Current conditions in ${name}.`;
    },
    async news(panel, results) {
      const category = panel.querySelector("select");
      const label = category.selectedOptions[0].textContent;
      const params = new URLSearchParams({ query: category.value, tags: "story", hitsPerPage: "9" });
      const data = await json(`https://hn.algolia.com/api/v1/search_by_date?${params}`);
      if (!Array.isArray(data.hits)) invalid();
      results.classList.add("api-grid");
      const stories = data.hits.filter(story => typeof story.title === "string" && story.objectID);
      for (const story of stories) {
        const card = text("article", "", "live-card");
        const heading = text("h3", "");
        heading.append(externalLink(story.title, story.url || `https://news.ycombinator.com/item?id=${encodeURIComponent(story.objectID)}`));
        const date = new Date(story.created_at);
        const stamp = Number.isNaN(date.getTime()) ? "Date unavailable" : date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
        let source = "Hacker News discussion";
        try {
          const address = new URL(story.url);
          if (["http:", "https:"].includes(address.protocol)) source = address.hostname.replace(/^www\./, "");
        } catch { /* Discussion-only stories do not have a source URL. */ }
        card.append(text("p", source, "news-source"), heading, text("p", `${stamp} · ${Number(story.points) || 0} points`, "live-meta"),
          externalLink("Discuss on Hacker News ↗", `https://news.ycombinator.com/item?id=${encodeURIComponent(story.objectID)}`));
        results.append(card);
      }
      return stories.length ? `${stories.length} recent stories matching ${label}.` : `No stories found for ${label}. Try another topic.`;
    },
  };
  document.querySelectorAll("[data-api]").forEach(panel => {
    const button = panel.querySelector("[data-load]");
    const status = panel.querySelector(".api-status");
    const results = panel.querySelector(".api-results");
    const select = panel.querySelector("select");
    const normalLabel = button.textContent;
    const label = { github: "repositories", quotes: "quote", weather: "weather", news: "news" }[panel.dataset.api];
    async function load() {
      if (button.disabled) return;
      button.disabled = true;
      if (select) select.disabled = true;
      status.classList.remove("is-error");
      panel.classList.add("is-loading");
      status.textContent = `Loading ${label}…`;
      button.textContent = "Loading…";
      results.setAttribute("aria-busy", "true");
      try {
        // Render off-DOM so invalid payloads cannot leave partially rendered results.
        const content = document.createElement("div");
        status.textContent = await providers[panel.dataset.api](panel, content);
        results.className = `api-results${content.classList.contains("api-grid") ? " api-grid" : ""}`;
        results.replaceChildren(...content.childNodes);
        button.textContent = normalLabel;
      } catch (error) {
        status.classList.add("is-error");
        status.textContent = error instanceof TypeError ? "Unable to connect. Check your connection and try again." : error.message;
        if (results.childElementCount) status.textContent += " Previously loaded data is still shown below.";
        button.textContent = `Retry ${label}`;
      } finally {
        panel.classList.remove("is-loading");
        results.setAttribute("aria-busy", "false");
        button.disabled = false;
        if (select) select.disabled = false;
      }
    }
    button.addEventListener("click", load);
    if (select) select.addEventListener("change", load);
    load();
  });
})();
