import { create } from "zustand";
import { scorm } from "@gamestdio/scorm";

const pages = ["/", "/home", "/end"] as const;

type Page = (typeof pages)[number];

type Scorm = {
  init: () => (typeof pages)[number];
  get: (key: string, defaultValue?: any) => any;
  set: (key: string, value: any) => void;
  updateProgress: (page: Page) => void;
  exit: () => void;
};

function mapLinear(x: number, a1: number, a2: number, b1: number, b2: number) {
  const mapped = b1 + ((x - a1) * (b2 - b1)) / (a2 - a1);
  return Math.max(b1, Math.min(b2, mapped));
}

export const useScorm = create<Scorm>(() => {
  function set(key: string, value: any) {
    scorm.set(key, key === "cmi.suspend_data" ? JSON.stringify(value) : value);
  }

  function get(key: string, defaultValue?: any) {
    if (key === "cmi.suspend_data") {
      try {
        return JSON.parse(scorm.get(key)) ?? defaultValue;
      } catch {
        return defaultValue;
      }
    }
    return scorm.get(key) ?? defaultValue;
  }

  return {
    init() {
      scorm.configure({ debug: true, handleExitMode: true });
      scorm.initialize();
      set("cmi.core.score.min", 0);
      set("cmi.core.score.max", 1);
      const currentProgress = get("cmi.core.score.raw", 0);
      if (currentProgress < 1) {
        set("cmi.core.lesson_status", "incomplete");
      }
      return pages[Math.floor(mapLinear(currentProgress, 0, 1, 0, pages.length - 1))];
    },
    get,
    set,
    updateProgress(page) {
      const currentProgress = get("cmi.core.score.raw", 0);
      const progress = (pages.indexOf(page) + 1) / Math.max(1, pages.length);
      set("cmi.core.score.raw", Math.max(currentProgress, progress));
      if (progress === 1) {
        set("cmi.core.lesson_status", "completed");
      }
    },
    exit() {
      scorm.terminate();
      window.close();
    },
  };
});
