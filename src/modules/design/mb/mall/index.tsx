import { defineComponent, reactive } from '@vue/composition-api';
import { useRouteNameTabs } from '@/use/tab';
import { RouterNameMB } from '@/const/router';
import { usePermission } from '@/use/permission';
import { useRouter } from '@/use/vue-router';

export default defineComponent({
  watch: {
    $route: {
      handler(to) {
        this.checkDefault(to);
      },
      deep: true,
    },
  },
  setup() {
    const permission = usePermission();

    const tabs = useRouteNameTabs(
      [
        permission.mb_good_view && {
          label: '商品管理',
          value: RouterNameMB.mall.manage,
        },
        permission.mb_good_exchange_record_view && {
          label: '兑换明细',
          value: RouterNameMB.mall.detail,
        },
        permission.mb_good_present_record_view && {
          label: '赠送明细',
          value: RouterNameMB.mall.giftDetails,
        },
      ].filter(Boolean) as any,
      '',
      false,
    );

    const router = useRouter();
    const checkDefault = (to?: any) => {
      const permission = usePermission();
      let toName = to.name;

      // 如果是默认页即父路由, 就进行权限判断跳转到允许访问的第一个页面
      if (to.name === RouterNameMB.mall.default) {
        if (permission.mb_good_view) {
          toName = RouterNameMB.mall.manage;
        } else if (permission.mb_good_exchange_record_view) {
          toName = RouterNameMB.mall.detail;
        }
        router.replace({
          name: toName,
        });
        return;
      }
      tabs.updateChecked(toName);
    };
    checkDefault(router.currentRoute);
    const onTabChange = (value: any) => {
      console.log('tabs', tabs.checkedTab, value);
      if (tabs.checkedTab === value) return;
      tabs.onTabChange({ value } as any);
    };
    // checkDefault();
    return reactive({ tabs, checkDefault, onTabChange });
  },
  render() {
    const { tabs, onTabChange } = this;
    return (
      <div class="exchangeMall-container">
        <tg-tabs
          class="tg-tabs-bottom-line"
          tabs={tabs.tabs}
          value={tabs.checkedTab}
          onInput={onTabChange}
        />
        <router-view class="context" />
      </div>
    );
  },
});
