declare module '*.css';
declare module '*.less';
declare module '*.scss';
declare module '*.sass';
declare module '*.svg';
declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif';
declare module '*.bmp';
declare module '*.tiff';
declare module 'omit.js';

type Environment = 'production' | 'development' | 'test' | 'pre' | 'staging';

/**
 * 给 process.env 补充类型声明
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-19 16:21:12
 */
declare namespace __WebpackModuleApi {
  interface NodeProcess {
    env: {
      /** 运行环境 */
      NODE_ENV: Environment;
      /** 端口 */
      PORT?: string;
      /** 版本哈希值 */
      VUE_APP_VERSION_HASH?: string;
      /** 接口地址 */
      VUE_APP_BASE_API: string;
      /** README版本 */
      VUE_APP_DEV_README_VER: string;
      /** README 地址 */
      VUE_APP_DEV_README_URL: string;
      /** README 阅读提示标题 */
      VUE_APP_DEV_README_TITLE: string;
      /** host 设置 */
      VUE_APP_DEV_SERVER_HOST?: string;
      /** Https Cert */
      VUE_APP_DEV_SERVER_HTTPS_CERT?: string;
      /** Https Key */
      VUE_APP_DEV_SERVER_HTTPS_KEY?: string;
      /** 是否启用 Https */
      VUE_APP_DEV_SERVER_HTTPS?: 'OFF' | 'ON';

      /**
       * ```
       * 是否禁用路由权限控制(显示全部路由)
       * ON---是(禁用权限控制，展示全部路由)
       * OFF---否(启用权限控制，根据权限展示路由) 默认
       * ```
       */
      VUE_APP_DEV_ROUTER_AUTH_DISABLE: 'OFF' | 'ON';
      /** 系统名称 */
      VUE_APP_NAME: string;
      /** 目标环境 */
      VUE_APP_TARGET_ENV: Environment;
      /** 图标字体 */
      VUE_APP_TG_ICON_FONT: string;
      /** 版本检查间隔 */
      VUE_APP_VERSION_CHECK_TIME: string;
      /** 用户信息轮询间隔 */
      VUE_APP_USER_INFO_UPDATE_TIME: string;
      /**
       * ```
       * 金额显示对齐风格
       * 除了右对齐，其它是凑数的
       * 不让小数点对齐的对齐方式，都不是严谨的金额数值显示方式
       * ```
       * @prop {string} center 居中
       * @prop {string} right 右对齐
       */
      VUE_APP_MONEY_ALIGN_STYLE: 'center' | 'right' | 'left';
      /** 移动端地址 **/
      VUE_APP_MOBILE_BASE_API: string;
      /** 公司名称(备案主体) */
      VUE_APP_COMPANY_NAME: string;
      /** 备案号 */
      VUE_APP_ICP_NO: string;
    };
  }
}
