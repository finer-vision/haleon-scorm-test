class SCORM {
  /**
   * @type {("API" | "API_1484_11")}
   */
  #api;

  /**
   * @type {("1.2" | "2004")}
   */
  #version;

  /**
   * @param {("1.2" | "2004")} version
   */
  constructor(version) {
    this.#api = version === "1.2" ? window.opener.top.API : window.opener.top.API_1484_11;
    this.#version = version;
  }

  initialize() {
    let initialized;
    if (this.#version === "1.2") {
      initialized = this.#api.LMSInitialize("") === "true";
    } else {
      initialized = this.#api.Initialize("") === "true";
    }
    if (!initialized) {
      throw new Error("Failed to initialize SCORM");
    }
    console.info("SCORM initialized");
  }

  terminate() {
    let terminated;
    if (this.#version === "1.2") {
      terminated = this.#api.LMSTerminate("") === "true";
    } else {
      terminated = this.#api.Terminate("") === "true";
    }
    if (!terminated) {
      throw new Error("Failed to terminate SCORM");
    }
    console.info("SCORM terminated");
  }

  /**
   * @param {String} variable
   * @returns {String}
   */
  getValue(variable) {
    if (this.#version === "1.2") {
      return this.#api.LMSGetValue(variable);
    } else {
      return this.#api.GetValue(variable);
    }
  }

  /**
   * @param {String} variable
   * @param {String} value
   */
  setValue(variable, value) {
    let set;
    if (this.#version === "1.2") {
      set = this.#api.LMSSetValue(variable, value) === "true";
    } else {
      set = this.#api.SetValue(variable, value) === "true";
    }
    if (!set) {
      throw new Error(`Failed to set SCORM variable "${variable}"`);
    }
    console.info(`Set SCORM variable "${variable}" with a value of "${value}"`);
  }

  commit() {
    let committed;
    if (this.#version === "1.2") {
      committed = this.#api.LMSCommit("") === "true";
    } else {
      committed = this.#api.Commit("") === "true";
    }
    if (!committed) {
      throw new Error("Failed to commit to SCORM");
    }
    console.info("Committed to SCORM");
  }
}

/**
 * First Run
 */
{
  const api = new SCORM("2004");
  api.initialize();
  console.log("cmi.score.raw", api.getValue("cmi.score.raw"));
  api.setValue("cmi.score.raw", "0.5");
  api.commit();
  api.terminate();
}

/**
 * Second Run
 */
{
  const api = new SCORM("2004");
  api.initialize();
  console.log("cmi.score.raw", api.getValue("cmi.score.raw"));
}
