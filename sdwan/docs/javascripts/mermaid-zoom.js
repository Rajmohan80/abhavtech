// Click-to-zoom for Mermaid diagrams: in-page full-screen overlay + "open in new tab".
// Uses Material's document$ observable so it works with navigation.instant (SPA nav).
(function () {
  function svgToBlobUrl(svg) {
    // Serialize a standalone, styled SVG for opening in a new browser tab.
    var clone = svg.cloneNode(true);
    clone.removeAttribute("width");
    clone.removeAttribute("height");
    if (!clone.getAttribute("xmlns")) {
      clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    }
    var markup =
      '<?xml version="1.0" encoding="UTF-8"?>\n' +
      new XMLSerializer().serializeToString(clone);
    var blob = new Blob([markup], { type: "image/svg+xml;charset=utf-8" });
    return URL.createObjectURL(blob);
  }

  function attach() {
    try {
    document.querySelectorAll("pre.mermaid, .mermaid").forEach(function (container) {
      var svg = container.querySelector("svg");
      if (!svg || container.dataset.zoomable === "1") return;
      container.dataset.zoomable = "1";

      // "Open in new tab" affordance above each diagram.
      var bar = document.createElement("div");
      bar.className = "mermaid-actions";
      var openLink = document.createElement("a");
      openLink.textContent = "Open in new tab \u2197";
      openLink.href = "#";
      openLink.className = "mermaid-open-tab";
      openLink.addEventListener("click", function (ev) {
        ev.preventDefault();
        ev.stopPropagation();
        var url = svgToBlobUrl(svg);
        window.open(url, "_blank", "noopener");
      });
      bar.appendChild(openLink);
      if (container.parentNode) {
        container.parentNode.insertBefore(bar, container);
      }

      // Click diagram -> full-screen overlay lightbox.
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

        // Overlay-level "open in new tab" too.
        var overlayOpen = document.createElement("a");
        overlayOpen.textContent = "Open in new tab \u2197";
        overlayOpen.href = "#";
        overlayOpen.className = "mermaid-overlay-open";
        overlayOpen.addEventListener("click", function (e) {
          e.preventDefault();
          e.stopPropagation();
          window.open(svgToBlobUrl(svg), "_blank", "noopener");
        });

        overlay.appendChild(overlayOpen);
        overlay.appendChild(clone);
        overlay.addEventListener("click", function () { overlay.remove(); });
        document.addEventListener("keydown", function esc(e) {
          if (e.key === "Escape") { overlay.remove(); document.removeEventListener("keydown", esc); }
        });
        document.body.appendChild(overlay);
      });
    });
    } catch (e) { /* never let diagram enhancement break the page */ }
  }

  function watch() {
    // If the page has no mermaid at all, do nothing (don't poll for 9s).
    if (!document.querySelector("pre.mermaid, .mermaid")) return;
    var tries = 0;
    var iv = setInterval(function () {
      attach();
      // Stop as soon as every mermaid container has been enhanced,
      // or after the timeout window — whichever comes first.
      var pending = document.querySelector(
        'pre.mermaid:not([data-zoomable="1"]) svg, .mermaid:not([data-zoomable="1"]) svg'
      );
      if (!pending || ++tries > 20) clearInterval(iv);
    }, 250);
  }

  if (typeof window.document$ !== "undefined" && window.document$.subscribe) {
    window.document$.subscribe(function () { watch(); });
  } else {
    document.addEventListener("DOMContentLoaded", watch);
  }
})();
