/**
 * demo 步骤条
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-04-26 13:54:43
 */
import { computed, defineComponent, h, ref } from '@vue/composition-api';

export default defineComponent({
  props: {},
  setup(props, ctx) {
    const stepActiveNumber = ref(1);
    const multilines = ref(false);
    const stepDateList = computed(() => [
      { title: '项目创建', description: '2021.04.23' },
      {
        title: '项目试播',
        description: () =>
          h('div', [
            h('div', ['2021.04.29']),
            multilines.value
              ? h('div', [
                  '附加内容附加内容附加内容附加内容附加内容附加内容附加内容附加内容附加内容附加内容附加内容附加内容附加内容附加内容附加内容附加内容附加内容附加内容附加内容附加内容附加内容附加内容附加内容附加内容附加内容附加内容附加内容附加内容附加内容附加内容附加内容附加内容',
                ])
              : '',
          ]),
      },
      { title: '项目执行', description: '累计直播0场，0小时' },
      {
        title: '项目完结',
        description: '已经正常完结',
      },
    ]);

    return {
      multilines,
      stepDateList,
      stepActiveNumber,
    };
  },
});
