import {readFileSync} from 'node:fs';
import * as input from './inputs/model-tensors.mjs';

const source=JSON.parse(readFileSync(new URL('./inputs/model-tensors.json',import.meta.url),'utf8'));
console.log(JSON.stringify({名称:'训练导出和接收端特征口',首项:source['shape'],字段:Object.keys(source),取数函数:Object.keys(input)},null,2));
