import { defineComponent } from '@vue/composition-api';
import { useRouteTabs } from '@/use/tab';
import classificationSettings from './classificationSettings/index';
import typeSettings from './typeSettings/index';
import locationSettings from './locationSettings/index';

export default defineComponent({
  components: {
    classificationSettings,
    typeSettings,
    locationSettings,
  },
  setup(props, ctx) {
    const tabs = useRouteTabs(
      ctx,
      [
        { label: '资产分类设置', value: 'classificationSettings' },
        { label: '资产类型设置', value: 'typeSettings' },
        { label: '存放地点设置', value: 'locationSettings' },
      ],
      'classificationSettings',
    );
    return { ...tabs };
  },
  render(h) {
    const { tabs, checkedTab, onTabChange } = this;
    return (
      <div>
        <tg-tabs
          class="tg-tabs-bottom-line"
          tabs={tabs}
          v-model={this.checkedTab}
          onChange={onTabChange}
        />
        {h(checkedTab)}
      </div>
    );
  },
});
