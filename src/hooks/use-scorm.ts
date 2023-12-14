import { create } from "zustand";
// import { scorm } from "@gamestdio/scorm";

type Bookmark = {
  pathname: string;
};

type Scorm = {
  init: () => Promise<Bookmark>;
  setProgress: (progress: number) => void;
  setBookmark: (bookmark: Bookmark) => void;
  exit: () => void;
};

const API = ((window as any).opener.top["API"] as any) ?? null;

(window as any).API = API;

export const useScorm = create<Scorm>(() => {
  function set(key: string, value: any) {
    // if (!scorm.isActive) {
    //   return;
    // }
    // scorm.set(key, key === "cmi.suspend_data" ? JSON.stringify(value) : value);
    if (API === null) return;
    API["LMSSetValue"](key, key === "cmi.suspend_data" ? JSON.stringify(value) : value);
  }

  function get(key: string, defaultValue?: any) {
    // if (!scorm.isActive) {
    //   return defaultValue;
    // }
    // if (key === "cmi.suspend_data") {
    //   try {
    //     const value = scorm.get(key);
    //     if (value === "") {
    //       return defaultValue;
    //     }
    //     return JSON.parse(value) ?? defaultValue;
    //   } catch {
    //     return defaultValue;
    //   }
    // }
    // const value = scorm.get(key);
    // if (value === "") {
    //   return defaultValue;
    // }
    // return value;
    if (API === null) return;
    const value = API["LMSGetValue"](key);
    if (key === "cmi.suspend_data") {
      try {
        if (value === "") {
          return defaultValue;
        }
        return JSON.parse(value) ?? defaultValue;
      } catch {
        return defaultValue;
      }
    }
    if (value === "") {
      return defaultValue;
    }
    return value;
  }

  function commit() {
    // scorm.commit();
    if (API === null) return;
    API["LMSCommit"]("");
  }

  function terminate() {
    // if (!scorm.isActive) {
    //   return;
    // }
    // scorm.terminate();
    if (API === null) return;
    API["LMSFinish"]("");
  }

  return {
    async init() {
      // scorm.configure({ debug: true, handleExitMode: true, handleCompletionStatus: false, version: "1.2" });
      // scorm.initialize();
      API["LMSInitialize"]("");
      console.log("SCORM initialized");
      set("cmi.core.score.min", 0);
      set("cmi.core.score.max", 1);
      const progress = parseFloat(get("cmi.core.score.raw", "0"));
      if (progress < 1) {
        set("cmi.completion_status", "incomplete");
        set("cmi.success_status", "unknown");
      }
      commit();
      return get("cmi.suspend_data", { pathname: "/" });
    },
    setBookmark(bookmark) {
      set("cmi.suspend_data", bookmark);
      commit();
    },
    setProgress(progress) {
      // if (!scorm.isActive) return;
      progress = Math.max(parseFloat(get("cmi.core.score.raw", "0")), progress);
      set("cmi.core.score.raw", progress);
      if (progress === 1) {
        set("cmi.completion_status", "completed");
        set("cmi.success_status", "passed");
      }
      commit();
    },
    exit() {
      terminate();
      window.close();
    },
  };
});
