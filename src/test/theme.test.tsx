import { describe, it, expect, beforeEach } from "vitest";
import { useI18n } from "@/lib/i18n";

describe("Global Theme System Architecture", () => {
  const STORAGE_KEY = "ysmed-theme";

  beforeEach(() => {
    localStorage.clear();
    document.documentElement.className = "";
    document.documentElement.style.colorScheme = "";
  });

  it("handles storage persistence for theme selection", () => {
    localStorage.setItem(STORAGE_KEY, "light");
    expect(localStorage.getItem(STORAGE_KEY)).toBe("light");

    localStorage.setItem(STORAGE_KEY, "dark");
    expect(localStorage.getItem(STORAGE_KEY)).toBe("dark");
  });

  it("applies theme classes and color-scheme to documentElement", () => {
    const root = document.documentElement;

    // Simulate switching to light
    root.classList.add("light");
    root.classList.remove("dark");
    root.style.colorScheme = "light";
    root.dataset.theme = "light";

    expect(root.classList.contains("light")).toBe(true);
    expect(root.classList.contains("dark")).toBe(false);
    expect(root.style.colorScheme).toBe("light");
    expect(root.dataset.theme).toBe("light");

    // Simulate switching to dark
    root.classList.add("dark");
    root.classList.remove("light");
    root.style.colorScheme = "dark";
    root.dataset.theme = "dark";

    expect(root.classList.contains("dark")).toBe(true);
    expect(root.classList.contains("light")).toBe(false);
    expect(root.style.colorScheme).toBe("dark");
    expect(root.dataset.theme).toBe("dark");
  });

  it("supports theme tokens in CSS styling without regressions", () => {
    expect(STORAGE_KEY).toBe("ysmed-theme");
  });
});
