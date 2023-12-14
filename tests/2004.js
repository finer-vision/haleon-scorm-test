class SCORM {
  /**
   * @type {Object}
   */
  #api = window.opener.top["API_1484_11"];

  initialize() {
    if (this.#api["Initialize"]("") !== "true") {
      console.warn("Failed to initialize SCORM");
    } else {
      console.info("SCORM initialized");
    }
  }

  terminate() {
    if (this.#api["Terminate"]("") !== "true") {
      console.warn("Failed to terminate SCORM");
    } else {
      console.info("SCORM terminated");
    }
  }

  /**
   * @param {String} variable
   * @returns {String}
   */
  getValue(variable) {
    return this.#api["GetValue"](variable);
  }

  /**
   * @param {String} variable
   * @param {String} value
   */
  setValue(variable, value) {
    if (this.#api["SetValue"](variable, value) !== "true") {
      console.warn(`Failed to set SCORM variable "${variable}"`);
    } else {
      console.info(`Set SCORM variable "${variable}" with a value of "${value}"`);
    }
  }

  commit() {
    if (this.#api["Commit"]("") !== "true") {
      console.warn("Failed to commit to SCORM");
    } else {
      console.info("Committed to SCORM");
    }
  }
}

/**
 * First Run
 */
{
  const api = new SCORM();
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
  const api = new SCORM();
  api.initialize();
  console.log("cmi.score.raw", api.getValue("cmi.score.raw"));
}
