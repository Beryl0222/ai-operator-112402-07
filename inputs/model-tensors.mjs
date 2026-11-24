import {readFileSync} from 'node:fs';
const data = JSON.parse(readFileSync(new URL('./model-tensors.json', import.meta.url), 'utf8'));
export function modelKernel(output) {
  return Int8Array.from({length: data.groupChannels * 9}, (_, j) =>
    ((Math.imul(output + 5, j * 997) + j * 13) % 37) - 17);
}
export function modelPatch([rowStart, rowEnd]) {
  const [,channels,,width] = data.shape;
  return Uint8Array.from({length: (rowEnd-rowStart)*channels*width}, (_, i) =>
    (Math.imul(rowStart*width+i+711, 0x45d9f3b) >>> 24) & 255);
}
export function modelChannel(output) {
  const cycle = i => i % data.gamma.length;
  return {mean:data.mean[output%data.mean.length],var:data.variance[cycle(output)],gamma:data.gamma[cycle(output)],
    beta:data.beta[output%data.beta.length],weightZero:output%7-3,weightScale:[1,-7],bias:output%13-6};
}
