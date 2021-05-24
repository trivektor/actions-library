class Actions {
  constructor() {
    this.stats = {};
  }

  addAction(jsonInput) {
    const parsedAction = JSON.parse(jsonInput);

    if (!("action" in parsedAction) || !("time" in parsedAction)) {
      throw new Error("Action input must contain 2 keys `action` and `time`");
    }

    const { action, time } = parsedAction;

    if (typeof action !== "string") {
      throw new Error("`action` must be a string");
    }

    if (isNaN(time)) {
      throw new Error("`time` must be a number");
    }

    if (time <= 0) {
      throw new Error("`time` must be greater than 0");
    }

    this.stats[action] = this.stats[action] || { count: 0, time: 0 };
    this.stats[action].count += 1;
    this.stats[action].time += time;
  }

  getStats() {
    const result = Object.entries(this.stats).map(
      ([action, { time, count }]) => {
        const avg = count ? parseFloat(((time * 1.0) / count).toFixed(2)) : 0;

        return { action, avg };
      }
    );

    return JSON.stringify(result, null, 2);
  }
}

module.exports = Actions;
