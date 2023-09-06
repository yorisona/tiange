/**
 * 客户详情 - 基本信息区块
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-10-28 13:49:12
 */
import { computed, defineComponent, h, PropType } from '@vue/composition-api';
import { CustomerShop } from '@/types/tiange/customer';
import TgBlock from '@/layouts/block';
import TgIcon from '@/components/IconFont/tg.vue';
import { ShopType } from '@/types/tiange/customer.enum';
import { companyTypeFormat, customerClassList } from '@/utils/format';
import { BusinessTypeMap, newCategoryFormate } from '@/types/tiange/common';
import { fillEmptyStr } from '@/utils/string';
import { getChromeVersion } from '@/utils/browser';
import { RIGHT_CODE } from '@/const/rightCode';
import { HasPermission } from '@/use/permission';

const version = getChromeVersion();

export default defineComponent({
  props: {
    customer: {
      type: Object as PropType<CustomerShop>,
      required: true,
    },
  },
  setup() {
    const isClassFallback = computed(() => version !== false && version <= 84);
    const Permission = computed(() => {
      const canEdit = HasPermission(RIGHT_CODE.customer_edit);
      const canDelete = HasPermission(RIGHT_CODE.customer_delete);

      return { canEdit, canDelete };
    });

    return { isClassFallback, Permission };
  },
  render() {
    const { customer } = this;
    const {
      shop_type,
      category,
      company_type,
      customer_class,
      addr_province,
      addr_town,
      addr_county,
      addr_detail,
      // mobile,
      // wechat,
    } = customer;

    const businessTypeStr = customer.business_type
      .map(item => BusinessTypeMap.get(item) ?? '')
      .filter(el => el !== '')
      .join('、');

    const shopIcon =
      shop_type === ShopType.Taobao ? (
        <TgIcon name="ico-taobao" />
      ) : shop_type === ShopType.Tmall ? (
        <TgIcon name="ico-tmall" />
      ) : shop_type === ShopType.Douyin ? (
        <TgIcon name="ico-douyin" />
      ) : shop_type === ShopType.wechat_video ? (
        <TgIcon name="ico-douyin" />
      ) : (
        h('')
      );

    const address = [addr_province ?? '', addr_town ?? '', addr_county ?? '', addr_detail ?? '']
      .filter(el => el !== '')
      .join(' ');

    const billing = (
      <el-popover
        placement="bottom-start"
        width="330"
        trigger="click"
        popper-class="detail-step-popover-wrapper"
      >
        <div class="detail-step-popover-wrapper-hd">财务信息</div>
        <div class="detail-step-popover-wrapper-line"></div>
        <div class="step-popover-wrapper">
          <span class="step-popover-wrapper-row-label">公司开票抬头：</span>
          <span class="step-popover-wrapper-row-content">
            {fillEmptyStr(customer.invoice_title)}
          </span>
          <span class="step-popover-wrapper-row-label">纳税人识别号：</span>
          <span class="step-popover-wrapper-row-content">
            {fillEmptyStr(customer.invoice_number)}
          </span>
          <span class="step-popover-wrapper-row-label">开户行：</span>
          <span class="step-popover-wrapper-row-content">
            {fillEmptyStr(customer.invoice_bank)}
          </span>
          <span class="step-popover-wrapper-row-label">账号：</span>
          <span class="step-popover-wrapper-row-content">
            {fillEmptyStr(customer.invoice_account)}
          </span>
          <span class="step-popover-wrapper-row-label">电话：</span>
          <span class="step-popover-wrapper-row-content">
            {fillEmptyStr(customer.invoice_phone)}
          </span>
          <span class="step-popover-wrapper-row-label">地址：</span>
          <span class="step-popover-wrapper-row-content">
            {fillEmptyStr(customer.invoice_addr)}
          </span>
        </div>
        <a slot="reference">点击查看财务信息</a>
      </el-popover>
    );

    const fields = [
      [
        <div class="base-grid-item-lbl" style="width: 90px">
          店铺类目
        </div>,
        <div class="base-grid-item-content">{newCategoryFormate(category)}</div>,
      ],
      [
        <div class="base-grid-item-lbl">店铺品牌</div>,
        <div class="base-grid-item-content">{fillEmptyStr(customer.brand_name)}</div>,
      ],
      [
        <div class="base-grid-item-lbl">客户分类</div>,
        <div class="base-grid-item-content">
          {customer_class ? customerClassList[customer_class].value : '--'}
        </div>,
      ],
      [
        <div class="base-grid-item-lbl" style="width: 90px">
          客户类型
        </div>,
        <div class="base-grid-item-content">{companyTypeFormat({ company_type })}</div>,
      ],
      [
        <div class="base-grid-item-lbl">公司名称</div>,
        <span>
          {customer.companies.map(item => {
            return <span key={item.company_id}>{item.company_name} </span>;
          })}
        </span>,
      ],
      // [
      //   <div class="base-grid-item-lbl" style="width: 90px">
      //     客户姓名
      //   </div>,
      //   <div class="base-grid-item-content">{fillEmptyStr(customer.customer_name)}</div>,
      // ],

      [
        <div class="base-grid-item-lbl">业务类型</div>,
        <div class="base-grid-item-content">
          <def-text content={businessTypeStr}></def-text>
        </div>,
      ],
      [
        <div class="base-grid-item-lbl" style="width: 90px">
          客户地址
        </div>,
        <div class="base-grid-item-content">{fillEmptyStr(address)}</div>,
      ],
      [<div class="base-grid-item-lbl">财务信息</div>, billing],
      // [
      //   <div class="base-grid-item-lbl">客户经理</div>,
      //   <div class="base-grid-item-content">
      //     {fillEmptyStr(customer.manager_infos.map(item => item.username).join(','))}
      //   </div>,
      // ],
      // [
      //   <div class="base-grid-item-lbl" style="width: 90px">
      //     手机号/微信号
      //   </div>,
      //   <div class="base-grid-item-content">
      //     {fillEmptyStr(mobile) + '/' + fillEmptyStr(wechat)}
      //   </div>,
      // ],
    ];

    // 编辑按钮
    const editProps = {
      nativeOn: {
        click: () => {
          this.$emit('edit');
        },
      },
    };

    // 删除按钮
    const deleteProps = {
      nativeOn: {
        click: () => {
          this.$emit('delete');
        },
      },
      style: {
        ...(this.isClassFallback ? { marginLeft: '12px' } : {}),
      },
    };

    const props = {
      class: 'customer-shop-detail-base-block',
    };

    return h(TgBlock, props, [
      <div class="customer-shop-detail-base-block-hd">
        {shopIcon}
        <span class="name">{customer.shop_name}</span>
        <div class="more-btns">
          {this.Permission.canEdit ? <TgIcon name="ico-edit" {...editProps} /> : ''}
          {this.Permission.canDelete ? <TgIcon name="ico-delete" {...deleteProps} /> : ''}
        </div>
      </div>,
      <div class="base-grid">
        {fields.map(([key, val]) => (
          <div class="base-grid-item">
            {key}：{val}
          </div>
        ))}
      </div>,
    ]);
  },
});
