const SCORM_API = ((window as any).opener?.top?.["API_1484_11"] as any) ?? null;

// For debugging
(window as any).SCORM_API = SCORM_API;

export const scorm = {
  initialize() {
    if (SCORM_API === null) {
      return;
    }
    SCORM_API["Initialize"]("");
  },
  get(key: string, defaultValue?: any) {
    if (SCORM_API === null) {
      return defaultValue;
    }
    const value = SCORM_API["GetValue"](key);
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
  },
  set(key: string, value: any) {
    if (SCORM_API === null) {
      return;
    }
    SCORM_API["SetValue"](key, key === "cmi.suspend_data" ? JSON.stringify(value) : value);
  },
  commit() {
    if (SCORM_API === null) {
      return;
    }
    SCORM_API["Commit"]("");
  },
  terminate() {
    if (SCORM_API === null) {
      return;
    }
    SCORM_API["Terminate"]("");
  },
};
