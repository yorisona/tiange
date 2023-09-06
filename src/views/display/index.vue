<template>
  <section>
    <el-row :class="['search-display-row', { jianxiao: ctype === 'cooperative' }]">
      <el-form
        :inline="true"
        :model="searchDisplayForm"
        class="search-display-item"
        label-position="right"
        label-width="84px"
      >
        <el-form-item label="主播昵称:">
          <el-select v-model="searchDisplayForm.starName" size="small" filterable clearable>
            <el-option
              v-for="(item, index) in allStars"
              :key="index"
              :value="item.value"
              :label="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="直播日期:">
          <el-date-picker
            size="small"
            placeholder="选择日期"
            format="yyyy.MM.dd"
            value-format="yyyy-MM-dd"
            v-model="searchDisplayForm.displayTime"
            style="width: 192px"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="最近直播:">
          <el-select
            placeholder="选择最近直播日期"
            v-model="searchDisplayForm.latestDisplayTime"
            size="small"
            clearable
          >
            <!-- <el-option v-for="(item, index) in latestDisplayTimeOptions" :key="index" :value="item.value" :label="item.label"></el-option> -->
            <el-option value="7" label="最近一周"></el-option>
            <el-option value="15" label="最近15天"></el-option>
            <el-option value="30" label="最近一个月"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="录 入 人:">
          <el-select v-model="searchDisplayForm.addBy" size="small" filterable clearable>
            <el-option
              v-for="(item, index) in allAddBy"
              :key="index"
              :value="item"
              :label="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否预售:">
          <el-select
            placeholder="选择是否预售"
            v-model="searchDisplayForm.isPresell"
            size="small"
            clearable
          >
            <!-- <el-option v-for="(item, index) in isPresellOptions" :key="index" :value="item.value" :label="item.label"></el-option> -->
            <el-option value="1" label="预售场"></el-option>
            <el-option value="2" label="预热场"></el-option>
            <el-option value="0" label="非预售场"></el-option>
            <el-option value="-1" label="未录入"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否出单:">
          <el-select
            placeholder="选择是否已出单"
            size="small"
            clearable
            v-model="searchDisplayForm.isDisplay"
          >
            <!-- <el-option v-for="(item, index) in isDisplayOptions" :key="index" :value="item.value" :label="item.label"></el-option> -->
            <el-option value="2" label="已出单"></el-option>
            <el-option value="1" label="未出单"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <el-row class="search-display-button">
        <!-- <el-button size="small" type="primary" @click="lotImportDialogVisible = true">批量导入</el-button> -->
        <el-button
          class="btn btn-blue"
          style="width: 60px"
          type="primary"
          size="small"
          @click="searchDisplay"
          >查询</el-button
        >
        <tg-button type="negative" size="small" @click="searchReset" style="margin-left: 10px"
          >重置</tg-button
        >
      </el-row>
    </el-row>
    <el-dialog
      custom-class="dialog-min-width-tip"
      :visible.sync="lotImportDialogVisible"
      title="批量导入"
      width="22%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-row style="text-align: center">
        <el-upload
          v-if="isAdminUser"
          class="display-import-button"
          ref="upload"
          :action="''"
          :http-request="uploadDisplay"
          :show-file-list="false"
          multiple
          :file-list="fileList"
        >
          <el-button size="small" type="primary" :loading="uploadLoading" style="width: auto"
            >导入场次</el-button
          >
        </el-upload>
      </el-row>
      <el-row style="text-align: center; margin-top: 12px">
        <el-button size="small" type="primary" @click="downloadModelxlsx">下载模板</el-button>
      </el-row>
      <el-row style="text-align: center; margin-top: 12px">
        <el-button size="small" type="primary" @click="downloadModelDesc"
          >下载使用说明文档</el-button
        >
      </el-row>
    </el-dialog>
    <!-- 编辑场次 弹框和表单 :title="displayDialogTitle"  -->
    <el-dialog
      custom-class="dialog-min-width"
      :visible.sync="addDisplayDialogVisible"
      :close-on-click-modal="false"
      width="36%"
      class="addDisplay-dialog"
      :close-on-press-escape="false"
      @close="closeAddDiplayDialog('displayInfoForm')"
    >
      <template #title>
        <div class="addDisplay-header">编辑场次</div>
      </template>
      <el-form
        :inline="true"
        size="small"
        :model="displayInfoForm"
        label-width="80px"
        label-position="top"
        ref="displayInfoForm"
      >
        <el-form-item
          label="直播标题"
          prop="title"
          :rules="[{ required: true, message: '请输入直播标题' }]"
        >
          <el-input
            name="title"
            v-model="displayInfoForm.title"
            placeholder="请输入直播标题"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="主播昵称"
          prop="starName"
          :rules="[{ required: true, message: '主播昵称是必填项' }]"
        >
          <el-autocomplete
            name="starName"
            v-model="displayInfoForm.starName"
            placeholder="请输入内容"
            :trigger-on-focus="false"
            @select="handleSelectAdd"
            :fetch-suggestions="querySearchAdd"
            @keyup.native="starKeyUp"
            :disabled="!isAddButton"
          >
          </el-autocomplete>
        </el-form-item>
        <el-form-item
          label="主 播 ID"
          prop="starId"
          :rules="[{ required: true, message: '主播id是必填项' }]"
        >
          <el-input
            name="starId"
            v-model="displayInfoForm.starId"
            :disabled="!isAddButton"
            placeholder="请输入内容"
            type="number"
            @mousewheel.native.prevent
          ></el-input>
        </el-form-item>
        <el-form-item
          label="场次PV"
          prop="pv"
          :rules="[{ required: true, message: '场次PV是必填项' }]"
        >
          <el-input
            name="pv"
            v-model="displayInfoForm.pv"
            placeholder="请输入内容"
            type="number"
            @mousewheel.native.prevent
          >
            <template #append>万</template>
          </el-input>
        </el-form-item>
        <!--<el-form-item label="场次UV">-->
        <!--<el-input type="number" v-model="displayInfoForm.uv">-->
        <!--<template #append>次</template>-->
        <!--</el-input>-->
        <!--</el-form-item>-->
        <el-form-item
          label="直播类型"
          prop="displayType"
          :rules="[{ required: true, message: '直播类型是必填项' }]"
        >
          <el-select
            name="displayType"
            v-model="displayInfoForm.displayType"
            placeholder="请选择直播类型"
          >
            <el-option
              v-for="item in displayTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="直播日期"
          prop="displayTime"
          :rules="[{ required: true, message: '直播时间是必填项' }]"
        >
          <el-date-picker
            name="displayTime"
            v-model="displayInfoForm.displayTime"
            placeholder="请选择直播日期"
            format="yyyy.MM.dd"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item
          label="是否预售场"
          prop="isPresell"
          :rules="[{ required: true, message: '是否预售场为必填项' }]"
        >
          <el-select
            placeholder="请选择是否为预售场"
            name="isPresell"
            v-model="displayInfoForm.isPresell"
          >
            <el-option
              v-for="(item, index) in presellSelectOption"
              :key="index"
              :value="item.value"
              :label="item.label"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button size="small" style="width: 80px" @click="addDisplayDialogVisible = false"
            >取消</el-button
          >
          <el-button
            type="primary"
            style="width: 80px"
            size="small"
            @click="saveDisplays('displayInfoForm')"
            v-show="isAddButton"
            >添加</el-button
          >
          <el-button
            type="primary"
            style="width: 80px"
            size="small"
            @click="updateDisplays('displayInfoForm')"
            v-show="!isAddButton"
            >保存</el-button
          >
        </span>
      </template>
    </el-dialog>
    <!-- main-table -->
    <el-row
      style="background: #fff; padding: 13px; border-radius: 4px; margin-top: 10px"
      :class="{ jianxiao: ctype === 'cooperative' }"
    >
      <el-row class="search-display-button" style="margin-bottom: 12px">
        <el-button
          v-if="$store.getters['user/getUserRole'].includes(RIGHT_CODE.add_display)"
          v-show="ctype !== 'cooperative'"
          type="primary"
          size="small"
          class="rect-100-36 btn-blue"
          @click="
            addDisplay();
            addAndImmportDialogVisiable = true;
          "
          >新增场次</el-button
        >
        <div
          v-if="ctype === 'cooperative'"
          style="
            width: 100%;
            height: 1px;
            background: rgba(232, 232, 232, 1);
            margin-bottom: 15px;
            margin-top: -20px;
          "
        ></div>
        <tg-button
          v-if="$store.getters['user/getUserRole'].includes(RIGHT_CODE.export_display)"
          @click="exportStarSubmit"
          >导出</tg-button
        >
        <tg-button
          v-if="$store.getters['user/getUserRole'].includes(RIGHT_CODE.del_display)"
          style="margin-left: 10px"
          @click="batchDelete"
          >删除</tg-button
        >
      </el-row>
      <el-table
        v-loading="displayData_loading"
        @selection-change="handleSelectionChange"
        :data="displayData"
        stripe
        :header-row-style="{ fontSize: '15px' }"
        :header-cell-style="{
          background: 'var(--table-thead-th-bg-color)',
          height: '48px',
          color: 'var(--text-second-color)',
          fontSize: '16px',
        }"
        class="display-table"
        @row-click="handleDisplayCellClick"
      >
        <!-- <el-table-column prop="id" label="场次ID" v-if="false">
        </el-table-column> -->
        <el-table-column type="selection" v-if="isAdminUser"> </el-table-column>
        <!-- <el-table-column prop="displayTime" label="直播日期" :formatter="dateFormat" min-width="100">
        </el-table-column> -->
        <el-table-column prop="title" min-width="150" label="直播标题/日期/类型">
          <template v-slot="scope">
            <el-tooltip :content="scope.row.title" placement="top" effect="light">
              <span class="display-title color-blue">{{
                scope.row.title === '' ? '-' : scope.row.title
              }}</span>
            </el-tooltip>
            <div style="font-size: 14px; color: #666; line-height: 20px">
              {{ dateFormat(scope.row, { property: 'displayTime' }) }}
            </div>
            <div style="font-size: 14px; line-height: 18px">
              <tg-tag :content="getDisplayType(scope.row.displayType)" />
              <tg-tag v-if="scope.row.isPresell === 1" content="预售" style="margin: 0 4px" />
              <tg-tag v-if="scope.row.isPresell === 0" content="非预售" style="margin: 0 4px" />
              <tg-tag v-if="scope.row.isPresell === -1" content="未录入" style="margin: 0 4px" />
              <tg-tag v-if="scope.row.isPresell === 2" content="预热" style="margin: 0 4px" />
            </div>
          </template>
        </el-table-column>
        <el-table-column label="主播昵称/ID" min-width="110">
          <template v-slot="scope">
            <div>
              <el-tooltip
                :content="scope.row.starName + ' ' + scope.row.starId"
                placement="top"
                effect="light"
              >
                <p class="text-overflow-cls color-blue">{{ scope.row.starName }}</p>
              </el-tooltip>
              <p class="text-overflow-cls color-999">{{ scope.row.starId }}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="出单状态" min-width="100">
          <template v-slot="scope">
            <span class="is-get-form is-gray" v-show="scope.row.isDisplay === 1">未出单</span>
            <span class="is-get-form color-blue" v-show="scope.row.isDisplay === 2">已出单</span>
            <el-tooltip
              v-if="
                (scope.row.displaySalesAmount > 0 || scope.row.displaySalesNum > 0) &&
                scope.row.isDisplay === 1
              "
              placement="right"
              content="该销售数据为关联商品的销售数据，所以此处为【未出单】"
              effect="light"
            >
              <i class="el-icon-warning" style="cursor: pointer; margin-left: 2px"></i>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="总销售情况" min-width="120" :render-header="TotalSales">
          <template v-slot="scope">
            <div
              v-if="
                (scope.row.displaySalesAmount !== 0 || scope.row.isDisplay === 2) &&
                (scope.row.displaySalesNum !== 0 || scope.row.isDisplay === 2)
              "
            >
              <p
                class="sales-desc color-999"
                v-show="scope.row.displaySalesAmount !== 0 || scope.row.isDisplay === 2"
              >
                销售额:<span class="color-blue">
                  {{
                    scope.row.displaySalesAmount === -1
                      ? '未出单'
                      : scope.row.displaySalesAmount + ' 元'
                  }}</span
                >
              </p>
              <p
                class="sales-desc color-999"
                v-show="scope.row.displaySalesNum !== 0 || scope.row.isDisplay === 2"
              >
                销售量:<span class="color-blue">
                  {{
                    scope.row.displaySalesNum === -1 ? '未出单' : scope.row.displaySalesNum + ' 件'
                  }}</span
                >
              </p>
            </div>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column prop="products_num" label="总商品数" min-width="90" align="center">
        </el-table-column>
        <el-table-column prop="pv" label="总PV/万" min-width="90" align="center"> </el-table-column>
        <el-table-column
          prop="products_click_num"
          label="总点击数"
          min-width="90"
          align="center"
          style="color: red !important"
        >
        </el-table-column>
        <el-table-column label="录入人/日期" min-width="110" show-overflow-tooltip align="center">
          <template v-slot="scope">
            <div>
              <p style="margin: 0; color: var(--text-des-color)">{{ scope.row.add_by }}</p>
              <p style="margin: 0; font-size: 14px; color: var(--text-des-color)">
                {{ addDateFormat(scope.row.addTime, 'YYYY-MM-DD') }}
              </p>
            </div>
          </template>
        </el-table-column>
        <template #empty>
          <div class="empty-box no_data" style="padding: 40px 0">
            <img src="@/assets/img/anchor_nodata.png" />
            <p>暂时木有内容呀~</p>
          </div>
        </template>
      </el-table>
      <div class="block" style="margin: 16px 0 10px 0">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="pagination.currentPage"
          :page-sizes.sync="pagination.pageSizes"
          :page-size.sync="pagination.pageSize"
          layout="total, prev, pager, next, sizes, jumper"
          :total="pagination.total"
        >
        </el-pagination>
      </div>
    </el-row>
    <!-- 新增场次 弹窗 -->
    <el-dialog
      :visible.sync="addAndImmportDialogVisiable"
      :close-on-click-modal="false"
      class="add-and-immport-dialog"
      :close-on-press-escape="false"
      @close="addAndImmportDialogVisiable = false"
    >
      <template #title>
        <div class="cutom-header">
          <span
            :class="['dialog-tab', dialogShowBlockIndex === 0 ? 'active2' : '']"
            @click="dialogShowBlockIndex = 0"
            >新增场次</span
          >
          <span
            :class="['dialog-tab', dialogShowBlockIndex === 1 ? 'active2' : '']"
            @click="dialogShowBlockIndex = 1"
            >批量导入</span
          >
        </div>
      </template>
      <div v-show="dialogShowBlockIndex === 0">
        <el-form
          :inline="true"
          size="small"
          :model="displayInfoForm"
          label-width="80px"
          label-position="top"
          ref="displayInfoForm"
        >
          <el-form-item
            label="直播标题"
            prop="title"
            :rules="[{ required: true, message: '请输入直播标题' }]"
          >
            <el-input
              name="title"
              v-model="displayInfoForm.title"
              placeholder="请输入直播标题"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="主播昵称"
            prop="starName"
            :rules="[{ required: true, message: '主播昵称是必填项' }]"
          >
            <el-autocomplete
              name="starName"
              v-model="displayInfoForm.starName"
              placeholder="请输入内容"
              :trigger-on-focus="false"
              @select="handleSelectAdd"
              :fetch-suggestions="querySearchAdd"
              @keyup.native="starKeyUp"
            >
            </el-autocomplete>
          </el-form-item>
          <el-form-item
            label="主 播 ID"
            prop="starId"
            :rules="[{ required: true, message: '主播id是必填项' }]"
          >
            <el-input
              name="starId"
              v-model="displayInfoForm.starId"
              placeholder="请输入内容"
              type="number"
              @mousewheel.native.prevent
            ></el-input>
          </el-form-item>
          <el-form-item
            label="场次PV"
            prop="pv"
            :rules="[{ required: true, message: '场次PV是必填项' }]"
          >
            <el-input
              name="pv"
              v-model="displayInfoForm.pv"
              placeholder="请输入内容"
              type="number"
              @mousewheel.native.prevent
            >
              <template #append>万</template>
            </el-input>
          </el-form-item>
          <!--<el-form-item label="场次UV">-->
          <!--<el-input type="number" v-model="displayInfoForm.uv">-->
          <!--<template #append>次</template>-->
          <!--</el-input>-->
          <!--</el-form-item>-->
          <el-form-item
            label="直播类型"
            prop="displayType"
            :rules="[{ required: true, message: '直播类型是必填项' }]"
          >
            <el-select
              name="displayType"
              v-model="displayInfoForm.displayType"
              placeholder="请选择直播类型"
            >
              <el-option
                v-for="item in displayTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="直播日期"
            prop="displayTime"
            :rules="[{ required: true, message: '直播时间是必填项' }]"
          >
            <el-date-picker
              name="displayTime"
              v-model="displayInfoForm.displayTime"
              placeholder="请选择直播日期"
              format="yyyy.MM.dd"
              value-format="yyyy-MM-dd"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item
            label="是否预售场"
            prop="isPresell"
            :rules="[{ required: true, message: '是否预售场为必填项' }]"
          >
            <el-select
              placeholder="请选择是否为预售场"
              name="isPresell"
              v-model="displayInfoForm.isPresell"
            >
              <el-option
                v-for="(item, index) in presellSelectOption"
                :key="index"
                :value="item.value"
                :label="item.label"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button
            class="big-button"
            size="small"
            style="width: 100px"
            @click="addAndImmportDialogVisiable = false"
            >取消</el-button
          >
          <el-button
            :disabled="isDisable"
            class="big-button btn-blue"
            type="primary"
            style="width: 100px"
            size="small"
            @click="saveDisplays('displayInfoForm')"
            v-show="isAddButton"
            >添加</el-button
          >
          <el-button
            type="primary"
            style="width: 100px"
            size="small"
            @click="updateDisplays('displayInfoForm')"
            v-show="!isAddButton"
            >保存</el-button
          >
        </span>
      </template>
      <div class="import-wrap" v-show="dialogShowBlockIndex === 1">
        <el-row style="text-align: center">
          <el-upload
            v-if="isAdminUser"
            class="display-import-button"
            ref="upload"
            :action="''"
            :http-request="uploadDisplay"
            :show-file-list="false"
            multiple
            :file-list="fileList"
          >
            <el-button size="small" type="primary" :loading="uploadLoading" style="width: auto">
              <div class="upload-icon"></div>
              <p class="icon-title">导入场次</p>
              <p class="icon-tip">点击此处选择要导入的文件</p>
            </el-button>
          </el-upload>
        </el-row>
        <el-row style="text-align: center; margin-top: 25px" class="download-btns">
          <el-button size="small" type="info" plain @click="downloadModelxlsx">下载模板</el-button>
          <el-button size="small" type="info" plain @click="downloadModelDesc"
            >下载使用说明文档</el-button
          >
        </el-row>
      </div>
    </el-dialog>
    <SceneDetailDialog ref="sceneDetailDialog" />
  </section>
</template>

<script>
import { queryDisplays, deleteDisplay, saveDisplay, updateDisplay } from '@/api/display';
import { displayTypeFormate, dateFormat, addDateFormat } from '@/utils/format';
import { fileMaxSize, fileMaxSizeTips } from '@/utils/config'; // USER_ROLE
import { queryStarSug } from '@/api/star';
// import {getUserInfo} from '@/api/auth'
import { uploadFile } from '@/api/upload';
import {
  displayTypeOptions,
  isPresellOptions,
  isDisplayOptions,
  latestDisplayTimeOptions,
  presellSelectOption,
} from '@/const/options';
import { domain } from '@/utils/variable';
import { ROLE_CODE, RIGHT_CODE } from '@/const/roleCode';
import PubSub from 'pubsub-js';
import SceneDetailDialog from './component/SceneDetailDialog';
import qs from 'query-string';
import { getToken } from '@/utils/token';
import { RouterNameProjectManage } from '@/const/router';

export default {
  props: ['ctype'],
  components: {
    SceneDetailDialog,
  },
  data() {
    return {
      isDisable: false,
      RIGHT_CODE,
      lotImportDialogVisible: false,
      isPresellOptions,
      isDisplayOptions,
      latestDisplayTimeOptions,
      searchDisplayForm: {
        starName: '',
        addBy: '',
        displayTime: '',
        latestDisplayTime: '',
        isDisplay: '',
        isPresell: '',
      },
      allAddBy: [],
      isQueryDisplay: false,

      domain: domain,
      fileList: [],
      uploadLoading: false,

      isFlagSalesCls: false,
      isAdminUser: true,
      checkStar: false,

      isAddButton: false,
      pagination: {
        currentPage: 1,
        pageSize: 10,
        pageSizes: [10, 20, 30],
        total: 100,
      },
      displayDialogTitle: '新增场次',
      displayData: [],
      displayData_loading: true,
      ProductData_loading: true,
      dialogTableVisible: false,
      ProductData: [],
      addDisplayDialogVisible: false,
      displayInfoForm: {
        title: '',
        starName: '',
        starId: '',
        category: '',
        displayType: '',
        pv: '',
        displayTime: null,
        id: '',
        isPresell: false,
      },
      // categoryOptions,
      displayTypeOptions,
      searchConditions: {
        num: 1000,
      },
      allStars: [],
      starSuggest: [],
      currentStarName: '',
      currentstarId: '',
      isSameStar: false,
      delDisplay: [],
      presellSelectOption,
      addAndImmportDialogVisiable: false, // 新增场次和带入弹窗显示标志
      dialogShowBlockIndex: 0, // 场次弹窗标志
    };
  },
  created() {
    // getUserInfo().then(response => {
    //   // 只有项目经理无法操作
    //   if (response.data.data.role === USER_ROLE.PROJECT_MANAGER) {
    //     this.isAdminUser = false
    //   }
    // })
    const role = this.$store.getters['user/getUserRole'];
    if (role === ROLE_CODE.customer_manager) {
      this.isAdminUser = false;
    }

    queryStarSug(this.searchConditions).then(response => {
      const result = response.data;
      if (result.success) {
        this.allStars = [];
        result.data.star_data.forEach(item => {
          this.allStars.push({
            value: item.star_name,
            star_id: item.star_id,
          });
        });
        this.allAddBy = result.data.user_data;
      } else {
        if (result.error_code !== 100) {
          this.$gmMessage(result.message, 'tip');
        }
      }
    });
    const queryDataKey = Object.keys(this.$route.query);
    if (queryDataKey.length > 0) {
      queryDataKey.forEach(key => {
        this.searchDisplayForm[key] = this.$route.query[key];
      });
    }
    this.queryDisplays();

    this.subscribeAddScene();
  },
  activated() {
    this.queryDisplays();
  },
  methods: {
    subscribeAddScene() {
      if (this.ctype === 'cooperative') {
        // 监听消息
        PubSub.subscribe('addScene', (msg, data) => {
          if (data) {
            this.queryDisplays();
          }
        });
      }
    },
    // 下载doc模板
    downloadModelDesc() {
      window.open(domain + '/template/display_upload_doc.docx');
      this.lotImportDialogVisible = false;
    },
    // 批量删除场次
    batchDelete() {
      if (this.delDisplay.length === 0) {
        this.$gmMessage('请先选择场次', 'tip');
      } else {
        this.$confirm('此操作将删除该数据, 是否继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          iconClass: 'warning-icon',
        })
          .then(() => {
            const displaypass = {
              id: JSON.stringify(this.delDisplay),
            };
            this.displayData_loading = true;
            deleteDisplay(displaypass).then(response => {
              const result = response.data;
              this.displayData_loading = false;
              if (result.success) {
                this.$gmMessage(result.message);
                this.queryDisplays();
              } else {
                this.$gmMessage(result.message, 'tip');
              }
            });
          })
          .catch(() => {
            /* do nth */
          });
      }
    },
    // 处理选中项
    handleSelectionChange(val) {
      this.delDisplay = [];
      val.forEach(item => {
        this.delDisplay.push(item.id);
      });
    },
    // 搜索场次
    searchDisplay() {
      const queryData = JSON.parse(JSON.stringify(this.searchDisplayForm));
      Object.keys(queryData).forEach(key => {
        if (queryData[key] === '' || queryData[key] === null) delete queryData[key];
      });
      // this.$router.push({path: '/data/display-info', query: queryData})
      if (this.ctype !== 'cooperative') {
        this.$router.push({
          name: RouterNameProjectManage.marketing.display.list,
          query: queryData,
        });
      }
      this.pagination.currentPage = 1;
      this.queryDisplays();
    },
    // 查询条件重置
    searchReset() {
      this.searchDisplayForm = {
        starName: '',
        addBy: '',
        displayTime: '',
        latestDisplayTime: '',
        isDisplay: '',
        isPresell: '',
      };
      this.searchDisplay();
    },
    // 获取场次类型
    getDisplayType(val) {
      this.displayTypeOptions.forEach(item => {
        if (val === item.value) {
          val = item.label;
        }
      });
      return val;
    },
    // 下载模板
    downloadModelxlsx: function () {
      window.open(this.domain + '/api/star/upload_display_template');
      this.lotImportDialogVisible = false;
    },
    // 导入场次
    uploadDisplay(param) {
      this.uploadLoading = true;
      const file = param.file;
      if (file.size > fileMaxSize) {
        this.$message.error(fileMaxSizeTips);
        this.uploadLoading = false;
        return;
      }
      const form = new FormData();
      form.append('file', file);
      form.append('operate', 'display');
      uploadFile(form).then(response => {
        const result = response.data;
        if (result.success) {
          // this.$gmMessage({
          //   content: result.message,
          //   type: 'tip',
          //   showBtn: true,
          //   duration: 0
          // })
          this.$gmMessage({
            content: result.message,
            type: 'success',
            showBtn: true,
            duration: 0,
            submutConfig: {
              visible: true,
              primaryText: '查看结果',
              infoText: '继续导入',
              callback: () => {
                this.addAndImmportDialogVisiable = false;
                this.$router.push({
                  name: RouterNameProjectManage.marketing.importLog,
                });
              },
            },
          });
          setTimeout(() => {
            this.queryDisplays();
          }, 500);
          this.lotImportDialogVisible = false;
          this.uploadLoading = false;
        } else {
          this.$gmMessage(result.message, 'tip');
          this.uploadLoading = false;
        }
      });
    },
    // 关闭新增场次弹窗
    closeAddDiplayDialog: function (formName) {
      this.$refs[formName].resetFields();
      this.queryDisplays();
    },
    // 导出
    exportStarSubmit: function () {
      const display_ids = JSON.parse(JSON.stringify(this.delDisplay));
      if (display_ids.length > 0) {
        const ptemp = {
          display_ids: JSON.stringify(display_ids),
        };
        const url = `${this.domain}/api/star/export_displays?${qs.stringify(
          ptemp,
        )}&Authorization=${getToken()}`;
        window.open(url);
      } else {
        let exportpass = {
          star_id: '',
        };
        this.allStars.forEach(item => {
          if (item.value === this.searchDisplayForm.starName) {
            exportpass.star_id = item.star_id;
          }
        });
        const displaypass = {
          star_name: this.searchDisplayForm.starName,
          add_by: this.searchDisplayForm.addBy,
          display_time: this.searchDisplayForm.displayTime,
          latest_display_time: this.searchDisplayForm.latestDisplayTime,
          num: this.pagination.pageSize,
          page_num: this.pagination.currentPage,
          is_display: this.searchDisplayForm.isDisplay,
          is_presell: this.searchDisplayForm.isPresell,
        };
        const queryData = JSON.parse(JSON.stringify(displaypass));
        Object.keys(queryData).forEach(key => {
          if (queryData[key] === '' || queryData[key] === null) delete queryData[key];
        });
        exportpass = { ...queryData, ...exportpass };
        if (this.ctype === 'cooperative') {
          const _CooperationDetail = this.$store.getters['cooperative/CooperationDetail'];
          if (_CooperationDetail) {
            exportpass.cooperation_id = _CooperationDetail.cooperation_id;
          }
        }
        if (exportpass?.num) delete exportpass.num;
        if (exportpass?.page_num) delete exportpass.page_num;
        const url = `${this.domain}/api/star/export_displays?${qs.stringify(
          exportpass,
        )}&Authorization=${getToken()}`;
        window.open(url);
      }
    },
    // 主播昵称输入的时候
    starKeyUp: function () {
      // console.log(Date.now())
      this.starSuggest = this.allStars;
      this.allStars.forEach(star => {
        if (star.value !== this.displayInfoForm.starName) {
          this.displayInfoForm.starId = '';
        }
      });
    },
    // 加载对应的输入建议
    querySearchAdd(queryString, cb) {
      const starSuggest = this.starSuggest;
      const results = queryString
        ? starSuggest.filter(this.createFilter(queryString))
        : starSuggest;
      cb(results);
    },
    createFilter(queryString) {
      return starSuggest => {
        return starSuggest.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0;
      };
    },
    // 点击主播昵称选项
    handleSelectAdd(item) {
      this.isDisable = false;
      this.displayInfoForm.starId = item.star_id;
      // this.allStars.forEach((value) => {
      //   if (value.value === item.value) {
      //     this.displayInfoForm.starId = value.star_id
      //   }
      // })
    },
    // 新增场次
    addDisplay: function () {
      this.displayDialogTitle = '新增场次';
      this.isAddButton = true;
      this.checkStar = false;
      this.displayInfoForm = {
        title: '',
        starName: '',
        starId: '',
        displayType: '',
        pv: '',
        displayTime: null,
        id: '',
        isPresell: '',
        uv: '',
      };
      if (this.$route.query.starName) {
        this.displayInfoForm.starName = this.$route.query.starName;
        this.allStars.forEach(item => {
          if (item.value === this.$route.query.starName) {
            this.displayInfoForm.starId = item.star_id;
          }
        });
      }
    },
    // 修改场次
    updateDisplays: function (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const updatedisplaypass = {
            id: this.displayInfoForm.id,
            star_id: this.displayInfoForm.starId,
            star_name: this.displayInfoForm.starName,
            title: this.displayInfoForm.title,
            display_type: this.displayInfoForm.displayType,
            pv: this.displayInfoForm.pv,
            display_time: this.displayInfoForm.displayTime,
            is_presell: this.displayInfoForm.isPresell,
            uv: this.displayInfoForm.uv,
          };
          if (updatedisplaypass.uv === '未录入') updatedisplaypass.uv = '';
          if (updatedisplaypass.is_presell === '未录入') {
            this.$gmMessage('是否预售场不能为“未录入”', 'tip');
          } else {
            updateDisplay(updatedisplaypass)
              .then(response => {
                const data = response.data;
                if (data.success) {
                  this.$gmMessage(data.message);
                  this.addDisplayDialogVisible = false;
                } else {
                  this.$gmMessage(data.message, 'tip');
                }
              })
              .catch(error => {
                console.log(error);
              });
          }
        } else {
          return false;
        }
      });
    },
    // 保存场次
    saveDisplays: function (formName) {
      // 判断验证
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 防止重复点击
          this.isDisable = true;
          this.allStars.forEach(item => {
            if (
              this.displayInfoForm.starName === item.value &&
              this.displayInfoForm.starId === item.star_id
            ) {
              this.checkStar = true;
            }
          });
          if (this.checkStar) {
            const displaypass = {
              star_id: this.displayInfoForm.starId,
              star_name: this.displayInfoForm.starName,
              title: this.displayInfoForm.title,
              display_type: this.displayInfoForm.displayType,
              pv: this.displayInfoForm.pv,
              display_time: this.displayInfoForm.displayTime,
              is_presell: this.displayInfoForm.isPresell,
              uv: this.displayInfoForm.uv,
            };
            if (displaypass.is_presell) {
              displaypass.is_presell = 1;
            } else {
              displaypass.is_presell = 0;
            }
            saveDisplay(displaypass)
              .then(response => {
                const data = response.data;
                if (data.success) {
                  this.$gmMessage(data.message);
                  this.addAndImmportDialogVisiable = false;
                  this.queryDisplays();
                } else {
                  this.$gmMessage(data.message, 'tip');
                }
                this.isDisable = false;
              })
              .catch(error => {
                this.isDisable = false;
                console.log(error);
              });
          } else {
            this.$gmMessage('请检查主播ID和主播昵称', 'tip');
          }
        } else {
          return false;
        }
      });
    },
    // 当每页数量发生变化时
    handleSizeChange: function (val) {
      this.pagination.pageSize = val;
      this.$emit('handle-size-change', val);
      this.queryDisplays();
    },
    // 翻页
    handleCurrentChange: function () {
      this.queryDisplays();
    },
    // 查询场次
    queryDisplays: function () {
      const displaypass = {
        star_name: this.searchDisplayForm.starName,
        add_by: this.searchDisplayForm.addBy,
        display_time: this.searchDisplayForm.displayTime,
        latest_display_time: this.searchDisplayForm.latestDisplayTime,
        num: this.pagination.pageSize,
        page_num: this.pagination.currentPage,
        is_display: this.searchDisplayForm.isDisplay,
        is_presell: this.searchDisplayForm.isPresell,
      };
      if (this.ctype === 'cooperative') {
        const CooperationDetail = this.$store.getters['cooperative/CooperationDetail'];
        if (CooperationDetail) {
          displaypass.cooperation_id = CooperationDetail.cooperation_id;
        }
      }
      this.displayData_loading = true;
      queryDisplays(displaypass)
        .then(response => {
          const data = response.data;
          if (data.success) {
            if (data.data.total === 0) {
              this.isSameStar = false;
            } else {
              this.isSameStar = true;
            }
            this.pagination.total = data.data.total;
            this.displayData = [];
            for (const ii in data.data.data) {
              this.displayData.push({
                id: data.data.data[ii].id,
                title: data.data.data[ii].title,
                starId: data.data.data[ii].star_id,
                starName: data.data.data[ii].star_name,
                displayType: data.data.data[ii].display_type,
                pv: data.data.data[ii].pv,
                displayTime: data.data.data[ii].display_time,
                add_by: data.data.data[ii].add_by,
                modified_by: data.data.data[ii].modified_by,
                isPresell: data.data.data[ii].is_presell,
                modifiedTime: data.data.data[ii].gmt_modified,
                addTime: data.data.data[ii].gmt_create,
                isDisplay: data.data.data[ii].is_display,
                displaySalesAmount: data.data.data[ii].display_sales_amount,
                displaySalesNum: data.data.data[ii].display_sales_num,
                uv: data.data.data[ii].uv,
                products_num: data.data.data[ii].products_num,
                products_click_num: data.data.data[ii].products_click_num,
              });
            }
            this.displayData.forEach(item => {
              if (item.add_by === '') {
                item.add_by = ' - ';
              }
              if (item.modified_by === '') {
                item.modified_by = ' - ';
              }
              if (item.displaySalesAmount === -1) item.displaySalesAmount = 0;
              if (item.displaySalesNum === -1) item.displaySalesNum = 0;
              if (item.uv === -1) item.uv = '未录入';
              if (item.pv === -1) item.pv = '未录入';
            });
            this.displayData_loading = false;
          } else {
            if (data.error_code !== 100) {
              this.$gmMessage(data.message, 'tip');
            }
          }
        })
        .catch(error => {
          this.loading = false;
          console.log(error);
        });
    },
    // 点击编辑场次
    editDisplay: function (scope) {
      this.displayDialogTitle = '编辑场次';
      this.isAddButton = false;
      this.addDisplayDialogVisible = true;
      this.displayInfoForm.title = scope.title;
      this.displayInfoForm.starName = scope.starName;
      this.displayInfoForm.starId = scope.starId;
      this.displayInfoForm.displayType = scope.displayType;
      this.displayInfoForm.pv = scope.pv;
      this.displayInfoForm.displayTime = new Date(scope.displayTime);
      this.displayInfoForm.id = scope.id;
      this.displayInfoForm.isPresell = scope.isPresell;
      this.displayInfoForm.salesAmount = scope.salesAmount;
      this.displayInfoForm.salesNum = scope.salesNum;
      this.displayInfoForm.uv = scope.uv;
      if (this.displayInfoForm.isPresell === -1) this.displayInfoForm.isPresell = '未录入';
    },
    // 点击删除场次
    deleteDisplay: function (scope) {
      this.$confirm('此操作将删除该数据, 是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        iconClass: 'warning-icon',
      })
        .then(() => {
          const displaypass = {
            id: JSON.stringify(scope.id),
          };
          deleteDisplay(displaypass)
            .then(response => {
              const data = response.data;
              if (data.success) {
                this.$gmMessage(data.message);
                this.queryDisplays();
              } else {
                this.$gmMessage(data.message, 'tip');
              }
            })
            .catch(error => {
              console.log(error);
              this.loading = false;
            });
        })
        .catch(() => {
          /* do nth */
        });
    },
    // 点击跳转商品
    showProducts: function (scope) {
      const data = {
        displayId: scope.id,
        currentstarId: scope.starId,
        currentStarName: scope.starName,
      };
      if (this.ctype === 'cooperative') {
        this.$refs.sceneDetailDialog.show(data);
      } else {
        this.$router.push({
          name: RouterNameProjectManage.marketing.display.detail,
          params: { id: scope.id },
          // query: data,
        });
      }
    },
    displayTypeFormate,
    // categoryFormate,
    dateFormat,
    addDateFormat,
    // 点击单个场次数据
    handleDisplayCellClick(row) {
      this.showProducts(row);
    },
    // 总销售情况的表头小提示
    TotalSales() {
      return (
        <span>
          总销售情况
          <el-tooltip placement="top" effect="light">
            <div slot="content">
              <p>
                未出单（有销售数据）：该销售额或销售量属于关联商品的情况下，显示【未出单】状态。
              </p>
              <p>未出单（无销售数据）：没有录入销售数据的情况下，系统默认显示【未出单】状态。</p>
              <p>已出单：有录入销售数据，且商品不是关联商品，显示【已出单】状态。</p>
              <p>关联商品：关联商品指，直播间商品中，非构美平台合作的商品。</p>
            </div>
            <i
              class="el-icon-question"
              style="cursor:pointer;margin-left:2px;     color: #ccc;"
            ></i>
          </el-tooltip>
        </span>
      );
    },
  },
  // watch:{
  //    $route: {
  //      // 从别处进入触发刷新，详情页返回不触发
  //     handler(val, oldval) {
  //       if (val.name === "场次管理" && oldval.name !== "商品详情") {
  //         // this.searchReset();
  //       }
  //     }
  //   }
  // }
};
</script>

<style lang="scss">
@import '@/styles/vars.scss';

.search-display-item {
  // .el-form-item__label {
  //   width: 29%;
  //   overflow: hidden;
  //   white-space: nowrap;
  //   text-overflow: ellipsis;
  // }
  // .el-form-item__content {
  //   width: 70%;
  //   .el-input {
  //     width: 100%;
  //   }
  // }
}
.upload-display-falied {
  .el-dialog__body {
    padding-top: 0;
  }
}
.addDisplay-dialog {
  .el-form-item__error {
    margin-right: 10%;
    top: -16px;
  }
  .el-form-item__label {
    padding-bottom: 0;
    line-height: 18px;
    margin-left: 10%;
  }
  .el-dialog__footer {
    border-top: 1px solid #f0f1f2;
    padding: 15px 20px;
  }
  .el-dialog__body {
    padding: 10px 20px;
  }
  .el-dialog__header {
    background: #f8f8f8;
    border-bottom: #efefef solid 1px;
    color: var(--text-second-color);
    .el-dialog__headerbtn .el-dialog__close {
      color: var(--icon-color) !important;
      position: relative;
      top: -7px;
    }
  }
}
</style>
<style lang="scss" scoped>
@import '@/assets/scss/displayInfo.scss';
</style>

<style lang="less" scoped>
// 排除掉新增的和最近维护的页面
// 1. 客户列表
.router-view-content:not(.tg-page-container) {
  .el-table td,
  .el-table th {
    padding: 8px 0;
    min-height: 50px;
    text-align: left;
  }
}
</style>

<style lang="less">
.jianxiao {
  padding-left: 4px !important;
}
.add-and-immport-dialog .el-form-item--small .el-form-item__label {
  line-height: 15px;
  padding-bottom: 4px;
}
.add-and-immport-dialog .el-dialog {
  min-width: 600px;
  max-width: 600px;
}
.add-and-immport-dialog .el-dialog__header {
  background: #f8f8f8;
  border-bottom: #efefef solid 1px;
  color: #666;
  padding: 0;
  text-align: left !important;
}
.add-and-immport-dialog .el-dialog__headerbtn i {
  color: #909399 !important;
  position: relative;
  top: -3px;
}
.add-and-immport-dialog .cutom-header span {
  color: #666 !important;
  line-height: 50px;
  display: inline-block;
  width: 120px;
  text-align: center;
  cursor: pointer;
}
.add-and-immport-dialog .cutom-header span.active2 {
  background: #fff;
  color: #5c82ff !important;
  position: relative;
}
.add-and-immport-dialog .cutom-header span.active2::after {
  content: ' ';
  display: block;
  width: 100%;
  height: 2px;
  position: absolute;
  left: 0;
  bottom: -2px;
  background: #fff;
}
.add-and-immport-dialog .el-form-item {
  width: 79%;
  margin: 2px auto;
  position: relative;
  margin-left: 10%;
}
.add-and-immport-dialog .el-autocomplete {
  width: 100%;
}
.add-and-immport-dialog .el-select.el-select--small {
  width: 100%;
}
.add-and-immport-dialog .el-date-editor.el-input {
  width: 100%;
}
.add-and-immport-dialog .dialog-footer {
  display: block;
  text-align: center;
  margin-top: 25px;
}
.add-and-immport-dialog .import-wrap .el-upload {
  display: block;
  width: 500px;
  height: 240px;
  margin: 0 auto;
}
.add-and-immport-dialog .import-wrap .el-upload button {
  display: block;
  width: 100% !important;
  height: 100%;
  background: #fcfcfc;
  border: #d0d0d0 dashed 1px;
}
.add-and-immport-dialog .upload-icon {
  width: 78px;
  height: 70px;
  background: url(../../assets/img/import_icon.png) 0 0 no-repeat;
  margin: 0 auto;
}
.add-and-immport-dialog .import-wrap .el-upload button:hover .upload-icon {
  background-position: -78px 0;
}
.display-table .el-table__row {
  cursor: pointer;
}
.display-title {
  // height: 23px;
  line-height: 20px;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #396fff;
  font-size: 14px;
}
.add-and-immport-dialog .download-btns button {
  width: auto !important;
  display: inline-block;
  margin: 20px 0;
  text-decoration: none;
  color: #666;
  width: 140px;
  height: 34px;
  line-height: 34px;
  border-radius: 2px;
  font-size: 14px;
  border: solid 1px #dcdcdc !important;
  background: #f6f6f6;
  padding: 0 20px;
}
.add-and-immport-dialog .download-btns button:hover {
  background: #f2f2f2 !important;
  color: #555 !important;
}
.add-and-immport-dialog .download-btns button:active2 {
  border-color: #396fff !important;
}
.color-blue {
  color: #396fff;
}
.rect-100-36 {
  width: 100px;
  height: 36px;
}
.btn {
  width: 60px;
  height: 30px;
  padding: 0;
}

// 排除掉新增的和最近维护的页面
// 1. 客户列表
.router-view-content:not(.tg-page-container) {
  .el-table td,
  .el-table th {
    padding: 8px 0;
    min-height: 50px;
  }
}
</style>
