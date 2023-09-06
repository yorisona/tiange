import { defineComponent, ref, h } from '@vue/composition-api';

import TgBtnCapsule from '@/components/Button/capsule';
import { useRouter } from '@/use/vue-router';
import { RouterNameDesign } from '@/const/router';
import List from './list/index.vue';
import Calendar from './calendar/index.vue';

export default defineComponent({
  components: { TgBtnCapsule, List, Calendar },
  beforeRouteUpdate(to, form, next) {
    this.module = to.query.tab || 'list';
    next();
  },
  setup: (props, ctx) => {
    const router = useRouter();
    const module = ref(router.currentRoute.query.tab || 'list');
    const onCapsuleClick = (value: string) => {
      const query = { tab: '' };
      if (value === 'left') query.tab = 'list';
      else query.tab = 'calendar';

      router.push({ name: RouterNameDesign.image.detail, query });
    };

    return {
      module,
      onCapsuleClick,
    };
  },
  render() {
    const module: any = this.module;
    return (
      <div class="detail-container">
        <div class="search-bar">
          <tg-btn-capsule
            value={this.module === 'calendar' ? 'right' : 'left'}
            onClick={this.onCapsuleClick}
          >
            <span slot="left">列表</span>
            <span slot="right">日历</span>
          </tg-btn-capsule>
        </div>
        <module class="detail-container-body" />
      </div>
    );
  },
});
