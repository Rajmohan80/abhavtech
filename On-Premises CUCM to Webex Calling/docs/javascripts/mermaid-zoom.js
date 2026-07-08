// Mermaid diagram click-to-zoom (lightbox + open-in-new-tab)
// Portfolio standard — matches SD-Access / SD-WAN sites
document.addEventListener("DOMContentLoaded", function () {
  function initZoom() {
    document.querySelectorAll(".mermaid svg").forEach(function (svg) {
      if (svg.dataset.zoomInit) return;
      svg.dataset.zoomInit = "1";
      svg.style.cursor = "zoom-in";

      // Wrap in relative container if not already
      var wrapper = svg.parentElement;
      if (!wrapper.classList.contains("mermaid-zoom-wrap")) {
        wrapper.classList.add("mermaid-zoom-wrap");
        wrapper.style.position = "relative";
      }

      // Add "open in new tab" button
      var btn = document.createElement("a");
      btn.textContent = "⤢ Open full size";
      btn.title = "Open diagram in new tab";
      btn.style.cssText =
        "position:absolute;top:6px;right:8px;font-size:0.7rem;" +
        "background:rgba(30,107,160,0.85);color:#fff;padding:2px 8px;" +
        "border-radius:4px;text-decoration:none;cursor:pointer;z-index:10;";

      btn.addEventListener("click", function (e) {
        e.stopPropagation();
        var svgData = new XMLSerializer().serializeToString(svg);
        var blob = new Blob([svgData], { type: "image/svg+xml" });
        var url = URL.createObjectURL(blob);
        window.open(url, "_blank");
      });
      wrapper.appendChild(btn);

      // Click SVG → lightbox overlay
      svg.addEventListener("click", function () {
        var overlay = document.createElement("div");
        overlay.style.cssText =
          "position:fixed;inset:0;background:rgba(0,0,0,0.82);z-index:9999;" +
          "display:flex;align-items:center;justify-content:center;cursor:zoom-out;";

        var clone = svg.cloneNode(true);
        clone.style.cssText =
          "width:95vw;height:95vh;max-width:95vw;max-height:95vh;" +
          "background:#fff;border-radius:8px;padding:16px;box-sizing:border-box;";
        clone.removeAttribute("width");
        clone.removeAttribute("height");

        overlay.appendChild(clone);
        document.body.appendChild(overlay);

        overlay.addEventListener("click", function () {
          document.body.removeChild(overlay);
        });
        document.addEventListener("keydown", function esc(e) {
          if (e.key === "Escape") {
            if (document.body.contains(overlay))
              document.body.removeChild(overlay);
            document.removeEventListener("keydown", esc);
          }
        });
      });
    });
  }

  // Init on load and after nav (instant loading)
  initZoom();
  document.addEventListener("DOMContentSwitch", function () {
    setTimeout(initZoom, 400);
  });
});
