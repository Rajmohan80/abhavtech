// Click-to-open-full-size for Mermaid diagrams.
// Uses Material's document$ observable so it works with navigation.instant (SPA nav).
(function () {
  function attach() {
    // Material renders mermaid into <pre class="mermaid"> then injects an <svg>
    document.querySelectorAll("pre.mermaid, .mermaid").forEach(function (container) {
      var svg = container.querySelector("svg");
      if (!svg || container.dataset.zoomable === "1") return;
      container.dataset.zoomable = "1";
      svg.style.cursor = "zoom-in";
      svg.addEventListener("click", function (ev) {
        ev.stopPropagation();
        var overlay = document.createElement("div");
        overlay.className = "mermaid-zoom-overlay";
        var clone = svg.cloneNode(true);
        clone.style.cursor = "zoom-out";
        clone.removeAttribute("width");
        clone.removeAttribute("height");
        clone.style.maxWidth = "95vw";
        clone.style.maxHeight = "95vh";
        overlay.appendChild(clone);
        overlay.addEventListener("click", function () { overlay.remove(); });
        document.addEventListener("keydown", function esc(e) {
          if (e.key === "Escape") { overlay.remove(); document.removeEventListener("keydown", esc); }
        });
        document.body.appendChild(overlay);
      });
    });
  }

  function watch() {
    // Mermaid renders asynchronously; poll briefly until the SVG exists.
    var tries = 0;
    var iv = setInterval(function () {
      attach();
      if (++tries > 30) clearInterval(iv);
    }, 300);
  }

  // Material for MkDocs exposes document$ (RxJS) that emits on every page load,
  // including instant-navigation page swaps. Fall back to DOMContentLoaded.
  if (typeof window.document$ !== "undefined" && window.document$.subscribe) {
    window.document$.subscribe(watch);
  } else {
    document.addEventListener("DOMContentLoaded", watch);
  }
})();
