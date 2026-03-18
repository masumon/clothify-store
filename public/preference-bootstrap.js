(function () {
  try {
    var d = document.documentElement;
    var rawLang =
      localStorage.getItem("clothfy-lang") ||
      localStorage.getItem("clothify-language") ||
      d.lang ||
      "bn";
    var lang = rawLang === "en" ? "en" : "bn";
    localStorage.setItem("clothfy-lang", lang);
    localStorage.setItem("clothify-language", lang);
    document.cookie = "clothfy-lang=" + lang + "; path=/; max-age=31536000; samesite=lax";
    d.lang = lang;

    var rawTheme =
      localStorage.getItem("clothfy-theme") ||
      localStorage.getItem("clothify-theme") ||
      "system";
    var theme =
      rawTheme === "light" || rawTheme === "dark" || rawTheme === "system"
        ? rawTheme
        : "system";
    var dark =
      theme === "dark" ||
      (theme === "system" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);
    localStorage.setItem("clothfy-theme", theme);
    localStorage.setItem("clothify-theme", theme);
    document.cookie = "clothfy-theme=" + theme + "; path=/; max-age=31536000; samesite=lax";

    var uiMode = localStorage.getItem("clothfy-ui-mode") === "abo" ? "abo" : "default";
    localStorage.setItem("clothfy-ui-mode", uiMode);
    document.cookie =
      "clothfy-ui-mode=" + uiMode + "; path=/; max-age=31536000; samesite=lax";

    d.setAttribute("data-theme", theme);
    d.classList.toggle("dark-theme", dark);
    d.classList.toggle("dark", dark);
    d.classList.toggle("abo-premium", uiMode === "abo");
    d.classList.toggle("text-size-large", localStorage.getItem("clothify-text-size") === "large");
    d.classList.toggle("high-contrast", localStorage.getItem("clothify-contrast") === "high");
    d.classList.toggle("reduce-motion", localStorage.getItem("clothify-motion") === "reduced");
  } catch (error) {
    void error;
  }
})();
