/* External links — open in new tab, SPA-aware */
function markExternalLinks() {
  var host = window.location.hostname;
  document.querySelectorAll('a[href^="http"]').forEach(function(link) {
    if (link.hostname !== host) {
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noopener noreferrer");
    }
  });
}
document.addEventListener("DOMContentLoaded", markExternalLinks);
if (typeof document$ !== "undefined") { document$.subscribe(markExternalLinks); }
