import { ref, defineComponent, h } from '@vue/composition-api';
import './progress.less';
export default defineComponent({
  name: '',
  props: {
    percent: {
      type: Number,
      default: 0,
    },
    total: {
      type: Number,
      default: 0,
    },
    color: {
      type: String,
      default: '#1E8DFF',
    },
    text: {
      type: String,
      default: '正常项目',
    },
  },
  setup(props, ctx) {
    const data = ref();
    return {
      data,
    };
  },
  render() {
    const { percent, total, color, text } = this.$props;
    let percentValue = 0;
    if (percent && total) percentValue = Number(((percent / total) * 100).toFixed(1));
    // console.log(percent / total);

    const style = {
      width: `5px`,
      backgroundColor: color,
      height: '100%',
      transition: '0.3s',
    };
    return (
      <div class="progress-main">
        <div style={style}></div>
        <div class="progress-text">
          <div>{text}</div>
          <div>
            {percent} ({percentValue}%)
          </div>
        </div>
      </div>
    );
  },
});
