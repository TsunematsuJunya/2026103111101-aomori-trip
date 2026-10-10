const toast = document.querySelector("[data-toast]");

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 1800);
}

document.querySelectorAll("[data-day-tab]").forEach((button) => {
  button.addEventListener("click", () => {
    const target = button.dataset.dayTab;
    document.querySelectorAll("[data-day-tab]").forEach((tab) => {
      const selected = tab === button;
      tab.classList.toggle("is-active", selected);
      tab.setAttribute("aria-selected", String(selected));
    });
    document.querySelectorAll("[data-day-panel]").forEach((panel) => {
      panel.classList.toggle("is-active", panel.dataset.dayPanel === target);
    });
  });
});

const checkboxes = document.querySelectorAll("[data-check]");
checkboxes.forEach((checkbox) => {
  const key = `aomori-trip-check-${checkbox.dataset.check}`;
  checkbox.checked = localStorage.getItem(key) === "1";
  checkbox.addEventListener("change", () => {
    localStorage.setItem(key, checkbox.checked ? "1" : "0");
  });
});

document.querySelector("[data-clear-checks]")?.addEventListener("click", () => {
  checkboxes.forEach((checkbox) => {
    checkbox.checked = false;
    localStorage.removeItem(`aomori-trip-check-${checkbox.dataset.check}`);
  });
  showToast("チェックをリセットしました");
});

document.querySelector("[data-share]")?.addEventListener("click", async () => {
  const shareData = {
    title: document.title,
    text: "青森1泊2日旅のしおり",
    url: window.location.href,
  };

  try {
    if (navigator.share) {
      await navigator.share(shareData);
      return;
    }
    await navigator.clipboard.writeText(window.location.href);
    showToast("URLをコピーしました");
  } catch {
    showToast("共有をキャンセルしました");
  }
});

fetch("./assets/original-plan.md")
  .then((response) => {
    if (!response.ok) throw new Error("failed");
    return response.text();
  })
  .then((text) => {
    const source = document.getElementById("sourceText");
    if (source) source.textContent = text;
  })
  .catch(() => {
    const source = document.getElementById("sourceText");
    if (source) source.textContent = "元テキストを読み込めませんでした。別タブのリンクから確認してください。";
  });
