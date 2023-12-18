import { create } from "zustand";
import { scorm } from "@/services/scorm";

type Bookmark = {
  pathname: string;
};

type Scorm = {
  init: () => Promise<Bookmark>;
  setProgress: (progress: number) => void;
  setBookmark: (bookmark: Bookmark) => void;
  exit: () => void;
};

export const useScorm = create<Scorm>(() => {
  return {
    async init() {
      scorm.initialize();
      console.log("SCORM initialized");
      scorm.set("cmi.score.min", 0);
      scorm.set("cmi.score.max", 1);
      const progress = parseFloat(scorm.get("cmi.score.raw", "0"));
      if (progress < 1) {
        scorm.set("cmi.completion_status", "incomplete");
      }
      scorm.commit();
      return scorm.get("cmi.suspend_data", { pathname: "/" });
    },
    setBookmark(bookmark) {
      scorm.set("cmi.suspend_data", bookmark);
      scorm.commit();
    },
    setProgress(progress) {
      progress = Math.max(parseFloat(scorm.get("cmi.score.raw", "0")), progress);
      scorm.set("cmi.score.raw", progress);
      if (progress === 1) {
        scorm.set("cmi.completion_status", "completed");
      }
      scorm.commit();
    },
    exit() {
      scorm.terminate();
      window.close();
    },
  };
});
