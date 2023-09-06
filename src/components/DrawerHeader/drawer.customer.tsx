import { defineComponent, h, computed } from '@vue/composition-api';

export default defineComponent({
  name: 'DrawerCustomer',
  props: {
    customerName: {
      type: String,
    },
    customerManager: {
      type: String,
    },
    companyName: {
      type: String,
    },
  },
  setup(props) {
    const labelStyles = computed(() => {
      return {
        color: 'var(--text-third-color)',
        fontSize: '12px',
      };
    });
    const valueStyles = computed(() => {
      return {
        color: 'var(--text-color)',
        fontSize: '12px',
      };
    });

    return {
      labelStyles,
      valueStyles,
    };
  },
  render() {
    // const customerName: string = this.customerName ?? '--';
    const customerManager: string = this.customerManager ?? '--';
    const companyName: string = this.companyName ?? '--';

    const containerStyles = {
      style: {
        padding: '0 30px',
      },
    };

    const lineStyle = {
      style: {
        'margin-bottom': '12px',
      },
      class: 'line-clamp-1',
    };

    const labelStyles = { style: this.labelStyles as any };
    const valueStyles = { style: this.valueStyles as any };

    return h('div', containerStyles, [
      // h('div', lineStyle, [
      //   h('span', labelStyles, '客户名称：'),
      //   h('span', valueStyles, customerName),
      // ]),
      h('div', lineStyle, [
        h('span', labelStyles, '客户经理：'),
        h('span', valueStyles, customerManager),
      ]),
      h('div', { class: 'line-clamp-1' }, [
        h('span', labelStyles, '公司名称：'),
        h('span', valueStyles, companyName),
      ]),
    ]);
  },
});
