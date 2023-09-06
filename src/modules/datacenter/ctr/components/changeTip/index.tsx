/*
 * @Brief: 简介
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2022-05-26 13:07:35
 */
import { defineComponent } from '@vue/composition-api';
import hardcover from '@/assets/img/datacenter/hardcover.png';
import lighting from '@/assets/img/datacenter/lighting.png';
import seat from '@/assets/img/datacenter/seat.png';
import display from '@/assets/img/datacenter/display.png';
import patch from '@/assets/img/datacenter/patch.png';
import tint from '@/assets/img/datacenter/tint.png';

export default defineComponent({
  setup() {
    const methods = {};
    return {
      hardcover,
      lighting,
      seat,
      display,
      patch,
      tint,
      ...methods,
    };
  },
  render() {
    return (
      <div class="ctr-chart-change-tip-component">
        <div class="change-tip">
          <img src={this.hardcover} />
          <span>硬装</span>
        </div>
        <div class="change-tip">
          <img src={this.lighting} />
          <span>灯光</span>
        </div>
        <div class="change-tip">
          <img src={this.seat} />
          <span>机位</span>
        </div>
        <div class="change-tip">
          <img src={this.display} />
          <span>陈列</span>
        </div>
        <div class="change-tip">
          <img src={this.patch} />
          <span>贴片</span>
        </div>
        <div class="change-tip">
          <img src={this.tint} />
          <span>调色</span>
        </div>
      </div>
    );
  },
});
