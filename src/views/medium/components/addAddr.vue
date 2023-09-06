<!--
 * @Author: 肖槿
 * @Date: 2020-04-27 15:15:22
 * @Description:
 * @LastEditors: 肖槿
 * @LastEditTime: 2020-04-28 14:28:40
 * @FilePath: \goumee-star-frontend\src\views\medium\components\addAddr.vue
 -->
<script>
import { cityList } from '@/utils/city';

export default {
  name: 'addAddr',
  props: {
    value: {
      type: Object,
      default: () => {
        return {
          county: '',
          province: '',
          city: '',
        };
      },
    },
  },
  data() {
    return {
      provinceList: cityList,
    };
  },
  computed: {
    citys() {
      if (this.value.province) {
        const _check = this.provinceList.filter(v => {
          return v.item_name === this.value.province;
        });
        return _check[0].citys;
      } else {
        return [];
      }
    },
    countys() {
      if (this.value.city) {
        const _check = this.citys.filter(v => {
          return v.item_name === this.value.city;
        });
        return _check[0].countys;
      } else {
        return [];
      }
    },
  },
  render(h) {
    return h(
      'div',
      {
        class: 'add-addr-con',
      },
      [
        h(
          'div',
          {
            class: 'add-addr-con-item',
            props: {
              span: 8,
            },
          },
          [
            h(
              'el-select',
              {
                model: {
                  value: this.value.province,
                  callback: val => this.$set(this.value, 'province', val),
                },
                on: {
                  change: val => {
                    this.provinceHandler(val);
                  },
                },
                props: {
                  size: 'small',
                },
              },
              [
                this.provinceList.map(v => {
                  return h('el-option', {
                    props: {
                      key: v.item_code,
                      label: v.item_name,
                      value: v.item_name,
                    },
                  });
                }),
              ],
            ),
          ],
        ),
        h(
          'div',
          {
            class: 'add-addr-con-item',
            props: {
              span: 8,
            },
          },
          [
            h(
              'el-select',
              {
                model: {
                  value: this.value.city,

                  callback: val => this.$set(this.value, 'city', val),
                },
                on: {
                  change: val => {
                    this.cityHandler(val);
                  },
                },
                props: {
                  size: 'small',
                },
              },
              [
                this.citys.map(v => {
                  return h('el-option', {
                    props: {
                      key: v.item_code,
                      label: v.item_name,
                      value: v.item_name,
                    },
                  });
                }),
              ],
            ),
          ],
        ),
        h(
          'div',
          {
            class: 'add-addr-con-item',
            props: {
              span: 8,
            },
          },
          [
            h(
              'el-select',
              {
                model: {
                  value: this.value.county,
                  callback: val => this.$set(this.value, 'county', val),
                },
                props: {
                  size: 'small',
                },
              },
              [
                this.countys.map(v => {
                  return h('el-option', {
                    props: {
                      key: v.item_code,
                      label: v.item_name,
                      value: v.item_name,
                    },
                  });
                }),
              ],
            ),
          ],
        ),
      ],
    );
  },
  methods: {
    provinceHandler() {
      // 修复一下前人修改 props 出现的规则报错
      const value = this.value;
      value.city = '';
      value.county = '';
    },
    cityHandler() {
      // 修复一下前人修改 props 出现的规则报错
      const value = this.value;
      value.county = '';
    },
  },
};
</script>
<style lang="less" scoped>
.add-addr-con {
  display: flex;
  justify-content: space-between;
}
</style>
