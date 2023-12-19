const SCORM_API = ((window as any).opener?.top?.["API_1484_11"] as any) ?? null;

// For debugging
(window as any).SCORM_API = SCORM_API;

const scormTimeToMs = (time: string) => {
  const regex = /P(?:(\d+)D)?T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;
  const matches = time.match(regex);
  if (matches === null) {
    return 0;
  }
  const days = parseInt(matches[1] ?? 0);
  const hours = parseInt(matches[2] ?? 0);
  const minutes = parseInt(matches[3] ?? 0);
  const seconds = parseInt(matches[4] ?? 0);
  return ((days * 24 + hours) * 60 + minutes) * 60 * 1000 + seconds * 1000;
};
const msToScormTime = (ms: number) => {
  const secs = Math.floor(ms / 1000);
  const mins = Math.floor(secs / 60);
  const hours = Math.floor(mins / 60);
  const remainingSecs = secs % 60;
  const remainingMins = mins % 60;
  const remainingHours = hours % 24;
  return `PT${remainingHours}H${remainingMins}M${remainingSecs}S`;
};

export const scorm = {
  elapsedTime: 0,
  initialize() {
    if (SCORM_API === null) {
      return;
    }
    SCORM_API["Initialize"]("");
  },
  timer() {
    const scormTime = this.get("cmi.total_time", "PT0H0M0S");
    if (["PT0H0M0S", "P"].includes(scormTime)) {
      this.set("cmi.session_time", "PT0H0M0S");
      this.commit();
    }
    const startTime = Date.now();
    const interval = 1000;
    let lastTickTime = 0;
    const tick = () => {
      requestAnimationFrame(tick);
      this.elapsedTime = Date.now() - startTime;
      if (Date.now() - lastTickTime < interval) {
        return;
      }
      lastTickTime = Date.now();
      const ms = scormTimeToMs(this.get("cmi.total_time", "PT0H0M0S")) + this.elapsedTime;
      this.set("cmi.session_time", msToScormTime(ms));
      console.log(`Time in MS: ${ms}`);
      this.commit();
    };
    requestAnimationFrame(tick);
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
    this.set(
      "cmi.session_time",
      msToScormTime(scormTimeToMs(this.get("cmi.total_time", "PT0H0M0S")) + this.elapsedTime),
    );
    this.commit();
    SCORM_API["Terminate"]("");
  },
};
