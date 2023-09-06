/**
 * @Author: 肖槿
 * @Date: 2020-04-07 11:57:47
 * @Description:
 * @LastEditors: 肖槿
 * @LastEditTime: 2020-04-30 11:02:56
 * @FilePath: \goumee-star-frontend\src\components\index.js
 */
import Vue from 'vue';
// 导入文件组件
import StarImportFile from './import_file/index.vue';
// 头部按钮组件
import HeaderButton from './header_button/index.vue';
// 二级Panel组件
import SubPanel from './sub_panel/index.vue';
// 选择项组件
import SelectItems from './select_items/index.vue';
// 全选/反选组件
import CheckAll from './check_all/index.vue';
// 表格无数据展示
import TableNoData from './table_nodata/index.vue';
// 通用弹窗
import CommonDialog from './common_dialog/index.vue';
// 显示更多项
import MoreItems from './more_items/index.vue';
// 图片预览弹窗
import ImageDialog from './image_dialog/index.vue';
// 图标字体
import fontClass from './fontClass/index.vue';
//全局注册空组件
import emptyCommon from './empty/emptyCommon.vue';
//全局注册文件展示列表
import uploadFileList from './UploadFileList/index.vue';
//标题加蓝色竖条
import headLines from './BoldHeadLines/headLines.vue';
//文件加下载
import FileItem from './fileItem/fileitem.vue';
//文字气泡
import TextPopover from './TextPopover/index.vue';
//树形选择器
import TreeSelect from './treeSelect/base/index.vue';
//飞书部门选择器
import DepartmentSelect from './treeSelect/departmentSelect/index.vue';

Vue.component('DepartmentSelect', DepartmentSelect);
Vue.component('TreeSelect', TreeSelect);
Vue.component('FileItem', FileItem);
Vue.component('uploadFileList', uploadFileList);
Vue.component('headLines', headLines);
Vue.component(emptyCommon.name, emptyCommon);
Vue.component('StarImportFile', StarImportFile);
Vue.component('HeaderButton', HeaderButton);
Vue.component('SubPanel', SubPanel);
Vue.component('SelectItems', SelectItems);
Vue.component('CheckAll', CheckAll);
Vue.component('TableNoData', TableNoData);
Vue.component('CommonDialog', CommonDialog);
Vue.component('MoreItems', MoreItems);
Vue.component('ImageDialog', ImageDialog);
Vue.component('GmIcon', fontClass);
Vue.component(TextPopover.name, TextPopover);
