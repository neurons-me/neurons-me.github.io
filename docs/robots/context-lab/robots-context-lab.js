// Robots that Understand Context — browser port of
// https://github.com/neurons-me/.me/blob/main/Typescript/tests/Demos/Robots_Contexts.ts
// Same data, policies, filters, asserts and explain() as the script; console.log is replaced by
// `out(text)` and node:assert by `check(...)`, and `hook(...)` reports structure for the page.
// Running runScript(ME, { out: console.log }) in Node reproduces the script's stdout byte for byte.

export const ROBOTS = ["loader", "nurse", "courier", "surgeon"];

export const POLICIES = [
  ["canLift", "target.massKg < liftCapacityKg"],
  ["needsSoftGrip", "target.fragile && (context.pickupZone || context.precisionZone || requiresPrecisionGrip)"],
  ["softGripReady", "!needsSoftGrip || hasSoftGrip"],
  ["needsSterileHandling", "context.sterileZone && !target.sterile"],
  ["needsSterileClearance", "requiresTargetSterile && !target.sterile"],
  ["mustYield", "context.movingVehicles"],
  ["contextAllowsMotion", "!mustYield"],
  ["needsHumanReview", "needsSterileHandling || needsSterileClearance || mustYield"],
  ["canProceed", "canLift && softGripReady && !needsHumanReview && contextAllowsMotion"],
];

function isDeepStrictEqual(a, b) {
  if (Object.is(a, b)) return true;
  if (typeof a !== "object" || typeof b !== "object" || a === null || b === null) return false;
  if (Array.isArray(a) !== Array.isArray(b) || Object.getPrototypeOf(a) !== Object.getPrototypeOf(b)) return false;
  const ka = Object.keys(a), kb = Object.keys(b);
  return ka.length === kb.length && ka.every((k) => Object.prototype.hasOwnProperty.call(b, k) && isDeepStrictEqual(a[k], b[k]));
}

export function runScript(ME, { out = () => {}, hook = () => {}, check } = {}) {
  const results = [];
  const record = (source, pass, actual) => {
    const r = { source, pass, actual };
    results.push(r);
    hook("assert", r);
    if (check) check(r);
    else if (!pass) throw new Error("Assertion failed: " + source + " (actual " + JSON.stringify(actual) + ")");
  };
  const assert = {
    equal: (actual, expected, source) => record(source, Object.is(actual, expected), actual),
    deepEqual: (actual, expected, source) => record(source, isDeepStrictEqual(actual, expected), actual),
    ok: (value, source) => record(source, !!value, value),
  };

  const me = new ME();

  me["@"]("robot-context-lab");

  function section(title) {
    hook("section", title);
    out(`\n${"=".repeat(80)}`);
    out(`  ${title}`);
    out(`${"=".repeat(80)}\n`);
  }

  function note(text) {
    hook("note", text);
    out(`  • ${text}`);
  }

  function formatValue(value) {
    return value === undefined ? "undefined" : JSON.stringify(value, null, 2);
  }

  function show(label, value) {
    hook("show", { label, value });
    out(`  ${label}`);
    out(
      "    → " +
        formatValue(value)
          .split("\n")
          .map((line, index) => (index === 0 ? line : "    " + line))
          .join("\n"),
    );
  }

  function explainPrintable(path) {
    const trace = me.explain(path);
    const printable = {
      value: trace.value,
      expression: trace.derivation?.expression ?? null,
      inputs: (trace.derivation?.inputs ?? []).map((input) => ({
        label: input.label,
        value: input.masked ? "MASKED" : input.value,
        origin: input.origin,
      })),
      dependsOn: trace.meta?.dependsOn ?? [],
    };
    return { trace, printable };
  }

  function showExplain(path) {
    const { trace, printable } = explainPrintable(path);
    hook("explain", { path, printable });

    out(`\n  explain("${path}")`);
    out(
      "    → " +
        JSON.stringify(printable, null, 2)
          .split("\n")
          .map((line, index) => (index === 0 ? line : "    " + line))
          .join("\n"),
    );

    return trace;
  }

  function pad(value, width) {
    const text = String(value ?? "—");
    return text.length >= width ? text.slice(0, width) : text.padEnd(width, " ");
  }

  function canisterSnapshot() {
    return {
      name: me("objects.canister7.name"),
      massKg: me("objects.canister7.massKg"),
      fragile: me("objects.canister7.fragile"),
      sterile: me("objects.canister7.sterile"),
    };
  }

  function contextSnapshot(name) {
    return {
      name: me(`contexts.${name}.name`),
      pickupZone: me(`contexts.${name}.pickupZone`),
      sterileZone: me(`contexts.${name}.sterileZone`),
      precisionZone: me(`contexts.${name}.precisionZone`),
      movingVehicles: me(`contexts.${name}.movingVehicles`),
    };
  }

  function robotSnapshot(name) {
    return {
      name: me(`robots.${name}.name`),
      context: me(`robots.${name}.context.name`),
      target: me(`robots.${name}.target.name`),
      liftCapacityKg: me(`robots.${name}.liftCapacityKg`),
      hasSoftGrip: me(`robots.${name}.hasSoftGrip`),
      requiresTargetSterile: me(`robots.${name}.requiresTargetSterile`),
      requiresPrecisionGrip: me(`robots.${name}.requiresPrecisionGrip`),
      canLift: me(`robots.${name}.canLift`),
      needsSoftGrip: me(`robots.${name}.needsSoftGrip`),
      softGripReady: me(`robots.${name}.softGripReady`),
      needsSterileHandling: me(`robots.${name}.needsSterileHandling`),
      needsSterileClearance: me(`robots.${name}.needsSterileClearance`),
      mustYield: me(`robots.${name}.mustYield`),
      needsHumanReview: me(`robots.${name}.needsHumanReview`),
      canProceed: me(`robots.${name}.canProceed`),
    };
  }

  // The same cells showRobotMap() prints, as data (the page renders them as an HTML table).
  function robotMapRows() {
    return ROBOTS.map((id) => {
      const canProceed = me(`robots.${id}.canProceed`);
      const needsReview = me(`robots.${id}.needsHumanReview`);
      const sterileCheck =
        me(`robots.${id}.needsSterileHandling`) || me(`robots.${id}.needsSterileClearance`);
      return {
        id,
        robot: me(`robots.${id}.name`),
        context: me(`robots.${id}.context.name`),
        lift: me(`robots.${id}.canLift`) ? "✓ OK" : "✗ BLK",
        soft: me(`robots.${id}.needsSoftGrip`) ? "● YES" : "○ NO",
        sterile: sterileCheck ? "● CHK" : "○ OK",
        yield: me(`robots.${id}.mustYield`) ? "● YES" : "○ NO",
        review: needsReview ? "● YES" : "○ NO",
        proceed: canProceed ? "✓ YES" : "✗ NO",
      };
    });
  }

  function showRobotMap(title) {
    const rows = robotMapRows();
    hook("map", { title, rows });
    out(`\n  ${title}`);

    const cols = { robot: 14, context: 26, lift: 7, soft: 7, sterile: 9, yield: 7, review: 8, proceed: 9 };
    const draw = (char, len) => char.repeat(len);
    const cell = (text, width) => pad(text, width);
    const keys = Object.keys(cols);
    const rule = (l, m, r) => `    ${l}${keys.map((k) => draw("─", cols[k])).join(m)}${r}`;

    out(rule("┌", "┬", "┐"));
    out(`    │${cell("ROBOT", cols.robot)}│${cell("CONTEXT", cols.context)}│${cell("LIFT", cols.lift)}│${cell("SOFT", cols.soft)}│${cell("STERILE", cols.sterile)}│${cell("YIELD", cols.yield)}│${cell("REVIEW", cols.review)}│${cell("PROCEED", cols.proceed)}│`);
    out(rule("├", "┼", "┤"));
    for (const r of rows) out(`    │${keys.map((k) => cell(r[k], cols[k])).join("│")}│`);
    out(rule("└", "┴", "┘"));
  }

  function defineRobot(id, input) {
    me.robots[id].name(input.name);
    me.robots[id].liftCapacityKg(input.liftCapacityKg);
    me.robots[id].hasSoftGrip(input.hasSoftGrip);
    me.robots[id].requiresTargetSterile(input.requiresTargetSterile);
    me.robots[id].requiresPrecisionGrip(input.requiresPrecisionGrip);
    me.robots[id].target["->"]("objects.canister7");
    me.robots[id].context["->"](input.contextPath);
  }

  function applyRobotPolicies() {
    for (const [name, expression] of POLICIES) me.robots["[i]"]["="](name, expression);
  }

  out(`
+======================================================================+
| .me DEMO - Robots that Understand Context                            |
| Same object → Different meaning depending on robot + environment     |
+======================================================================+
`);

  section("1. Shared Physical Object");
  note("All robots point to the exact same canister.");
  note("We print an explicit snapshot so the demo never shows undefined roots.");

  me.objects.canister7.name("Blue Canister");
  me.objects.canister7.massKg(6);
  me.objects.canister7.fragile(true);
  me.objects.canister7.sterile(false);

  show("objects.canister7", canisterSnapshot());

  section("2. Different Contexts");
  note("The object is stable; the environment changes the meaning.");
  note("SurgeonBot gets a stricter operating room context.");

  me.contexts.warehouse.name("Warehouse Inbound");
  me.contexts.warehouse.pickupZone(true);
  me.contexts.warehouse.sterileZone(false);
  me.contexts.warehouse.precisionZone(false);
  me.contexts.warehouse.movingVehicles(false);

  me.contexts.hospital.name("Hospital Sterile Corridor");
  me.contexts.hospital.pickupZone(false);
  me.contexts.hospital.sterileZone(true);
  me.contexts.hospital.precisionZone(false);
  me.contexts.hospital.movingVehicles(false);

  me.contexts.street.name("Street Crossing");
  me.contexts.street.pickupZone(false);
  me.contexts.street.sterileZone(false);
  me.contexts.street.precisionZone(false);
  me.contexts.street.movingVehicles(true);

  me.contexts.operatingRoom.name("Operating Room");
  me.contexts.operatingRoom.pickupZone(false);
  me.contexts.operatingRoom.sterileZone(true);
  me.contexts.operatingRoom.precisionZone(true);
  me.contexts.operatingRoom.movingVehicles(false);

  show("contexts.warehouse", contextSnapshot("warehouse"));
  show("contexts.hospital", contextSnapshot("hospital"));
  show("contexts.street", contextSnapshot("street"));
  show("contexts.operatingRoom", contextSnapshot("operatingRoom"));

  section("3. Robots + Pointers");
  note("All four robots point to the same object, but through different contexts.");

  defineRobot("loader", { name: "Loader-1", liftCapacityKg: 20, contextPath: "contexts.warehouse", hasSoftGrip: true, requiresTargetSterile: false, requiresPrecisionGrip: false });
  defineRobot("nurse", { name: "NurseBot-2", liftCapacityKg: 12, contextPath: "contexts.hospital", hasSoftGrip: false, requiresTargetSterile: false, requiresPrecisionGrip: false });
  defineRobot("courier", { name: "Courier-3", liftCapacityKg: 18, contextPath: "contexts.street", hasSoftGrip: false, requiresTargetSterile: false, requiresPrecisionGrip: false });
  defineRobot("surgeon", { name: "SurgeonBot-4", liftCapacityKg: 10, contextPath: "contexts.operatingRoom", hasSoftGrip: true, requiresTargetSterile: true, requiresPrecisionGrip: true });

  show("robots.loader.target.name", me("robots.loader.target.name"));
  show("robots.nurse.target.name", me("robots.nurse.target.name"));
  show("robots.courier.target.name", me("robots.courier.target.name"));
  show("robots.surgeon.target.name", me("robots.surgeon.target.name"));

  section("4. Context-Aware Policies");
  note("Loader cares about pickup grip.");
  note("NurseBot cares about sterile context.");
  note("Courier cares about traffic.");
  note("SurgeonBot is stricter: sterile target + precision grip.");

  applyRobotPolicies();

  show("robots.loader", robotSnapshot("loader"));
  show("robots.nurse", robotSnapshot("nurse"));
  show("robots.courier", robotSnapshot("courier"));
  show("robots.surgeon", robotSnapshot("surgeon"));
  showRobotMap("Robot map BEFORE live updates");

  const softGripNames = me("robots[needsSoftGrip == true].name");
  const sterileNames = me("robots[needsSterileHandling == true].name");
  const yieldNames = me("robots[mustYield == true].name");

  show("robots[needsSoftGrip == true].name", softGripNames);
  show("robots[needsSterileHandling == true].name", sterileNames);
  show("robots[mustYield == true].name", yieldNames);
  show("robots[canProceed == true].name", me("robots[canProceed == true].name"));

  assert.equal(me("robots.loader.canProceed"), true, 'assert.equal(me("robots.loader.canProceed"), true)');
  assert.equal(me("robots.nurse.canProceed"), false, 'assert.equal(me("robots.nurse.canProceed"), false)');
  assert.equal(me("robots.courier.canProceed"), false, 'assert.equal(me("robots.courier.canProceed"), false)');
  assert.equal(me("robots.surgeon.canProceed"), false, 'assert.equal(me("robots.surgeon.canProceed"), false)');
  assert.equal(softGripNames.loader, "Loader-1", 'assert.equal(softGripNames.loader, "Loader-1")');
  assert.equal(softGripNames.surgeon, "SurgeonBot-4", 'assert.equal(softGripNames.surgeon, "SurgeonBot-4")');
  assert.equal(sterileNames.nurse, "NurseBot-2", 'assert.equal(sterileNames.nurse, "NurseBot-2")');
  assert.equal(sterileNames.surgeon, "SurgeonBot-4", 'assert.equal(sterileNames.surgeon, "SurgeonBot-4")');
  assert.equal(yieldNames.courier, "Courier-3", 'assert.equal(yieldNames.courier, "Courier-3")');

  section("5. Live Updates");
  note("Changing the world → all robots re-evaluate automatically.");
  note("Sterilize the canister. Clear the street. The strict robot should also unlock.");

  me.objects.canister7.sterile(true);
  me.contexts.street.movingVehicles(false);
  applyRobotPolicies();

  show("objects.canister7 AFTER sterilization", canisterSnapshot());
  show("contexts.street AFTER traffic clears", contextSnapshot("street"));
  show("robots.nurse.canProceed", me("robots.nurse.canProceed"));
  show("robots.courier.canProceed", me("robots.courier.canProceed"));
  show("robots.surgeon.canProceed", me("robots.surgeon.canProceed"));
  show("robots[canProceed == true].name", me("robots[canProceed == true].name"));
  showRobotMap("Robot map AFTER live updates");

  assert.equal(me("robots.nurse.canProceed"), true, 'assert.equal(me("robots.nurse.canProceed"), true)');
  assert.equal(me("robots.courier.canProceed"), true, 'assert.equal(me("robots.courier.canProceed"), true)');
  assert.equal(me("robots.surgeon.canProceed"), true, 'assert.equal(me("robots.surgeon.canProceed"), true)');
  assert.deepEqual(me("robots[canProceed == true].name"), {
    loader: "Loader-1",
    nurse: "NurseBot-2",
    courier: "Courier-3",
    surgeon: "SurgeonBot-4",
  }, 'assert.deepEqual(me("robots[canProceed == true].name"), { loader: "Loader-1", nurse: "NurseBot-2", courier: "Courier-3", surgeon: "SurgeonBot-4" })');

  section("6. Explainability");
  const nurseTrace = showExplain("robots.nurse.canProceed");
  const surgeonTrace = showExplain("robots.surgeon.canProceed");

  assert.equal(nurseTrace.value, true, "assert.equal(nurseTrace.value, true)");
  assert.equal(surgeonTrace.value, true, "assert.equal(surgeonTrace.value, true)");
  assert.ok((nurseTrace.meta?.dependsOn ?? []).includes("robots.nurse.contextAllowsMotion"), 'assert.ok((nurseTrace.meta?.dependsOn ?? []).includes("robots.nurse.contextAllowsMotion"))');
  assert.ok((surgeonTrace.meta?.dependsOn ?? []).includes("robots.surgeon.softGripReady"), 'assert.ok((surgeonTrace.meta?.dependsOn ?? []).includes("robots.surgeon.softGripReady"))');
  assert.ok((surgeonTrace.meta?.dependsOn ?? []).includes("robots.surgeon.needsHumanReview"), 'assert.ok((surgeonTrace.meta?.dependsOn ?? []).includes("robots.surgeon.needsHumanReview"))');

  out(`
+======================================================================+
| ✓ DEMO COMPLETED - Robots truly understand context                   |
| - one shared object, multiple interpretations                        |
| - a stricter SurgeonBot adds precision + sterile requirements        |
| - declarative policies broadcast to all robots                       |
| - live reactivity updates every robot without new imperative code    |
| - the robot map makes the whole scene readable at a glance           |
+======================================================================+
`);

  // Handles for the interactive step on the page (same kernel instance, same functions).
  return { me, results, applyRobotPolicies, robotMapRows, canisterSnapshot, contextSnapshot, explainPrintable };
}
