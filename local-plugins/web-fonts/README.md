# Blog Web Fonts

Loads IBM Plex Sans SC 1.1.0 from an independently deployed CDN. Font declarations remain with the blog; WOFF2 files remain outside it.

- Source: official `@ibm/plex-sans-sc@1.1.0` WOFF2 CSS, with `font-display: swap`.
- Weights: 400 Regular, 600 SemiBold, 700 Bold; 216 unicode-range subsets each.
- `font.css` retains official `local()` fallbacks and relative font filenames.
- The factory resolves these filenames against `options.baseUrl` without network requests.
- Quartz extracts the declarations into a shared, minified stylesheet and adds it to every page; the plugin also preconnects to the CDN.
- Browsers request only the needed subsets. Blog builds do not download or publish WOFF2 files.
- License: OFL-1.1; see `LICENSE.txt`.

Configure `./local-plugins/web-fonts` in `quartz.config.yaml` with an HTTPS `baseUrl` pointing to the version directory. Keep all filenames unchanged when switching providers. Typography family stacks remain configured through `@quartz-community/quartz-fonts`.
