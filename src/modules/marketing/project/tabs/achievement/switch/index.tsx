// 本文件废弃
import { defineComponent } from '@vue/composition-api';
import SubTabs from '@/components/BusinessComponents/SubTabs/index.vue';
import comp1 from '../achievement_receivable.vue';
import comp2 from '../achievement.vue';

export default defineComponent({
  name: 'switch',
  components: {
    SubTabs,
    comp1,
    comp2,
  },
  render() {
    return (
      <sub-tabs>
        <comp1 name="应收" />
        <comp2 name="实收" />
      </sub-tabs>
    );
  },
});
