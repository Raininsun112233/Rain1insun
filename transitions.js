(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) return;

  const pageName = (path) => {
    const name = path.split("/").pop().toLowerCase();
    return name || "index.html";
  };
  const currentPage = pageName(window.location.pathname);

  try {
    if (sessionStorage.getItem("portfolio-page-transition") === "1") {
      sessionStorage.removeItem("portfolio-page-transition");
      document.body.classList.add("page-entering");
      document.body.addEventListener("animationend", (event) => {
        if (event.animationName === "page-gradient-reveal") {
          document.body.classList.remove("page-entering");
        }
      }, { once: true });
      window.setTimeout(() => document.body.classList.remove("page-entering"), 900);
    }
  } catch {}

  document.addEventListener("click", (event) => {
    const link = event.target.closest("a[href]");
    if (!link || event.defaultPrevented || event.button !== 0 ||
        event.metaKey || event.ctrlKey || event.shiftKey || event.altKey ||
        link.target || link.hasAttribute("download")) return;

    const destination = new URL(link.href, window.location.href);
    if (destination.origin !== window.location.origin) return;
    const nextPage = pageName(destination.pathname);
    if (!["index.html", "work.html"].includes(nextPage) || nextPage === currentPage) return;

    event.preventDefault();
    try {
      sessionStorage.setItem("portfolio-page-transition", "1");
    } catch {}
    document.body.classList.add("page-leaving");
    window.setTimeout(() => window.location.assign(destination.href), 440);
  });
})();
