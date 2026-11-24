import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import test from 'node:test';
import { modelKernel, modelPatch, modelChannel } from '../inputs/model-tensors.mjs';

const data=JSON.parse(readFileSync(new URL('../inputs/model-tensors.json',import.meta.url),'utf8'));
test('训练导出和接收端特征口的格式与关联', () => {
  assert.ok(data.gamma.includes(0)&&data.gamma.some(v=>v<0));
  assert.ok(data.variance.every(v=>v>0));
  assert.ok(data.outputs%data.groupChannels===0);
  assert.equal(modelKernel(1).length,data.groupChannels*9);
  assert.equal(modelPatch([0,1]).length,data.shape[1]*data.shape[3]);
  assert.notDeepEqual(data.exports[0][2],data.exports[1][2]);
  assert.ok(data.workspace<data.shape.slice(1).reduce((a,b)=>a*b)*4);
  const ch=modelChannel(6);
  assert.equal(ch.gamma/Math.sqrt(ch.var+data.eps),1);
  assert.equal(modelChannel(0).gamma<0,true);
});
