// Open all external links in a new tab
document.addEventListener("DOMContentLoaded", function () {
  var links = document.querySelectorAll("a[href]");
  links.forEach(function (link) {
    var href = link.getAttribute("href");
    if (href && (href.startsWith("http://") || href.startsWith("https://"))) {
      if (!href.includes(window.location.hostname)) {
        link.setAttribute("target", "_blank");
        link.setAttribute("rel", "noopener noreferrer");
      }
    }
  });
});
