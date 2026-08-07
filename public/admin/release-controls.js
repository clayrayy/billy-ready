(function () {
  "use strict";

  var compareUrl = "https://api.github.com/repos/clayrayy/billy-ready/compare/main...staging";
  var siteUrl = "https://api.netlify.com/api/v1/sites/2e98cace-82c7-40fc-bfcd-8542314235ee";
  var deploysUrl = siteUrl + "/deploys?branch=main&per_page=10";
  var netlifyDeployUrl = "https://app.netlify.com/projects/billy-ready/deploys/";
  var refreshInterval = 120000;
  var historyCacheDuration = 300000;
  var refreshTimer;
  var checking = false;
  var historyLoadedAt = 0;

  function controls() {
    return {
      status: document.getElementById("release-status"),
      release: document.getElementById("release-site-link"),
      historyToggle: document.getElementById("release-history-toggle"),
      history: document.getElementById("release-history"),
      historyClose: document.getElementById("release-history-close"),
      historyContent: document.getElementById("release-history-content"),
    };
  }

  function releaseDate(value) {
    if (!value) return "Date unavailable";
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(value));
  }

  function releaseTitle(deploy) {
    return deploy.title || (deploy.commit_ref ? "Release " + deploy.commit_ref.slice(0, 7) : "Production release");
  }

  function renderHistory(control, deploys, currentDeployId) {
    var list = document.createElement("ul");
    list.className = "release-history__list";

    deploys.forEach(function (deploy) {
      var item = document.createElement("li");
      var title = document.createElement("span");
      var date = document.createElement("time");

      item.className = "release-history__item";
      title.className = "release-history__title";
      title.textContent = releaseTitle(deploy);
      title.title = releaseTitle(deploy);
      date.className = "release-history__date";
      date.dateTime = deploy.created_at || "";
      date.textContent = releaseDate(deploy.published_at || deploy.created_at);

      item.appendChild(title);
      item.appendChild(date);

      if (deploy.id === currentDeployId) {
        var live = document.createElement("span");
        live.className = "release-history__live";
        live.textContent = "Live";
        item.appendChild(live);
      } else {
        var restore = document.createElement("a");
        restore.className = "release-history__action";
        restore.href = netlifyDeployUrl + encodeURIComponent(deploy.id);
        restore.target = "_blank";
        restore.rel = "noopener noreferrer";
        restore.textContent = "Restore…";
        restore.title = "Open this release in Netlify, then select Publish deploy";
        item.appendChild(restore);
      }

      list.appendChild(item);
    });

    control.historyContent.replaceChildren(list);
  }

  async function loadReleaseHistory(control) {
    if (Date.now() - historyLoadedAt < historyCacheDuration) return;

    control.historyContent.replaceChildren(document.createElement("p"));
    control.historyContent.firstChild.textContent = "Loading releases…";

    try {
      var responses = await Promise.all([
        fetch(siteUrl, { cache: "no-store" }),
        fetch(deploysUrl, { cache: "no-store" }),
      ]);

      if (!responses[0].ok || !responses[1].ok) throw new Error("Netlify release history failed");

      var site = await responses[0].json();
      var deploys = await responses[1].json();
      var productionDeploys = deploys.filter(function (deploy) {
        return deploy.branch === "main" && deploy.context === "production" && deploy.state === "ready";
      });

      if (!productionDeploys.length) {
        control.historyContent.firstChild.textContent = "No production releases were found.";
        return;
      }

      renderHistory(control, productionDeploys, site.published_deploy && site.published_deploy.id);
      historyLoadedAt = Date.now();
    } catch (error) {
      control.historyContent.firstChild.textContent = "Release history is temporarily unavailable.";
    }
  }

  function setHistoryOpen(control, open) {
    control.history.hidden = !open;
    control.historyToggle.setAttribute("aria-expanded", String(open));
    if (open) loadReleaseHistory(control);
  }

  function showRelease(control) {
    control.release.hidden = false;
    control.release.removeAttribute("aria-hidden");
    control.release.textContent = "Release site";
    control.status.textContent = "Staged changes are ready to release.";
  }

  function hideRelease(control, message) {
    control.release.hidden = true;
    control.release.setAttribute("aria-hidden", "true");
    control.status.textContent = message;
  }

  async function checkReleaseStatus() {
    if (checking) return;

    var control = controls();
    if (!control.status || !control.release) return;

    checking = true;

    try {
      var response = await fetch(compareUrl, { cache: "no-store" });
      if (!response.ok) throw new Error("GitHub comparison failed");

      var comparison = await response.json();
      var stagedCommits = Number(comparison.ahead_by) || 0;

      if (stagedCommits > 0) {
        showRelease(control);
      } else {
        hideRelease(control, "Staging matches the live site.");
      }
    } catch (error) {
      hideRelease(control, "Release status is temporarily unavailable.");
    } finally {
      checking = false;
    }
  }

  function startReleaseChecks() {
    var control = controls();
    checkReleaseStatus();
    refreshTimer = window.setInterval(checkReleaseStatus, refreshInterval);

    control.historyToggle.addEventListener("click", function () {
      setHistoryOpen(control, control.history.hidden);
    });
    control.historyClose.addEventListener("click", function () {
      setHistoryOpen(control, false);
      control.historyToggle.focus();
    });

    window.addEventListener("focus", checkReleaseStatus);
    document.addEventListener("visibilitychange", function () {
      if (!document.hidden) checkReleaseStatus();
    });

    if (window.CMS && typeof window.CMS.registerEventListener === "function") {
      window.CMS.registerEventListener({
        name: "postPublish",
        handler: function () {
          window.setTimeout(checkReleaseStatus, 2500);
        },
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", startReleaseChecks, { once: true });
  } else {
    startReleaseChecks();
  }

  window.addEventListener("beforeunload", function () {
    window.clearInterval(refreshTimer);
  });
})();
