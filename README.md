# 同屏两指定位的分块相关体与亚像素回写

项目资料使用可独立读写的 JSON。Node.js 22.23.4 下运行 `npm ci --offline` 准备环境，然后运行 `npm run inspect` 检查合成数据字段，运行 `npm test` 校验样本引用及格式。

## 输入契约

每个 finger/query 候选提供面板单元、坐标和 feature，mask 指当前可见通道。相关分数为共同有效通道内积的平均，少于 minChannels 的槽不可确定；已声明永久遮挡的槽不参与。双指合法配对要求不同 cell，联合分数为两者相关分数和。配对权重以 exp(score/temperature) 归一化，在同一分布中分别求期望坐标、边际访问概率。画布笔位 asg 为两人可用的两个既有身份，margin 为同一联合分布下请求身份和互换身份的概率差门限。

## 资料读取

样本位于 `inputs/session.json`，其中 `events` 是按到达顺序记下的操作，编号从零开始。calibrate 指定标定修订，slots 按候选下标半开区间提供记录，read 指手指 ID，assign 请求在当前标定下把结果交给画布。
