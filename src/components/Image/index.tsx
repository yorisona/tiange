import { defineComponent, ref } from '@vue/composition-api';
import { getToken } from '@/utils/token';
import './index.less';
const tmt =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAMAAAADCAYAAABWKLW/AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RTdDMjdFMDdGNUUxMTFFQkFDOTlGNDlERDM5Qzg2MzMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RTdDMjdFMDhGNUUxMTFFQkFDOTlGNDlERDM5Qzg2MzMiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpFN0MyN0UwNUY1RTExMUVCQUM5OUY0OUREMzlDODYzMyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpFN0MyN0UwNkY1RTExMUVCQUM5OUY0OUREMzlDODYzMyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PuFbxP0AAAAUSURBVHjaYvz//z8DDDDi5AAEGADXnQj7fmJyhgAAAABJRU5ErkJggg==\n';
export default defineComponent({
  name: 'TgImage',
  props: {
    /** 图片地址 */
    src: {
      type: String,
    },
    /** 图片填充方式 */
    fit: {
      type: String,
    },
  },
  setup(props, ctx) {
    const classNobackground = ref('');
    return { classNobackground };
  },
  render() {
    const props: any = { attrs: { ...this.$attrs }, on: this.$listeners, class: 'tg-image' };

    let appendURL = `Authorization=${getToken()}`;
    let src: any = this.src;
    if (src !== undefined && src !== null) {
      if (src.indexOf('?') !== -1) appendURL = `&${appendURL}`;
      else appendURL = `?${appendURL}`;
      src = `${src}${appendURL}`;
    }
    if (this.src === null || this.src === undefined || this.src === '') {
      // src = defaultImage;
      props.class = `${props.class} tg-image-default`;
      props.attrs.src = tmt;
    } else {
      props.attrs.src = `${src}`;
    }
    if (this.fit) {
      props.style = `object-fit:${this.fit};`;
    }
    props.class = `${props.class} ${this.classNobackground}`;
    return (
      <img
        onLoad={() => {
          // props.class = `no-background`;
          this.classNobackground = 'no-background';
        }}
        {...props}
      />
    );
  },
});
