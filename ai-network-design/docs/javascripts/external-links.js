/* ============================================================================
   EXTERNAL LINKS — open in new tab
   ============================================================================
   Adds target="_blank" + rel="noopener noreferrer" to all external links.
   SPA-aware: re-runs on every navigation.instant page load so links stay
   correct after client-side navigation.
   ============================================================================ */

function markExternalLinks() {
  const host = window.location.hostname;
  document.querySelectorAll('a[href^="http"]').forEach(function (link) {
    if (link.hostname !== host) {
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noopener noreferrer");
    }
  });
}

// Run on initial load
document.addEventListener("DOMContentLoaded", markExternalLinks);

// Re-run on every instant-navigation page change (Material for MkDocs)
if (typeof document$ !== "undefined") {
  document$.subscribe(markExternalLinks);
}
