/**
 * 客户管理接口地址
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-10-22 16:37:02
 */

/**
 * @Author: 矢车
 * @Date: 2021-01-18 15:45:08
 * @Description: 品牌id和名称列表
 */
export const GET_BRAND_LIST = '/api/brand/get_brand_list';

/**
 * 店铺(客户) - 新建
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-10-22 16:40:34
 * @param   method POST
 */
export const CUST_SAVE_CUSTOMER = '/api/cust/save_customer';

/**
 * 店铺(客户) - 编辑
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-10-22 16:40:34
 * @param   method POST
 */
export const CUST_UPDATE_CUSTOMER = '/api/cust/update_customer';

/**
 * 店铺(客户) - 删除
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-10-22 16:40:34
 * @param   method GET
 */
export const CUST_DEL_CUSTOMER = '/api/cust/del_customer';

/**
 * 营销业务/ 客户列表 - 查询
 * @author  wuyou <wuyou@goumee.com>
 * @since   2021-01-27 16:55:52
 * @param   method GET
 */
export const CUST_MARKETING_QUERY_CUSTOMER = '/api/cust/query_marketing_customer';

/**
 * 客户管理/ 客户列表 店铺(客户) - 查询
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-10-22 16:40:34
 * @param   method GET
 */
export const CUST_QUERY_CUSTOMER = '/api/cust/query_customer';

/**
 * 店铺(客户) - 导出
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-10-22 16:40:34
 * @param   method GET
 */
export const CUST_EXPORT_CUSTOMER = '/api/cust/export_customers';

/**
 * 查询店铺名称是否已存在
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-10-22 16:49:04
 * @param   method GET
 */
export const CUST_SHOP_NAME_EXIST = '/api/cust/shop_name_exist';

/**
 * 查询店铺所对应的公司
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-10-22 16:49:56
 * @param   method GET
 */
export const CUST_QUERY_SHOP_AND_COMPANY = '/api/cust/query_shop_and_company';

/**
 * 保存洽谈
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-10-22 16:51:03
 * @param   method POST
 */
export const CUST_SAVE_CONVERSATION = '/api/cust/save_conversation';

/**
 * 删除洽谈
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-10-22 16:51:03
 * @param   method POST
 */
export const CUST_DEL_CONVERSATION = '/api/cust/del_conversation';

/**
 * 查询洽谈
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-10-22 16:51:03
 * @param   method GET
 */
export const CUST_QUERY_CONVERSATION = '/api/cust/query_conversation';

/**
 * 查询公司ID
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-10-22 17:02:01
 * @param   method GET
 */
export const CUST_QUERY_COMPANY_IDS = '/api/cust/query_company_ids';

/**
 * 查询公司ID
 * @since   2021-04-22
 * @param   method GET
 */
export const GET_SHOP_LIVE_PROJECT_ID_LIST = '/api/shop_live/get_shop_live_project_id_list';

/**
 * 公司 - 列表
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-10-22 17:02:01
 * @param   method GET
 */
export const CUST_QUERY_COMPANY = '/api/cust/query_company';
/**
 * 整合营销 - 新建项目 - 查询公司列表
 */
export const CUST_MARKETING_QUERY_COMPANY = '/api/cust/marketing/query_company';

/**
 * 店铺代播 - 新建项目 - 查询公司列表
 */
export const CUST_SHOP_LIVE_QUERY_COMPANY = '/api/cust/shop_live/query_company';

/**
 * 本地生活 - 新建项目 - 查询公司列表
 */
export const CUST_LOCAL_LIFE_QUERY_COMPANY = '/api/cust/local_life/query_company';

/**
 * 供应链 - 新建项目 - 查询公司列表
 */
export const CUST_SUPPLY_CHAIN_QUERY_COMPANY = '/api/cust/supply_chain/query_company';
/**
 * 公司 - 新增/编辑
 * @author  John
 * @since   2021-08-03
 * @param   method POST
 */
export const CUST_SAVE_COMPANY = '/api/cust/save_company';

/**
 * 公司 - 批量删除
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-10-22 17:02:01
 * @param   method POST
 */
export const CUST_BATCH_DEL_COMPANY = '/api/cust/batch_del_company';

/**
 * 公司 - 导出
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-10-22 17:02:01
 * @param   method GET
 */
export const CUST_EXPORT_COMPANY = '/api/cust/export_company';

/**
 * 公司 - 详情
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-02 18:00:20
 */
export const CUST_COMPANY_DETAIL = '/api/cust/get_company/:id/';

/**
 * 查询店铺所对应的公司和品牌
 * @author  wuyou <wuyou@goumee.com>
 * @since   2020-12-30 16:32:16
 * @param   method GET
 */

export const CUST_QUERY_SHOP_AND_BRAND = '/api/cust/get_shop_and_brand';

/**
 * 查询看板客户列表
 * @param   method GET
 */
export const GET_BOARD_ACCOUNT_LIST = '/api/kanban/customers/';

/**
 * 修改看板账号状态
 * @param   method POST
 */
export const CHANGE_BOARD_ACCOUNT_STATUS = '/api/kanban/customers/changestatus/';

/**
 * 新建看板客户账号
 * @param   method POST
 */
export const ADD_BOARD_ACCOUNT = '/api/kanban/customers/';

/**
 * 看板客户账号密码重置
 * @param   method POST
 */
export const RESET_BOARD_ACCOUNT_PASSWORD = '/api/kanban/customers/resetpassword/';

/**
 * 查询供应商列表
 * @param   method GET
 */
export const SEARCH_PAY_WAY_ACCOUNT = '/api/approval/search_pay_way_account';

/**
 * 自动查询项目公司退款账号信息
 * @param   method GET
 */
export const GET_PROJECT_REFUND_ACCOUNT = '/api/approval/get_project_refund_account';

/**
 * 手动查询项目公司退款账号信息
 * @param   method GET
 */
export const SEARCH_REFUND_ACCOUNT = '/api/approval/search_refund_account';
/**
 * 对外付款获取关联审批单列表
 * @param   method GET
 */
export const LIST_BORROWING_FOR_PAY = '/api/approval/list_borrowing_for_pay';

/**
 * 对外付款业绩列表
 * @param   method GET
 */
export const LIST_PROJECT_ACHIEVEMENTS = '/api/approval/list_project_achievements';

/**
 * 垫款申请查询垫款客户
 * @param   method GET
 */
export const SEARCH_BORROWING_CUSTOMER = '/api/approval/search_borrowing_customer';

/**
 * 垫款申请查询供应商
 * @param   method GET
 */
export const SEARCH_BORROWING_SUPPLIER = '/api/approval/search_borrowing_supplier';

/**
 * 获取省市地区
 * @param   method GET
 */
export const BANK_REGION = '/api/cust/bank_region';

/**
 * 获取省市地区下的银行
 * @param   method GET
 */
export const LIST_BANKS = '/api/cust/list_banks';

/**
 * 新增/编辑 公司
 * @param   method GET
 */
export const SAVE_COMPANY_NEW = '/api/cust/save_company';
/**
 * 保存公司临时数据
 * @param   method post
 */
export const SAVE_TEMP_COMPANY_INFO = '/api/cust/save_tmp_company';
