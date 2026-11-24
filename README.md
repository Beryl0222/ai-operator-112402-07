# 相机模型折叠批归一化的设备端等价发布

这里的训练导出和接收端特征口是用于设备联调的合成资料。使用 Node.js 22。运行 `npm ci --offline` 核对依赖锁，`npm run inspect` 查看资料字段，`npm test` 检查资料格式及相互引用。检视脚本只读取元数据。

## 数据格式

卷积按 NCHW 与 model.groupChannels，BN 参考为 (acc−mean) * gamma/sqrt(var+eps) + beta。tap 出现在 activation 前，deviceActivation 为 ReLU6 或 stepped，其中 stepped 阈值等号由设备表给定。权重按逐输出通道非对称 Q/DQ，偏置单位是 inputScale*channelWeightScale。输出区分诊断前特征浮点字节、终态 i8 或拒绝原因。每个设备只有 fixed 常量列表提供可表示比例，S1 累加 signed 24 位，S2 signed 32 位。融合应至少验证一处在默认档可执行的网络段；一律发布浮点模型超出 device 包约束。尺寸压力输入和探测图由 model-tensors.mjs 读出，旧版与新版以 exports 的图节点名及 channelMap 的对应为准。 stepped 表按 [门限,输出码] 给，取已跨过的最大门限。现行 wire 中的激活前 tap 有 preTolerance，终态按 postCodeTolerance 验收，但门限两侧及恰好平局仍按该设备规则。诊断口拒绝之后主接收者可另立版继续，只要其所有依存通过。 同一 S1 文件最多为每组保留 2 个宽通道，其余若无合规的折叠路径则拒绝该组。统计、权重、激活三种版本独立给出但打包器需要同一导出身份。误差合格的默认通道不得一律占用宽通道。

## 取数

`inputs/model-tensors.json` 保存标定、规格和调用记录。记录中的范围除明确说明外从零开始，使用半开区间。批量数组按调用记录列出的顺序交付。modelKernel(output)、modelChannel(output) 和 modelPatch([a,b]) 提供权重、统计与输入行。输入行内先按通道，再按 x。
