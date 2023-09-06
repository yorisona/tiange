/*
 * @Author: 肖槿
 * @Date: 2021-07-23 16:04:25
 * @Description: 擅长平台
 * @LastEditors: 肖槿
 * @LastEditTime: 2021-09-30 16:14:35
 * @FilePath: \goumee-star-frontend\src\modules\supplier\kolManage\newGenerateKol\components\platform\platform.tsx
 */
import { defineComponent, h, SetupContext, inject, watch, ref } from '@vue/composition-api';
import { newPlatformList } from '@/const/kolConst';
// import { kolDouyin, kolKuaishou, kolXiaohongshu, kolTaobao } from '../index';
import kolDouyin from '../douyin/douyin';
import kolKuaishou from '../kuaishou/kuaishou';
import kolXiaohongshu from '../xiaohongshu/xiaohongshu';
import kolTaobao from '../taobao/taobao';
export default defineComponent({
  components: {
    kolDouyin,
    kolKuaishou,
    kolXiaohongshu,
    kolTaobao,
  },
  setup: ((prop: any, ctx: SetupContext) => {
    const platformList: any = ref([]);
    const list = newPlatformList.slice(1);
    platformList.value = list.map(item => ({ ...item, checked: false }));
    const editData: any = inject('editData');
    const selectvalue = ref('0');
    const renderPlatform = (key: string) => {
      switch (key) {
        case 'tb':
          return <kolTaobao ref={'kol_' + key} checked={platformList.value[1].checked} />;
        case 'douyin':
          return <kolDouyin ref={'kol_' + key} checked={platformList.value[0].checked} />;
        case 'xhs':
          return <kolXiaohongshu ref={'kol_' + key} checked={platformList.value[2].checked} />;
        case 'kuaishou':
          return <kolKuaishou ref={'kol_' + key} checked={platformList.value[3].checked} />;
        default:
          return <kolDouyin ref={'kol_' + key} checked={platformList.value[0].checked} />;
      }
    };
    const validate = async () => {
      const isCheckedList = platformList.value.filter((item: any) => item.checked);
      if (!isCheckedList.length) {
        ctx.root.$message.warning('至少勾选一个平台');
        return Promise.reject();
      }
      try {
        const data = await Promise.all(
          isCheckedList.map(
            async (item: any) =>
              await (
                ctx.refs['kol_' + item.value] as unknown as { validate: () => void }
              ).validate(),
          ),
        );
        const obj: any = {};
        for (let len = 0; len < data.length; len++) {
          const curKey = Object.keys(data[len] as any)[0];
          const curItem: any = data[len];
          obj[curKey] = curItem[curKey];
        }
        return Promise.resolve(obj);
      } catch (error) {
        ctx.root.$message.warning('请完善平台表单信息');
        return Promise.reject();
      }
    };
    watch(
      () => editData,
      (val: any) => {
        const { star_info, kol_douyin_info, kol_xhs_info, kol_kuaishou_info } = val.value;
        if (kol_douyin_info) {
          platformList.value[0].checked = true;
        }
        if (star_info) {
          platformList.value[1].checked = true;
          if (!kol_douyin_info) {
            selectvalue.value = '1';
          }
        }
        if (kol_xhs_info) {
          platformList.value[2].checked = true;
          if (!kol_douyin_info && !star_info) {
            selectvalue.value = '2';
          }
        }
        if (kol_kuaishou_info) {
          platformList.value[3].checked = true;
          if (!kol_douyin_info && !star_info && !kol_xhs_info) {
            selectvalue.value = '3';
          }
        }
      },
      {
        deep: true,
      },
    );
    return {
      platformList,
      renderPlatform,
      validate,
      selectvalue,
    };
  }).bind({ $createElement: h }),
  render() {
    return (
      <div class="base-info" style="padding-top:8px">
        <div class="form-container">
          <div class="base-item-title" style="margin-top: 0">
            <span class="star">* </span>
            <span class="title">擅长平台</span>
            <span class="subtitle">(至少勾选一个平台)</span>
          </div>
          <div class="generator-kol-platform">
            <el-tabs type="border-card" v-model={this.selectvalue}>
              {this.platformList.map((item: any) => (
                <el-tab-pane>
                  <div slot="label">
                    <el-checkbox
                      onChange={(val: any) => {
                        item.checked = val;
                      }}
                      v-model={item.checked}
                      key={item.value}
                      class="platform-checkbox "
                    />
                    <span class="platform-checkbox-p">{item.label}</span>
                  </div>
                  {this.renderPlatform(item.value)}
                </el-tab-pane>
              ))}
            </el-tabs>
          </div>
        </div>
      </div>
    );
  },
});
