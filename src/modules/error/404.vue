<template>
  <div class="tg-page-container page-404" v-if="ready">
    <tg-card class="flex-auto" overflowInBody bodyClass="error-card">
      <img :src="errImg" alt="" />
      <div class="error-tips">
        <div class="error-tips-title">404</div>
        <div class="error-tips-content">{{ errTip }}</div>
      </div>
      <tg-button-line class="error-btns">
        <tg-button @click="goBack">回上一页</tg-button>
        <tg-button type="primary" @click="goWorkbench">工作台</tg-button>
      </tg-button-line>
      <div class="guess tac" v-if="guesspath.length > 0">
        <div>猜您想去</div>
        <div v-for="(link, index) in guesspath" :key="index">
          <a>{{ link.Name }}({{ link.path }})</a>
        </div>
      </div>
    </tg-card>
  </div>
  <div v-else></div>
</template>

<script lang="ts">
import { computed, defineComponent, onBeforeMount, ref } from '@vue/composition-api';
import { levenshtein } from '@/utils/string';
import img_404_1 from '@/assets/images/20400/404_1.png';
import img_404_2 from '@/assets/images/20400/404_2.png';

const images = [img_404_1, img_404_2];

const tips = [
  '😭 你访问的页面离家出走了',
  '🚧 此路不通 🚧',
  '服务器被修空调的拖走了🚚我们正在努力追回',
  '您似乎走进了死胡同',
  '404 Not Found',
  "Sorry, it seems that you've found a wrong page.",
  '哎呀，您访问的这个页面可能已经飞走了',
  '您已误入桃源深处，不知身在何处...',
  '您所查看的地址不存在',
];

const parseRoutePath = (path: string) =>
  path
    .replace(/\/:id/g, '/_n')
    .replace(/\/:(?:tab|calendar)\?/g, '/_S')
    .replace(/\/:(?:tab|calendar)/g, '/_s');

export default defineComponent({
  name: 'TgPageNotFound',
  setup(props, ctx) {
    const errTip = computed(() => tips[Math.trunc(Math.random() * tips.length)]);
    const errImg = computed(() => images[Math.trunc(Math.random() * images.length)]);

    const goWorkbench = () => {
      ctx.root.$router.replace({ name: 'Workbench' });
    };
    const goBack = () => {
      ctx.root.$router.go(-1);
    };

    const ready = ref(false);

    /** 菜单路径 */
    const menus = computed(() => {
      return (ctx.root.$router.options.routes?.find(el => el.name === 'Home')?.children ?? [])
        .map(menu => {
          const { children, path, name, meta, ...rest } = menu;

          const Name = (meta?.name as string) ?? '';

          const filteredChildren = children ?? [];

          return [
            { path: parseRoutePath(path), name, Name },
            filteredChildren.map(el => ({
              path: parseRoutePath(el.path),
              name: el.name,
              Name: el.meta?.name ?? '',
            })),
          ].flat();
        })
        .flat()
        .filter(el => !['/', '*'].includes(el.path));
    });

    /** 最接近当前错误路由的菜单 */
    const guesspath = computed(() => {
      const path = ctx.root.$route.path
        .replace(/\/\d+/g, '/_n')
        .replace(/\/_n\/\w+\?/g, '/_n/_S')
        .replace(/\/_n\/\w+/g, '/_n/_s');

      return menus.value
        .map(el => {
          const step = levenshtein(path, el.path);
          return {
            ...el,
            step,
            rate: (1 - step / el.path.length) * 100,
          };
        })
        .filter(el => el.step <= 4 || el.rate >= 80)
        .sort((cur, next) => next.rate - cur.rate)
        .map(el => ({
          ...el,
          path: el.path.replace(/_n/, 'ID参数').replace('_S', '其它参数'),
        }));
    });

    onBeforeMount(() => {
      if (ctx.root.$route.path === '/') {
        ctx.root.$router.replace({ name: 'Workbench' });
      } else {
        ready.value = true;
      }
    });

    return {
      ready,
      errTip,
      errImg,
      goWorkbench,
      goBack,
      menus,
      guesspath,
      images,
    };
  },
});
</script>

<style lang="less">
@import '~@/styles/utils/index.less';
.page-404 {
  flex: auto;
  .tg-card-bd.error-card {
    display: grid;
    grid-template-rows: 252px 60px 32px;
    justify-content: center;
    align-items: center;
    justify-items: center;
    row-gap: 30px;
    .pdt(130px);
    > img {
      grid-area: img;
      grid-row-start: 1;
      grid-row-end: 2;
      grid-column-start: 1;
      grid-column-end: 2;
      .wh(360px, 252px);
    }
    > .error-tips {
      grid-column-start: 1;
      grid-column-end: 2;
      display: grid;
      justify-items: center;
      row-gap: 12px;
      > .error-tips-title {
        .fc(28px, var(--text-color));
        line-height: 28px;
        font-weight: 600;
      }
      > .error-tips-content {
        .fc(14px, var(--text-second-color));
        font-weight: 400;
      }
    }
    > .error-btns {
      justify-content: center;
      grid-column-start: 1;
      grid-column-end: 2;
      grid-row-start: 3;
      grid-row-end: 4;
    }
    > .guess {
      grid-column-start: 1;
      grid-column-end: 2;
      align-self: flex-start;
      justify-content: center;
    }
  }
}
</style>
