/*
 * @Description: file content
 * @Author: 白青
 * @Date: 2019-09-29 15:22:06
 * @LastEditTime: 2021-07-28 17:48:08
 * @LastEditors: 肖槿
 */
import { BusinessType, AreaType, KolTag, Platform, KolVerifyStatus } from '@/types/tiange/kol';

// 平台数据
/**
 * ```
 * label: '直发是否原创报价',  标签名
 * key: 'is_direct_original',   标签值对应字段
 * unit: '(元 / 篇)',         单位
 * dictionary:'directOriginalList',   数字对应的字典
 * showCondition:''       出现的条件
 * showLabel   在首部展示标签名字的
 * ```
 * @type {*[]}
 */
export const platformData: Platform[] = [
  {
    platformKey: 'tb',
    platformName: '淘宝',
    platSelected: true,
    detailKey: 'kol_tb_info',
    key_avatar: 'avatar',
    // 基础信息
    baseInfo: [
      {
        label: '昵称',
        key: 'star_name',
        name: true,
      },
      {
        label: '淘宝ID',
        key: 'star_id',
      },
      {
        label: '粉丝数(万)',
        key: 'fans_number',
      },
      {
        label: '所属机构',
        key: 'company_id',
        type: 'select',
      },
    ],
    // 媒介类型信息
    mediumTypeInfo: [
      {
        mediumName: '直播',
        info: [
          {
            label: '专场成本价',
            key: 'star_special_cost',
            unit: '(元 / 场)',
          },
          {
            label: '专场刊例价',
            key: 'star_special_price',
            unit: '(元 / 场)',
          },

          {
            label: '混播成本价',
            key: 'star_mix_cost',
            unit: '(元 / 链接)',
          },
          {
            label: '混播刊例价',
            key: 'star_mix_price',
            unit: '(元 / 链接)',
          },
        ],
        otherInfo: [
          {
            label: '配合度',
            key: 'responsivity',
            showCondition: 'is_cooperation',
          },
          {
            label: '单客价',
            key: 'sales_price_period',
            showCondition: 'is_cooperation',
          },
          {
            label: '淘客ID',
            key: 'wangwang_name',
            showCondition: 'is_cooperation',
          },

          {
            label: '平均观看(PV)',
            key: 'pv_average',
            showCondition: '',
          },
        ],
      },
      {
        mediumName: '视频',
        info: [
          {
            label: '视频成本价',
            key: 'video_price',
            unit: '(元 / 条)',
          },
          {
            label: '视频刊例价',
            key: 'video_publish_price',
            unit: '(元 / 条)',
          },
        ],
      },
      {
        mediumName: '图文',
        info: [
          {
            label: '图文成本价',
            key: 'photo_price',
            unit: '(元 / 篇)',
          },
          {
            label: '图文刊例价',
            key: 'photo_publish_price',
            unit: '(元 / 篇)',
          },
        ],
      },
    ],
  },
  {
    platformKey: 'douyin',
    platformName: '抖音',
    platSelected: false,
    detailKey: 'kol_douyin_info',
    key_avatar: 'avatar',
    // 基础信息
    baseInfo: [
      {
        label: '昵称',
        key: 'douyin_name',
        name: true,
      },
      {
        label: '抖音号',
        key: 'douyin_id',
        name: true,
      },
      {
        label: '粉丝数(万)',
        key: 'fans_number',
      },
      {
        label: '获赞数(万)',
        key: 'praise_number',
      },
      {
        label: '所属机构',
        key: 'company_id',
        type: 'select',
      },
      {
        label: '商品橱窗上架价格(元)',
        key: 'shopwindow_price',
      },
      {
        label: '纯佣最低佣金比例',
        key: 'pure_commission_min_percent',
      },
      {
        label: '打包最低佣金比例',
        key: 'package_price_min_percent',
      },
      {
        label: '短视频+直播打包坑位费',
        key: 'short_video_liver_price',
      },
    ],
    // 媒介类型信息
    mediumTypeInfo: [
      {
        mediumName: '直播',
        info: [
          {
            label: '专场成本价',
            key: 'live_special_price',
            unit: '(元 / h)',
          },
          {
            label: '专场最低佣金比例',
            key: 'special_commission_min_percent',
            unit: '%',
          },
          {
            label: '专场是否需要佣金',
            key: 'is_special_commission',
            unit: '',
          },
          {
            label: '混播场是否需要佣金',
            key: 'is_mix_commission',
            unit: '',
          },
          {
            label: '混播单链接成本价',
            key: 'live_mix_price',
            unit: '(元 / 链接)',
          },
          {
            label: '混播场最低佣金比例',
            key: 'mix_min_commission_percent',
            unit: '(元 / 链接)',
          },
          {
            label: '专场刊例价',
            key: 'live_special_publish_price',
            unit: '(元 / h)',
          },
          {
            label: '专场最高链接数',
            key: 'special_max_url',
            unit: '(条)',
          },
          {
            label: '混播单链接刊例价',
            key: 'live_mix_publish_price',
            unit: '(元 / 链接)',
          },
        ],
      },
      {
        mediumName: '视频',
        info: [
          {
            label: '1-20s视频成本价',
            key: 'video_1_20_price',
            unit: '(元 / 条)',
          },
          {
            label: '1-20s视频刊例价',
            key: 'video_1_20_publish_price',
            unit: '(元 / 条)',
          },
          {
            label: '1-20s星图后台价',
            key: 'video_1_20_star_map_price',
            unit: '(元 / 条)',
          },
          {
            label: '星图返点比例',
            key: 'star_map_rebate_percent',
            unit: '%',
          },
          {
            label: '21-60s视频成本价',
            key: 'video_21_60_price',
            unit: '(元 / 条)',
          },
          {
            label: '21-60s视频刊例价',
            key: 'video_21_60_publish_price',
            unit: '(元 / 条)',
          },
          {
            label: '21-60s星图后台价',
            key: 'video_21_60_star_map_price',
            unit: '(元 / 条)',
          },
        ],
      },
    ],
  },
  {
    platformKey: 'xhs',
    platformName: '小红书',
    platSelected: false,
    detailKey: 'kol_xhs_info',
    key_avatar: 'avatar',
    // 基础信息
    baseInfo: [
      {
        label: '昵称',
        key: 'xhs_name',
        name: true,
      },
      {
        label: '小红书号',
        key: 'xhs_id',
      },
      {
        label: '粉丝数(万)',
        key: 'fans_number',
      },
      {
        label: '所属机构',
        key: 'company_id',
        type: 'select',
      },
      {
        showLabel: '是否品牌合作人',
        key: 'is_partner',
      },
    ],
    // 媒介类型信息
    mediumTypeInfo: [
      {
        mediumName: '直播',
        info: [
          {
            label: '直播成本价',
            key: 'live_cost_price',
          },
          {
            label: '直播刊例价',
            key: 'live_publish_price',
          },
        ],
      },
      {
        mediumName: '视频',
        info: [
          {
            label: '视频成本价',
            key: 'video_price',
            unit: '(元 / 条)',
          },
          {
            label: '视频刊例价',
            key: 'video_publish_price',
            unit: '(元 / 条)',
          },
          {
            label: '品牌合作人后台视频报价',
            key: 'brand_partner_video_price',
            unit: '(元 / 条)',
          },
        ],
      },

      {
        mediumName: '图文',
        info: [
          {
            label: '图文成本价',
            key: 'photo_price',
            unit: '(元 / 篇)',
          },
          {
            label: '图文刊例价',
            key: 'photo_publish_price',
            unit: '(元 / 篇)',
          },
          {
            label: '品牌合作人后台图文报价',
            key: 'brand_partner_image_text_price',
            unit: '(元 / 篇)',
          },
        ],
      },
    ],
  },
  {
    platformKey: 'kuaishou',
    platformName: '快手',
    platSelected: false,
    detailKey: 'kol_kuaishou_info',
    key_avatar: 'avatar',
    // 基础信息
    baseInfo: [
      {
        label: '昵称',
        key: 'kuaishou_name',
        name: true,
      },
      {
        label: '快手号',
        key: 'kuaishou_id',
      },
      {
        label: '粉丝数(万)',
        key: 'fans_number',
      },
      {
        label: '所属机构',
        key: 'company_id',
        type: 'select',
      },
    ],
    // 媒介类型信息
    mediumTypeInfo: [
      {
        mediumName: '直播',
        info: [
          {
            label: '专场成本价',
            key: 'live_special_price',
            unit: '(元 / 场)',
          },
          {
            label: '专场刊例价',
            key: 'live_special_publish_price',
            unit: '(元 / 场)',
          },
          {
            label: '混播成本价',
            key: 'live_mix_price',
            unit: '(元 / 链接)',
          },
          {
            label: '混播刊例价',
            key: 'live_mix_publish_price',
            unit: '(元 / 链接)',
          },
        ],
      },
      {
        mediumName: '视频',
        info: [
          {
            label: '视频成本价',
            key: 'video_price',
            unit: '(元 / 条)',
          },
          {
            label: '视频刊例价',
            key: 'video_publish_price',
            unit: '(元 / 条)',
          },
        ],
      },
    ],
  },
  {
    platformKey: 'weibo',
    platformName: '微博',
    platSelected: false,
    detailKey: 'kol_weibo_info',
    key_avatar: 'avatar',
    // 基础信息
    baseInfo: [
      {
        label: '微博账号',
        key: 'weibo_name',
        name: true,
      },
      {
        label: '粉丝数(万)',
        key: 'fans_number',
      },
      {
        label: '所属机构',
        key: 'company_id',
        type: 'select',
      },
    ],
    // 媒介类型信息
    mediumTypeInfo: [
      {
        mediumName: '图文',
        info: [
          {
            label: '转发成本价',
            key: 'trans_price',
            unit: '(元 / 篇)',
          },
          {
            label: '转发刊例价',
            key: 'trans_publish_price',
            unit: '(元 / 篇)',
          },
          {
            label: '直发成本价',
            key: 'direct_price',
            unit: '(元 / 篇)',
          },
          {
            label: '直发刊例价',
            key: 'direct_publish_price',
            unit: '(元 / 篇)',
          },
        ],
        otherInfo: [
          {
            label: '直发是否原创报价',
            key: 'is_direct_original',
            dictionary: 'directOriginalList',
            showCondition: '',
          },
        ],
      },
    ],
  },
  {
    platformKey: 'yizhibo',
    platformName: '一直播',
    platSelected: false,
    detailKey: 'kol_yizhibo_info',
    key_avatar: 'avatar',
    // 基础信息
    baseInfo: [
      {
        label: '昵称',
        key: 'yizhibo_name',
        name: true,
      },
      {
        label: '一直播ID',
        key: 'yizhibo_id',
      },
      {
        label: '粉丝数(万)',
        key: 'fans_number',
      },
      {
        label: '所属机构',
        key: 'company_id',
        type: 'select',
      },
    ],
    // 媒介类型信息
    mediumTypeInfo: [
      {
        mediumName: '直播',
        info: [
          {
            label: '直播成本价',
            key: 'price',
            unit: '(元 / 场)',
          },
          {
            label: '直播刊例价',
            key: 'live_publish_price',
            unit: '(元 / 场)',
          },
        ],
      },
    ],
  },
  {
    platformKey: 'bili',
    platformName: '哔哩哔哩',
    platSelected: false,
    detailKey: 'kol_bili_info',
    key_avatar: 'avatar',
    // 基础信息
    baseInfo: [
      {
        label: '昵称',
        key: 'bili_name',
        name: true,
      },
      {
        label: '哔哩哔哩号',
        key: 'bili_id',
      },
      {
        label: '粉丝数(万)',
        key: 'fans_number',
      },
      {
        label: '所属机构',
        key: 'company_id',
        type: 'select',
      },
    ],
    // 媒介类型信息
    mediumTypeInfo: [
      {
        mediumName: '视频',
        info: [
          {
            label: '视频成本价',
            key: 'video_price',
            unit: '(元 / 条)',
          },
          {
            label: '视频刊例价',
            key: 'video_publish_price',
            unit: '(元 / 条)',
          },
        ],
      },
    ],
  },
  {
    platformKey: 'wechat',
    platformName: '微信公众号',
    platSelected: false,
    detailKey: 'kol_wechat_info',
    key_avatar: 'avatar',
    // 基础信息
    baseInfo: [
      {
        label: '微信公众号',
        key: 'wechat_id',
        name: true,
      },
      {
        label: '粉丝数(万)',
        key: 'fans_number',
      },
      {
        label: '所属机构',
        key: 'company_id',
        type: 'select',
      },
      {
        showLabel: '是否原创',
        key: 'is_original',
      },
      {
        showLabel: '是否认证',
        key: 'is_certification',
      },
    ],
    // 媒介类型信息
    mediumTypeInfo: [
      {
        mediumName: '图文',
        info: [
          {
            label: '头条成本价',
            key: 'photo_headline_price',
            unit: '(元 / 篇)',
          },
          {
            label: '头条刊例价',
            key: 'photo_headline_publish_price',
            unit: '(元 / 篇)',
          },
          {
            label: '次条成本价',
            key: 'photo_second_price',
            unit: '(元 / 篇)',
          },
          {
            label: '次条刊例价',
            key: 'photo_second_publish_price',
            unit: '(元 / 篇)',
          },
        ],
      },
    ],
  },
];

export const directOriginalList = [
  {
    value: 1,
    text: '是',
  },
  {
    value: 0,
    text: '否',
  },
];

export const enum KolTagEnum {
  GRASS_KOL = 7, // 种草达人\
  LIVE_KOL = 8, // 直播达人
  TAOBAO_KOL = 9, // 淘宝kol
  TAOBAO_KOC = 10, // 淘宝koc
  DOUYIN_KOL = 11, // 抖音kol
  DOUYIN_KOC = 12, // 抖音koc
}

export const kolTagList = [
  {
    value: KolTagEnum.GRASS_KOL,
    label: '种草达人',
  },
  {
    value: KolTagEnum.LIVE_KOL,
    label: '直播达人',
  },
  {
    value: KolTagEnum.DOUYIN_KOL,
    label: '抖音KOL',
  },
  {
    value: KolTagEnum.DOUYIN_KOC,
    label: '抖音KOC',
  },
  {
    value: KolTagEnum.TAOBAO_KOL,
    label: '淘宝KOL',
  },
  {
    value: KolTagEnum.TAOBAO_KOC,
    label: '淘宝KOC',
  },
];
export const newKolTagList = [
  {
    label: '全部',
    value: 0,
  },
  {
    label: '主播',
    value: 1,
  },
  {
    label: '红人',
    value: 2,
  },
  {
    label: '明星',
    value: 3,
  },
  {
    label: 'KOL',
    value: 4,
  },
  {
    label: 'KOC',
    value: 5,
  },
  {
    label: '素人',
    value: 6,
  },
  {
    value: 7,
    label: '种草达人',
  },
  {
    value: 8,
    label: '直播达人',
  },
  {
    value: 9,
    label: 'KOL',
  },
];
// 擅长平台
export const platformList = [
  {
    value: '全部',
    type: 0,
    key: '',
  },
  {
    value: '小红书',
    type: 1,
    key: 'xhs',
    icon: 'iconfont icon-xiaohongshuicon',
  },
  {
    value: '微信公众号',
    type: 2,
    key: 'wechat',
    icon: 'iconfont icon-weixin',
  },
  {
    value: '新浪微博',
    type: 3,
    key: 'weibo',
    icon: 'iconfont icon-weibo',
  },
  {
    value: '抖音',
    type: 4,
    key: 'douyin',
    icon: 'iconfont icon-douyin',
  },
  {
    value: '淘宝',
    type: 7,
    key: 'tb',
    icon: 'iconfont icon-taobao',
  },
  {
    value: '快手',
    type: 5,
    key: 'kuaishou',
    icon: 'iconfont icon-kuaishou',
  },
  {
    value: '哔哩哔哩',
    type: 6,
    key: 'bili',
    icon: 'iconfont icon-bilibili',
  },
  {
    value: '一直播',
    type: 8,
    key: 'yizhibo',
    icon: 'iconfont icon-yizhibo',
  },
];
export const newPlatformList = [
  {
    label: '全部',
    value: '',
  },
  {
    label: '抖音',
    value: 'douyin',
  },
  {
    label: '淘宝',
    value: 'tb',
  },
  {
    label: '小红书',
    value: 'xhs',
  },
  {
    label: '快手',
    value: 'kuaishou',
  },
];
// 媒介类型
export const mediaType = [
  {
    value: '全部',
    type: 0,
    key: '',
  },
  {
    value: '直播',
    type: 1,
    key: 'live',
  },
  {
    value: '视频',
    type: 2,
    key: 'video',
  },
  {
    value: '图文',
    type: 3,
    key: 'photo',
  },
];

// 擅长领域
export const businessType: BusinessType[] = [
  {
    value: '营销业务',
    key: 1,
  },
  {
    value: '淘宝店铺',
    key: 2,
  },
];

// 擅长领域
export const areaType: AreaType[] = [
  {
    value: '美妆',
    key: 1,
  },
  {
    value: '生活',
    key: 2,
  },
  {
    value: '服饰',
    key: 3,
  },
  {
    value: '美食',
    key: 4,
  },
  {
    value: '母婴',
    key: 5,
  },
  {
    value: '数码',
    key: 6,
  },
  {
    value: '家装',
    key: 7,
  },
  {
    value: '健康',
    key: 8,
  },
  {
    value: '宠物',
    key: 9,
  },
  {
    value: '时尚',
    key: 10,
  },
  {
    value: '配饰',
    key: 11,
  },
  {
    value: '家电',
    key: 12,
  },
  {
    value: '测评',
    key: 13,
  },
  {
    value: '旅行',
    key: 14,
  },
  {
    value: '运动',
    key: 15,
  },
  {
    value: '摄影',
    key: 16,
  },
  {
    value: '情感',
    key: 17,
  },
  {
    value: '汽车',
    key: 18,
  },
  {
    value: '搞笑',
    key: 19,
  },
  {
    value: '教育',
    key: 20,
  },
  {
    value: '财经',
    key: 21,
  },
  {
    value: '萌娃',
    key: 22,
  },
  {
    value: '文化',
    key: 23,
  },
  {
    value: '影视',
    key: 24,
  },
  {
    value: '娱乐',
    key: 25,
  },
  {
    value: '游戏',
    key: 26,
  },
  {
    value: '海外',
    key: 27,
  },
  {
    value: '才艺',
    key: 28,
  },
  {
    value: '三农',
    key: 29,
  },
  {
    value: '二次元',
    key: 30,
  },
  {
    value: '高颜值',
    key: 31,
  },
];

// kol标签
export const kolTag: KolTag[] = [
  {
    value: '主播',
    key: 1,
  },
  {
    value: '红人',
    key: 2,
  },
  {
    value: '明星',
    key: 3,
  },
  {
    value: '达人',
    key: 4,
  },
  {
    value: 'koc',
    key: 5,
  },
  {
    value: '素人',
    key: 6,
  },
];

// 格式化KOL标签
export const kolTagFormat = (key: number) => kolTag.find(el => el.key === key)?.value;

export const enum KolVerifyStatusEnum {
  PENDING = 0,
  APPROVED = 1,
  NOT_APPROVED = -1,
}

export const kolVerifyStatus: KolVerifyStatus[] = [
  {
    label: '审核中',
    value: KolVerifyStatusEnum.PENDING,
  },
  {
    label: '已通过',
    value: KolVerifyStatusEnum.APPROVED,
  },
  {
    label: '未通过',
    value: KolVerifyStatusEnum.NOT_APPROVED,
  },
];

export const kolVerifyStatusFilter = [
  {
    label: '审核中',
    value: String(KolVerifyStatusEnum.PENDING),
  },
  {
    label: '已通过',
    value: String(KolVerifyStatusEnum.APPROVED),
  },
  {
    label: '未通过',
    value: String(KolVerifyStatusEnum.NOT_APPROVED),
  },
];

// 是否可以开专票
export const specialList = [
  {
    label: '是',
    value: 1,
  },
  {
    label: '否',
    value: 0,
  },
];
