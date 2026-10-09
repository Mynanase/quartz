// Notify the editor as soon as the document exists, without waiting for remote fonts.
document.addEventListener("DOMContentLoaded", () => {
  window.parent.postMessage({ type: "quartz-palette-ready" }, window.location.origin)
  for (const link of document.querySelectorAll('link[rel="stylesheet"][media="print"]')) {
    if (link.sheet) link.media = "all"
    else
      link.addEventListener(
        "load",
        () => {
          link.media = "all"
        },
        { once: true },
      )
  }
})
