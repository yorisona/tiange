import { defineComponent, PropType } from '@vue/composition-api';
import { Design_Order_Details } from '@/modules/design/order/useOrder';
import moment from 'moment';

export default defineComponent({
  props: {
    value: {
      type: Object as PropType<Design_Order_Details>,
      required: true,
    },
    // order | workbench
    position: {
      type: String,
      required: true,
    },
  },
  setup(props, ctx) {
    const onDelete = (e: MouseEvent) => {
      e.stopPropagation();
      ctx.emit('delete', props.value);
    };
    return {
      onDelete,
    };
  },
  methods: {
    // 是否显示截止日期
    hasDeadline() {
      const { value } = this;
      switch (value.external_status) {
        case E.design.GraphicDesignStatus.DESIGN:
        case E.design.GraphicDesignStatus.AUDIT:
        case E.design.GraphicDesignStatus.DELIVERY:
        case E.design.GraphicDesignStatus.FINISH:
          return true;
      }
      return false;
    },
    // 逾期Tab
    overdue() {
      const { value } = this;
      if (value.external_status === E.design.GraphicDesignStatus.CANCEL) return;
      // 截止日期
      const delivery_time = moment(value.delivery_time);
      // 交付日期
      let dueTime = moment();
      if (value.actual_delivery_time) {
        dueTime = moment(value.actual_delivery_time);
      }
      dueTime.add(-1, 'days');
      if (dueTime.isAfter(delivery_time)) {
        const diff = Math.max(1, dueTime.diff(delivery_time, 'days'));
        return <span class={`status status-overdue`}>逾期{diff}天</span>;
      }
      return;
    },
  },
  render() {
    const { value, onDelete } = this;
    const GraphicDesignStatus = E.design.GraphicDesignStatus;
    let hasShowCorner = false;
    if (value.external_status === GraphicDesignStatus.INIT) {
      hasShowCorner = true;
    }
    const hasDeadline = this.hasDeadline();
    // 时间相关
    let timeLabel = '期望时间';
    let timeValue = value.expect_delivery_time;
    let labelColor = '';

    const overdue = this.overdue();
    if (hasDeadline) {
      timeLabel = '截止时间';
      timeValue = value.delivery_time;
      if (
        value.external_status === GraphicDesignStatus.FINISH ||
        value.external_status === GraphicDesignStatus.DELIVERY
      ) {
        timeLabel = '交付时间';
        timeValue = value.actual_delivery_time;
      }

      if (
        value.external_status !== GraphicDesignStatus.DELIVERY &&
        value.external_status !== GraphicDesignStatus.FINISH &&
        value.external_status !== GraphicDesignStatus.CANCEL
      ) {
        if (overdue) {
          labelColor = 'red';
        } else {
          labelColor = 'blue';
        }
      }
    }

    return (
      <div
        class={`design-card ${
          value.external_status === E.design.GraphicDesignStatus.PADDING && 'design-card-await'
        }`}
        onClick={() => this.$emit('click')}
      >
        {hasShowCorner && <div class="card-corner-mark" />}

        <div class="card-title">
          <span
            class={`level ${value.level_name === '-' ? 'level-empty' : ''}`}
            style={{ backgroundColor: value.level_color }}
          >
            {value.level_name || '-'}
          </span>
          <span class="level-text">{value.project_name}</span>
        </div>
        <div class="card-body">
          <div class={`line ${labelColor}`}>
            <span class="level-label">{timeLabel}</span>
            <span>{moment(timeValue).format('YYYY.MM.DD HH:mm')}</span>
          </div>
          <div class="line">
            <span>项目类型</span>
            <span>{value.team_label}</span>
          </div>
          <div class="line overflowHidden">
            <span>制作内容</span>
            <span>{value.project_type}</span>
          </div>
          <div class="line">
            <span>{value.add_by_name}</span>
            <span style="font-weight: 600;">{value.brand_name || '--'}</span>
          </div>
        </div>
        <div class="card-footer">
          <div class="line">
            <span>设计师</span> <span>{value.execute_person_name ?? '--'}</span>
          </div>
          <div class="line flex-row">
            <span>当前状态</span>
            <span class={`status status-${value.external_status}`}>
              {value.external_status_name}
            </span>
            {overdue}
            <span class="empty" />
            <span class="icon-delete" onClick={onDelete}>
              <tg-icon name="ico-delete" />
            </span>
          </div>
        </div>
      </div>
    );
  },
});
