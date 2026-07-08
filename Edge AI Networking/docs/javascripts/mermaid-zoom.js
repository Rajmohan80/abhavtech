/* ============================================================================
   Mermaid Diagram Viewer Enhancement
   ----------------------------------------------------------------------------
   Large Mermaid diagrams render small and cluttered inside the content column.
   This adds an "Open full diagram" control to every rendered Mermaid diagram
   that opens the diagram, on its own, full-size in a new browser tab. It also
   makes the diagram itself clickable for the same action.

   Framework-safe: pure JS on already-rendered SVG output. Does not modify the
   Mermaid source, the sidebar, or any theme CSS containment.
   ============================================================================ */

(function () {
  "use strict";

  function openSvgInNewTab(svgEl, title) {
    if (!svgEl) return;

    // Clone so we don't disturb the on-page diagram
    var clone = svgEl.cloneNode(true);

    // Ensure the standalone SVG scales to the viewport
    clone.removeAttribute("style");
    clone.setAttribute("width", "100%");
    clone.setAttribute("height", "100%");
    if (!clone.getAttribute("preserveAspectRatio")) {
      clone.setAttribute("preserveAspectRatio", "xMidYMid meet");
    }

    var svgMarkup = new XMLSerializer().serializeToString(clone);
    var safeTitle = (title || "Architecture Diagram").replace(/[<>&]/g, "");

    var html =
      "<!DOCTYPE html><html lang='en'><head><meta charset='utf-8'>" +
      "<meta name='viewport' content='width=device-width, initial-scale=1'>" +
      "<title>" + safeTitle + "</title>" +
      "<style>" +
      "html,body{margin:0;height:100%;background:#f5f7fa;" +
      "font-family:Inter,-apple-system,Segoe UI,Roboto,sans-serif;}" +
      ".bar{position:sticky;top:0;display:flex;align-items:center;gap:12px;" +
      "padding:10px 16px;background:linear-gradient(135deg,#1B6CA0,#2E8BC0);" +
      "color:#fff;font-size:14px;font-weight:600;box-shadow:0 2px 8px rgba(0,0,0,.15);}" +
      ".bar span{opacity:.9;font-weight:400;}" +
      ".stage{padding:24px;box-sizing:border-box;min-height:calc(100% - 44px);" +
      "display:flex;align-items:flex-start;justify-content:center;overflow:auto;}" +
      ".stage svg{max-width:100%;height:auto;background:#fff;border-radius:8px;" +
      "box-shadow:0 4px 24px rgba(0,0,0,.12);padding:20px;box-sizing:border-box;}" +
      "</style></head><body>" +
      "<div class='bar'>" + safeTitle + "<span>— zoom with your browser (Ctrl/Cmd +)</span></div>" +
      "<div class='stage'>" + svgMarkup + "</div>" +
      "</body></html>";

    var w = window.open("", "_blank");
    if (w) {
      w.document.open();
      w.document.write(html);
      w.document.close();
    }
  }

  function enhance(diagram) {
    if (diagram.dataset.zoomReady === "1") return;
    var svg = diagram.querySelector("svg");
    if (!svg) return;
    diagram.dataset.zoomReady = "1";

    // Derive a title from the nearest preceding heading
    var title = "Architecture Diagram";
    var node = diagram.closest(".mermaid") || diagram;
    var prev = node.previousElementSibling;
    while (prev) {
      if (/^H[1-6]$/.test(prev.tagName)) { title = prev.textContent.trim(); break; }
      prev = prev.previousElementSibling;
    }

    // Wrap so the button can sit at the corner
    var wrap = document.createElement("div");
    wrap.className = "mermaid-zoom-wrap";
    diagram.parentNode.insertBefore(wrap, diagram);
    wrap.appendChild(diagram);

    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "mermaid-zoom-btn";
    btn.setAttribute("aria-label", "Open full diagram in a new tab");
    btn.innerHTML = "&#9974; Open full diagram";
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      openSvgInNewTab(svg, title);
    });
    wrap.appendChild(btn);

    // The diagram itself is clickable too
    diagram.style.cursor = "zoom-in";
    diagram.addEventListener("click", function () {
      openSvgInNewTab(svg, title);
    });
  }

  function scan() {
    // Material renders mermaid into <pre class="mermaid"> or <div class="mermaid">
    document.querySelectorAll(".mermaid").forEach(function (el) {
      if (el.querySelector("svg")) enhance(el);
    });
  }

  // Mermaid renders asynchronously; poll briefly after load and on instant-nav.
  function watch() {
    var tries = 0;
    var timer = setInterval(function () {
      scan();
      if (++tries > 20) clearInterval(timer);
    }, 300);
  }

  if (window.document$ && typeof window.document$.subscribe === "function") {
    // Material for MkDocs instant navigation hook
    window.document$.subscribe(watch);
  } else {
    document.addEventListener("DOMContentLoaded", watch);
    window.addEventListener("load", watch);
  }
})();
