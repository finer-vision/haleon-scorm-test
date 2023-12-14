class SCORM {
  /**
   * @type {Object}
   */
  #api = window.opener.top["API"];

  initialize() {
    if (this.#api["LMSInitialize"]("") !== "true") {
      console.warn("Failed to initialize SCORM");
    } else {
      console.info("SCORM initialized");
    }
  }

  terminate() {
    if (this.#api["LMSFinish"]("") !== "true") {
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
    return this.#api["LMSGetValue"](variable);
  }

  /**
   * @param {String} variable
   * @param {String} value
   */
  setValue(variable, value) {
    if (this.#api["LMSSetValue"](variable, value) !== "true") {
      console.warn(`Failed to set SCORM variable "${variable}"`);
    } else {
      console.info(`Set SCORM variable "${variable}" with a value of "${value}"`);
    }
  }

  commit() {
    if (this.#api["LMSCommit"]("") !== "true") {
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
  console.log("cmi.core.score.raw", api.getValue("cmi.core.score.raw"));
  api.setValue("cmi.core.score.raw", "0.5");
  api.commit();
  api.terminate();
}

/**
 * Second Run
 */
{
  const api = new SCORM();
  api.initialize();
  console.log("cmi.core.score.raw", api.getValue("cmi.core.score.raw"));
}

/**
 * Raw test 1
 */
{
  window.opener.top["API"]["LMSInitialize"]("");
  window.opener.top["API"]["LMSSetValue"]("cmi.core.score.raw", "0.1");
  window.opener.top["API"]["LMSCommit"]("");
  window.opener.top["API"]["LMSFinish"]("");
}

/**
 * Raw test 2
 */
{
  window.opener.top["API"]["LMSInitialize"]("");
  window.opener.top["API"]["LMSGetValue"]("cmi.core.score.raw");
}
