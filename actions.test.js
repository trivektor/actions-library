const Actions = require("./actions");

describe("addAction", () => {
  test("should throw an error if input is not valid JSON", () => {
    const actions = new Actions();

    expect(() => {
      actions.addAction("");
    }).toThrow();
    expect(() => {
      actions.addAction("malformed action");
    }).toThrow();
  });

  test("should throw an error if JSON input is missing required keys (action and time)", () => {
    const actions = new Actions();

    try {
      actions.addAction(JSON.stringify({ action: "jump" }));
    } catch (err) {
      expect(err.message).toEqual(
        "Action input must contain 2 keys `action` and `time`"
      );
    }
  });

  test("should throw an error if action input is not a string", () => {
    const actions = new Actions();

    try {
      actions.addAction(JSON.stringify({ action: 100, time: "100" }));
    } catch (err) {
      expect(err.message).toEqual("`action` must be a string");
    }
  });

  test("should throw an error if time input is not a number", () => {
    const actions = new Actions();

    try {
      actions.addAction(JSON.stringify({ action: "jump", time: "100" }));
    } catch (err) {
      expect(err.message).toEqual("`time` must be a number");
    }
  });

  test("should throw an error if time input is not a postive number", () => {
    const actions = new Actions();

    try {
      actions.addAction(JSON.stringify({ action: "jump", time: -100 }));
    } catch (err) {
      expect(err.message).toEqual("`time` must be greater than 0");
    }
  });

  test("should not throw error if JSON input is well-formed", () => {
    const actions = new Actions();

    expect(() => {
      actions.addAction(JSON.stringify({ action: "jump", time: 100 }));
    }).not.toThrow();
  });
});

describe("getStats", () => {
  test("should return result as valid JSON", () => {
    const actions = new Actions();

    actions.addAction(JSON.stringify({ action: "jump", time: 100 }));
    actions.addAction(JSON.stringify({ action: "jump", time: 100 }));

    expect(() => {
      JSON.parse(actions.getStats());
    }).not.toThrow();
  });

  test("should return an array", () => {
    const actions = new Actions();

    actions.addAction(JSON.stringify({ action: "jump", time: 100 }));
    actions.addAction(JSON.stringify({ action: "jump", time: 100 }));

    expect(Array.isArray(JSON.parse(actions.getStats()))).toEqual(true);
  });

  test("should return an array of valid shape", () => {
    const actions = new Actions();

    actions.addAction(JSON.stringify({ action: "jump", time: 100 }));
    actions.addAction(JSON.stringify({ action: "jump", time: 100 }));

    const stats = JSON.parse(actions.getStats());

    expect(
      stats.every((entry) => {
        return "action" in entry && "avg" in entry;
      })
    ).toEqual(true);
  });

  test("should return valid stats", () => {
    const actions = new Actions();

    actions.addAction(JSON.stringify({ action: "jump", time: 100 }));
    actions.addAction(JSON.stringify({ action: "run", time: 75 }));
    actions.addAction(JSON.stringify({ action: "jump", time: 200 }));
    actions.addAction(JSON.stringify({ action: "swim", time: 300 }));
    actions.addAction(JSON.stringify({ action: "swim", time: 350 }));

    const statsJSON = actions.getStats();
    const stats = JSON.parse(statsJSON);

    const jump = stats.find(({ action }) => action === "jump");
    const run = stats.find(({ action }) => action === "run");
    const swim = stats.find(({ action }) => action === "swim");

    expect(jump.avg).toEqual(150);
    expect(run.avg).toEqual(75);
    expect(swim.avg).toEqual(325);
  });
});
