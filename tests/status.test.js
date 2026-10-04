const test = require("node:test");
const assert = require("node:assert");
const request = require("supertest");

const app = require("../server");

test("GET /status returns the uptime in seconds", async () => {
  const res = await request(app).get("/status");

  assert.strictEqual(res.status, 200);
  assert.strictEqual(typeof res.body.uptime, "number");
  assert.ok(res.body.uptime >= 0);
});
