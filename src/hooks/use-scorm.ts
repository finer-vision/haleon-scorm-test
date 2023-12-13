import { create } from "zustand";
import { scorm } from "@gamestdio/scorm";

type Bookmark = {
  pathname: string;
};

type Scorm = {
  init: () => Promise<Bookmark>;
  setProgress: (progress: number) => void;
  setBookmark: (bookmark: Bookmark) => void;
  exit: () => void;
};

(window as any).SCORM_DEBUG = scorm;

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
      set("cmi.score.min", 0);
      set("cmi.score.max", 0);
      const progress = parseFloat(get("cmi.score.scaled", "0"));
      if (progress < 1) {
        set("cmi.completion_status", "incomplete");
        set("cmi.success_status", "unknown");
      }
      scorm.commit();
      return get("cmi.suspend_data", { pathname: "/" });
    },
    setBookmark(bookmark) {
      set("cmi.suspend_data", bookmark);
    },
    setProgress(progress) {
      progress = Math.max(parseFloat(get("cmi.score.scaled", "0")), progress);
      set("cmi.score.scaled", progress);
      set("cmi.score.raw", progress);
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
