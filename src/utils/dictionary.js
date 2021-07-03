// 直播状态
let zbState = [
  { label: "未开始", value: 1 },
  { label: "进行中", value: 2 },
  { label: "已结束", value: 3 },
];
// 实际直播状态
let actualZbState = {
  1: "未开始",
  2: "进行中",
  3: "已结束", // 已结束不满30分钟
  4: "已结束"
};
// 可选范围
let visRange = [
  {label: "全部可见", value: 1},
  {label: "指定可见", value: 2}
]


export default {
  zbState,
  actualZbState,
  visRange
}