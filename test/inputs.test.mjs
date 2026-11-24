import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const d = JSON.parse(readFileSync(new URL('../inputs/session.json', import.meta.url), 'utf8'));

test("查询及候选的特征掩码同宽", () => {
  assert.ok(d.candidates.every(c=>d.finger.some(f=>f.id===c.finger&&f.q.length===c.v.length&&f.mask.length===c.mask.length)));
});

test("合法候选发生共享单元竞争", () => {
  assert.ok(d.candidates[0].cell===d.candidates[2].cell&&d.candidates[0].finger!==d.candidates[2].finger);
});

test("实际通道缺失影响计算域", () => {
  assert.ok(d.candidates.some(c=>c.mask.includes(false))&&d.minChannels===2);
});
