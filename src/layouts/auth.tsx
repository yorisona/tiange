/**
 * 登录相关
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2020-12-30 22:13:37
 */
import { computed, defineComponent } from '@vue/composition-api';

export default defineComponent({
  setup(props, ctx) {
    const year = new Date(Date.now()).getFullYear();
    const footerCopy = computed(
      () =>
        `Copyright © 2014-${year} ${process.env.VUE_APP_COMPANY_NAME} ${process.env.VUE_APP_ICP_NO}`,
    );

    return { footerCopy };
  },
  render() {
    return (
      <div class="tg-auth-page">
        <header class="tg-auth-header">
          <div class="logo"></div>
          <nav class="nav"></nav>
        </header>
        {this.$slots.default}
        <footer class="tg-auth-footer">{this.footerCopy}</footer>
      </div>
    );
  },
});
