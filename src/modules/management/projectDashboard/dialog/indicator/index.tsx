import { deepClone } from '@/utils/tools';
import { computed, defineComponent, ref } from '@vue/composition-api';
import { Container, Draggable } from 'vue-smooth-dnd';
import { applyDrag } from '../../use';
import { Display_Fields_Setting, Save_Display_Fields_Setting } from '@/services/management';
import { useRequest } from '@gm/hooks/ahooks';
import { Message } from 'element-ui';
import icon_sort from '@/assets/img/management/icon_sort.png';
type DisplayFieldSettingList = TG.HttpResultType<typeof Display_Fields_Setting>;
type DisplayFieldSettingModel = TG.ArraySource<DisplayFieldSettingList>;
type DisplayFieldSettingTypeFields = TG.ArraySource<
  TG.ReadProperty<DisplayFieldSettingModel, 'type_fields'>
>;
export default defineComponent({
  components: {
    Container,
    Draggable,
  },
  setup: (props, ctx) => {
    const baseInfoModel = ref<DisplayFieldSettingModel>();
    const isBaseInfoCheckAll = ref(false);
    const checkedBaseInfoList = ref<string[]>([]);
    const isBaseInfoIndeterminate = computed(() => {
      return !isBaseInfoCheckAll.value && checkedBaseInfoList.value.length > 0;
    });

    const projectDataModel = ref<DisplayFieldSettingModel>();
    const isProjectDataCheckAll = ref(false);
    const checkedProjectDataList = ref<string[]>([]);
    const isProjectDataIndeterminate = computed(() => {
      return !isProjectDataCheckAll.value && checkedProjectDataList.value.length > 0;
    });
    const reqSaveDisplaySetting = useRequest(Save_Display_Fields_Setting, { manual: true });
    const methods = {
      show(data: DisplayFieldSettingList) {
        const [banseInfo, projectData] = deepClone(data) as DisplayFieldSettingList;
        baseInfoModel.value = banseInfo;
        projectDataModel.value = projectData;
        checkedBaseInfoList.value = banseInfo.type_fields
          .filter(el => !el.is_hide)
          .map(el => el.id);
        checkedProjectDataList.value = projectData.type_fields
          .filter(el => !el.is_hide)
          .map(el => el.id);
        isBaseInfoCheckAll.value =
          checkedBaseInfoList.value.length === banseInfo.type_fields.length &&
          checkedBaseInfoList.value.length !== 0;
        isProjectDataCheckAll.value =
          checkedProjectDataList.value.length === projectData.type_fields.length &&
          checkedProjectDataList.value.length !== 0;
      },
      async onSaveBtnClick() {
        // baseInfoModel.value?.type_fields.forEach((el, idx) => {
        //   el.sort = idx;
        //   el.is_hide = checkedBaseInfoList.value.find(id => id === el.id) === undefined;
        // });
        // projectDataModel.value?.type_fields.forEach((el, idx) => {
        //   el.sort = idx;
        //   el.is_hide = checkedProjectDataList.value.find(id => id === el.id) === undefined;
        // });
        // const newBaseInfoList =
        //   baseInfoModel.value?.type_fields?.map(el => ({
        //     id: el.id,
        //     is_hide: el.is_hide,
        //     sort: el.sort,
        //   })) || [];
        // const newProjectList =
        //   projectDataModel.value?.type_fields.map(el => ({
        //     id: el.id,
        //     is_hide: el.is_hide,
        //     sort: el.sort,
        //   })) || [];
        const tempCheckedProjectDataList = [...checkedProjectDataList.value];
        if (tempCheckedProjectDataList.length === 0) {
          Message.error('至少选择一个项目数据指标');
          return;
        }
        const allCheckedId = [...checkedBaseInfoList.value, ...checkedProjectDataList.value];
        const newFieldArray = [
          ...(baseInfoModel.value?.type_fields || []),
          ...(projectDataModel.value?.type_fields || []),
        ];
        const params = newFieldArray.map((el, idx) => ({
          is_hide: allCheckedId.find(id => id === el.id) ? false : true,
          sort: idx,
          id: el.id,
        }));
        // console.log({
        //   params,
        // });
        // return;
        const res = await reqSaveDisplaySetting.runAsync({ list: params });
        if (res.data.success) {
          ctx.emit('close');
          ctx.emit('submit');
          Message.success(res.data.message);
        }
      },
      onBaseInfoDrop(dropResult: any[]) {
        if (baseInfoModel.value) {
          baseInfoModel.value.type_fields = applyDrag(
            baseInfoModel.value?.type_fields || [],
            dropResult,
          );
        }
      },
      onProjectDataDrop(dropResult: any[]) {
        if (projectDataModel.value) {
          projectDataModel.value.type_fields = applyDrag(
            projectDataModel.value?.type_fields || [],
            dropResult,
          );
        }
      },
      dragListItem(data: DisplayFieldSettingTypeFields) {
        return (
          <Draggable key={data}>
            <div class="drag-item">
              <div class="left">
                <img class="hover-icon" src={icon_sort} alt="" />
                <el-checkbox label={data.id} key={data.id}>
                  {data.name}
                </el-checkbox>
              </div>
              <div class="drag-tips">按住拖动调整顺序</div>
            </div>
          </Draggable>
        );
      },
      handleBaseInfoCheckAllChange(checked: boolean) {
        isBaseInfoCheckAll.value = checked;
        if (checked) {
          if (checkedBaseInfoList.value) {
            checkedBaseInfoList.value = baseInfoModel.value?.type_fields.map(el => el.id) || [];
          }
        } else {
          checkedBaseInfoList.value = [];
        }
      },
      handleProjectDataCheckAllChange(checked: boolean) {
        isProjectDataCheckAll.value = checked;
        if (checked) {
          if (checkedProjectDataList.value) {
            checkedProjectDataList.value =
              projectDataModel.value?.type_fields.map(el => el.id) || [];
          }
        } else {
          checkedProjectDataList.value = [];
        }
      },
      handleCheckedBaseInfoChange(val: string[]) {
        isBaseInfoCheckAll.value =
          val.length > 0 && val.length === baseInfoModel.value?.type_fields.length;
        // console.log({
        //   base: val,
        // });
      },
      handleCheckedProjectDataChange(val: string[]) {
        isProjectDataCheckAll.value =
          val.length > 0 && val.length === projectDataModel.value?.type_fields.length;
        // console.log({
        //   project: val,
        // });
      },
    };
    return {
      baseInfoModel,
      projectDataModel,
      isBaseInfoIndeterminate,
      isProjectDataIndeterminate,
      isBaseInfoCheckAll,
      isProjectDataCheckAll,
      checkedBaseInfoList,
      checkedProjectDataList,
      reqSaveDisplaySetting,
      ...methods,
    };
  },
  render() {
    return (
      <div class="tg-dialog-indicator-container">
        <div class="outer-list">
          <div>
            <div class="header">
              <el-checkbox
                indeterminate={this.isBaseInfoIndeterminate}
                v-model={this.isBaseInfoCheckAll}
                on-change={this.handleBaseInfoCheckAllChange}
              >
                基本信息
              </el-checkbox>
            </div>

            <el-checkbox-group
              v-model={this.checkedBaseInfoList}
              on-change={this.handleCheckedBaseInfoChange}
            >
              <Container behaviour="contain" on-drop={this.onBaseInfoDrop}>
                {this.baseInfoModel?.type_fields.map(el => this.dragListItem(el))}
              </Container>
            </el-checkbox-group>
          </div>
          <div class="header-line"></div>
          <div>
            <div class="header">
              <el-checkbox
                indeterminate={this.isProjectDataIndeterminate}
                v-model={this.isProjectDataCheckAll}
                on-change={this.handleProjectDataCheckAllChange}
              >
                项目数据
              </el-checkbox>
            </div>

            <el-checkbox-group
              v-model={this.checkedProjectDataList}
              on-change={this.handleCheckedProjectDataChange}
            >
              <Container behaviour="contain" on-drop={this.onProjectDataDrop}>
                {this.projectDataModel?.type_fields.map(el => this.dragListItem(el))}
              </Container>
            </el-checkbox-group>
          </div>
        </div>
        <tg-mask-loading
          visible={this.reqSaveDisplaySetting.loading}
          content="  正在保存，请稍候..."
        />
      </div>
    );
  },
});
