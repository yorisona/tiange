<!--
 * @Author: 肖槿
 * @Date: 2020-04-24 16:19:11
 * @Description:
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-01-27 16:43:03
 * @FilePath: \goumee-star-frontend\src\views\medium\components\brand.vue
 -->
<script>
export default {
  name: 'brand',
  props: {
    value: {
      type: Array,
      default: () => [],
    },
  },
  directives: {
    focus: {
      inserted(el) {
        el.focus();
      },
    },
  },
  render(h) {
    const clickDiv = h(
      'div',
      {
        class: 'border-dashed',
        style: {
          marginTop: this.value.length ? '10px' : '0',
        },
        on: {
          click: this.addBrand,
        },
      },
      [h('i', { class: 'el-icon-circle-plus' }, '点击添加')],
    );
    const inputDiv = this.value.map((vv, kk) =>
      h(
        'div',
        {
          class: 'content-value-box',
          key: kk,
        },
        [
          h('div', { class: 'content-value' }, [
            h(
              'div',
              {
                class: 'icon-right',
              },
              [
                h('tg-icon', {
                  props: {
                    name: 'ico-delete',
                  },
                  on: {
                    click: () => {
                      this.deleteBrand(kk);
                    },
                  },
                }),
              ],
            ),
            h('el-input', {
              // model: {
              //   value: vv,
              //   callback: val => {
              //     this.value[kk] = val;
              //   },
              // },
              attrs: {
                autofocus: true,
                placeholder: '请输入品牌名称',
              },
              props: {
                value: vv,
                size: 'small',
              },
              on: {
                // blur: () => {
                //   this.inputBlur(vv, kk);
                // },
                input: event => {
                  const value = this.value;
                  value.splice(kk, 1, event.replace(/\s/gi, ''));
                  // console.log("🚀 ~ file: brand.vue ~ line 86 ~ render ~ this.value", this.value)
                },
              },
            }),
          ]),
        ],
      ),
    );
    return h('div', {}, [...inputDiv, clickDiv]);
  },
  methods: {
    deleteBrand(index) {
      const value = this.value;
      value.splice(index, 1);
    },
    inputBlur(vv, kk) {
      const value = this.value;
      if (!this.value[kk].replace(/\s/gi, '')) {
        value.splice(kk, 1);
      }
    },
    addBrand() {
      const value = this.value;
      value.push('');
    },
  },
};
</script>
