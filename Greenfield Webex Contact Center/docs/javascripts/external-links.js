// Open external links in new tab
// Works with navigation.instant (SPA mode) via location$ observable
function openExternalLinksInNewTab() {
  var links = document.querySelectorAll("a[href^='http']");
  var host = window.location.hostname;
  for (var i = 0; i < links.length; i++) {
    if (links[i].hostname !== host) {
      links[i].setAttribute("target", "_blank");
      links[i].setAttribute("rel", "noopener");
    }
  }
}

// Run on initial load
openExternalLinksInNewTab();

// Re-run after each SPA navigation (navigation.instant)
if (typeof location$ !== "undefined") {
  location$.subscribe(function () {
    openExternalLinksInNewTab();
  });
}
