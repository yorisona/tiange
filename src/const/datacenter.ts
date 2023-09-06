// 竞品店铺风格
export enum CompeteShopStyle {
  // 快时尚
  QuickFashion = 2,
  // 轻奢
  LightLuxury = 1,
  // 运动
  Sports = 3,
  // 其他
  Other = 4,
}

export const CompeteShopStyleOptions = [
  {
    label: '轻奢',
    value: CompeteShopStyle.LightLuxury,
  },
  { label: '快时尚', value: CompeteShopStyle.QuickFashion },
  { label: '运动', value: CompeteShopStyle.Sports },
  { label: '其他', value: CompeteShopStyle.Other },
];

export enum ESeason {
  // 春季
  Spring = 1,
  // 夏季
  Summer,
  // 秋季
  Autumn,
  // 冬季
  Winter,
}
export const SeasonOptions = [
  { label: '春季', value: ESeason.Spring },
  { label: '夏季', value: ESeason.Summer },
  { label: '秋季', value: ESeason.Autumn },
  { label: '冬季', value: ESeason.Winter },
];
