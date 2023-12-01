import { create } from "zustand";
import { scorm } from "@gamestdio/scorm";

const pages = ["/", "/home", "/end"] as const;

type Page = (typeof pages)[number];

type Scorm = {
  init: () => Promise<(typeof pages)[number]>;
  get: (key: string, defaultValue?: any) => any;
  set: (key: string, value: any) => void;
  commit: typeof scorm.commit;
  updateProgress: (page: Page) => void;
  exit: () => void;
};

function mapLinear(x: number, a1: number, a2: number, b1: number, b2: number) {
  const mapped = b1 + ((x - a1) * (b2 - b1)) / (a2 - a1);
  return Math.max(b1, Math.min(b2, mapped));
}

function round(value: number, places: number = 2) {
  const digits = Math.pow(10, places);
  return Math.round(value * digits) / digits;
}

(window as any).SCORM_DEBUG = scorm;

let waitTimeStart: number | undefined = undefined;
function waitForScormToInitialize(timeout = 2000): Promise<void> {
  if (waitTimeStart === undefined) {
    waitTimeStart = Date.now();
  }
  const wait = (ms: number) => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  };
  return new Promise(async (resolve) => {
    if (scorm.isActive) {
      return resolve();
    }
    if (waitTimeStart !== undefined && Date.now() - waitTimeStart > timeout) {
      return resolve();
    }
    await wait(150);
    await waitForScormToInitialize(timeout);
    resolve();
  });
}

export const useScorm = create<Scorm>(() => {
  function set(key: string, value: any) {
    if (!scorm.isActive) {
      return;
    }
    scorm.set(key, key === "cmi.suspend_data" ? JSON.stringify(value) : value);
  }

  function get(key: string, defaultValue?: any) {
    if (!scorm.isActive) {
      return defaultValue;
    }
    if (key === "cmi.suspend_data") {
      try {
        const value = scorm.get(key);
        if (value === "") {
          return defaultValue;
        }
        return JSON.parse(value) ?? defaultValue;
      } catch {
        return defaultValue;
      }
    }
    const value = scorm.get(key);
    if (value === "") {
      return defaultValue;
    }
    return value;
  }

  return {
    async init() {
      scorm.configure({ debug: true, handleExitMode: true, handleCompletionStatus: false, version: "2004" });
      scorm.initialize();
      await waitForScormToInitialize();
      const currentProgress = parseFloat(get("cmi.score.scaled", "0"));
      if (currentProgress < 1) {
        set("cmi.completion_status", "incomplete");
        set("cmi.success_status", "unknown");
      }
      scorm.commit();
      return pages[Math.floor(mapLinear(currentProgress, 0, 1, 0, pages.length - 1))];
    },
    get,
    set,
    commit: scorm.commit,
    updateProgress(page) {
      const currentProgress = parseFloat(get("cmi.score.scaled", "0"));
      const progress = round((pages.indexOf(page) + 1) / Math.max(1, pages.length));
      set("cmi.score.scaled", Math.max(currentProgress, progress));
      set("cmi.progress_measure", Math.max(currentProgress, progress));
      if (progress === 1) {
        set("cmi.completion_status", "completed");
        set("cmi.success_status", "passed");
      }
      scorm.commit();
    },
    exit() {
      scorm.terminate();
      scorm.commit();
      window.close();
    },
  };
});
