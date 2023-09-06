<!--
 * @Description: KOL 个人库
 * @Author: 白青
 * @Date: 2019-08-29 11:23:15
 * @LastEditTime: 2021-07-29 11:23:41
 * @LastEditors: 肖槿
 -->
<template>
  <div
    id="personal-library"
    class="personal-library-list"
    style="flex-grow: 1; display: flex; flex-direction: column"
  >
    <tg-card class="medium-operator" style="flex: none">
      <tg-card class="medium-choose">
        <div class="choose-block">
          <div class="name">擅长平台：</div>
          <div class="category-list">
            <div
              class="category-item"
              :class="{ current: searchForm.platform === item.key }"
              v-for="item in cooperationPlatformList"
              :key="item.type"
              @click="selectTypeHandle('platform', item.key)"
            >
              <i :class="item.icon"></i>
              {{ item.value }}
            </div>
          </div>
        </div>
        <div class="choose-block">
          <div class="name">媒介类型：</div>
          <div class="category-list">
            <div
              class="category-item"
              :class="{ current: searchForm.platform_type === item.key }"
              v-for="item in mediaTypeList"
              :key="item.type"
              @click="selectTypeHandle('platform_type', item.key)"
            >
              {{ item.value }}
            </div>
          </div>
        </div>
        <div class="choose-block category-fold" style="padding-right: 80px">
          <div class="name">擅长领域：</div>
          <div class="category-list category-height" :style="foldFlag && 'height:auto;'">
            <div
              class="category-item"
              :class="{ current: searchForm.area === item.key }"
              v-for="item in areaTypeList"
              :key="item.key"
              @click="selectTypeHandle('area', item.key)"
            >
              {{ item.value }}
            </div>
          </div>
          <i
            @click="foldFlag = !foldFlag"
            :class="foldFlag ? 'fold el-icon-arrow-up' : 'fold el-icon-arrow-down'"
          ></i>
        </div>
        <div class="choose-block">
          <div class="name">KOL标签：</div>
          <div class="category-list">
            <div
              class="category-item"
              :class="{ current: searchForm.kol_tag === item.key }"
              v-for="item in kolTagList"
              :key="item.key"
              @click="selectTypeHandle('kol_tag', item.key)"
            >
              {{ item.value }}
            </div>
          </div>
        </div>
      </tg-card>
      <el-form class="medium-search-bar" :inline="true" size="small">
        <el-form-item class="medium-cls">
          <template #label>
            <span class="medium-label">是否专票：</span>
          </template>
          <el-select v-model="searchForm.special_ticket" placeholder="请选择" style="width: 100px">
            <el-option
              v-for="item in ticketList"
              :key="item.label"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="medium-cls">
          <template #label>
            <span class="medium-label" style="margin-left: 10px">是否合作：</span>
          </template>
          <el-select v-model="searchForm.is_coop" placeholder="请选择" style="width: 100px">
            <el-option
              v-for="item in conbinList"
              :key="item.label"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="medium-cls">
          <template #label>
            <span class="medium-label" style="margin-left: 10px">业务类型：</span>
          </template>
          <el-select v-model="business_type">
            <el-option label="全部" value="" />
            <el-option
              :label="opt.label"
              :value="opt.value"
              :key="opt.value"
              v-for="opt in BusinessTypeOptions"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-show="searchForm.platform !== ''" class="medium-cls">
          <template #label>
            <span class="medium-label" style="margin-left: 10px">粉丝数：</span>
          </template>
          <el-input
            class="range-input"
            v-model="searchForm.min_fans_num"
            @keyup.native="handleInputNumber('min_fans_num')"
          >
            <template #suffix>
              <span class="suffix">万</span>
            </template>
          </el-input>
          -
          <el-input
            class="range-input"
            v-model="searchForm.max_fans_num"
            @keyup.native="handleInputNumber('max_fans_num')"
          >
            <template #suffix>
              <span class="suffix">万</span>
            </template>
          </el-input>
        </el-form-item>
      </el-form>
      <el-form class="medium-search-bar" :inline="true" size="small">
        <el-form-item class="medium-cls">
          <template #label>
            <span class="medium-label">昵称搜索：</span>
          </template>
          <el-input
            v-model.trim="searchForm.kol_name"
            style="width: 210px"
            placeholder="请输入KOL昵称"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item class="medium-cls">
          <template #label>
            <span class="medium-label">合作品牌：</span>
          </template>
          <el-input
            v-model.trim="searchForm.cooperation_brand"
            style="width: 210px"
            placeholder="请输入合作品牌"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button class="btn btn-blue" type="primary" @click="clickQueryMedium">查询</el-button>
        </el-form-item>
        <el-form-item>
          <tg-button type="negative" size="small" @click="resetMedium">重置</tg-button>
        </el-form-item>
      </el-form>
    </tg-card>
    <tg-card class="result-list" :padding="[10, 18, 12, 18]" style="flex-grow: 1">
      <div class="btns-line">
        <tg-button
          type="primary"
          icon="ico-btn-add"
          v-if="Permission.canCreateKol"
          @click="handleAddKolClick"
          >新增KOL</tg-button
        >
        <tg-button
          icon="ico-btn-export"
          v-if="Permission.canExportKol && pagination.total !== 0"
          @click="handleExportKolClick"
          >导出</tg-button
        >
        <tg-button
          type="negative"
          icon="ico-btn-delete"
          v-if="Permission.canDeleteKol"
          @click="handleBatchDeleteKolClick"
          >删除</tg-button
        >
      </div>
      <div class="list">
        <el-table
          v-if="Permission.canViewKolList"
          :data="results"
          style="width: 100%"
          v-loading="loading"
          stripe
          :header-cell-style="{
            backgroundColor: 'var(--table-thead-th-bg-color)',
            color: 'var(--text-second-color)',
          }"
          :cell-style="{ cursor: 'pointer' }"
          @row-click="handleRowClick"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="50" fixed="left"></el-table-column>
          <el-table-column
            :formatter="
              (row, column, cellValue, index) => (pagination.currentPage - 1) * 10 + (index + 1)
            "
            label="序号"
            width="70"
            fixed="left"
            align="center"
          />
          <el-table-column min-width="140" max-width="300" prop="contract_uid" label="KOL基础信息">
            <template v-slot="{ row }">
              <div class="star-info">
                <img v-if="row.kol_info.avatar" :src="row.kol_info.avatar" class="avatar" />
                <img v-else src="@/assets/img/kol/default_pic.png" class="avatar default" />
                <div class="content">
                  <div class="title">{{ row.kol_info.kol_name }}</div>
                  <div class="tags">
                    <div class="tag tag1" v-if="row.kol_info.kol_tag">
                      <i class="iconfont icon-zuanshi"></i>
                      {{ kolTagFormat(row.kol_info.kol_tag) }}
                    </div>
                    <div class="tag tag2" v-show="row.kol_info.is_cooperation === 1">
                      <i class="iconfont icon-hezuo"></i>
                      已合作
                    </div>
                    <div class="tag tag3" v-if="row.kol_info.special_ticket === 1">
                      <i class="iconfont icon-zhuanpiao1-copy"></i>
                      <span>提供专票</span>
                    </div>
                    <div class="tag tag4" v-if="row.kol_info.special_ticket === 0">
                      <i class="iconfont icon-zhuanpiao1-copy"></i>
                      <span>不提供专票</span>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="contract_uid" label="擅长平台 / 粉丝数">
            <template #default="{ row }">
              <el-popover
                placement="bottom-start"
                trigger="hover"
                width="130"
                visible-arrow="false"
                popper-class="personal-library-active-platform-popover personal-library-public-popover"
                v-if="platformsAndfunsSort(row).length > 0"
              >
                <div style="padding: 0 18px">
                  <div
                    style="
                      display: flex;
                      flex-direction: row;
                      align-items: center;
                      margin-top: 10px;
                    "
                    v-for="(item, index) in platformsAndfunsSort(row)"
                    :key="index"
                  >
                    <img :src="item.src" style="width: 20px; height: 20px; margin-right: 5px" />
                    <span>{{ item.fans_number === '0万' ? 0 : item.fans_number }}</span>
                  </div>
                </div>
                <template slot="reference">
                  <div class="area_funs">
                    <div
                      class="detail_info"
                      v-for="(item, index) in platformsAndfunsSort(row, false)"
                      :key="index"
                    >
                      <img :src="item.src" />
                      <span>{{ item.fans_number === '0万' ? 0 : item.fans_number }}</span>
                    </div>
                    <!-- 超过3显示... -->
                    <p v-if="row.kol_info.platforms.split('、').length > 3">...</p>
                  </div>
                </template>
              </el-popover>
              <div v-else>--</div>
            </template>
          </el-table-column>
          <el-table-column prop="contract_uid" label="擅长领域">
            <template #default="{ row }">
              <div v-if="areaFormat(row.kol_info.areas).length === 1">
                <p class="kol_areas">{{ areaFormat(row.kol_info.areas)[0] }}</p>
              </div>
              <el-popover
                placement="bottom-start"
                trigger="hover"
                visible-arrow="false"
                popper-class="personal-library-active-platform-popover personal-library-public-popover"
                v-if="areaFormat(row.kol_info.areas).length > 1"
              >
                <p
                  class="kol_areas"
                  v-for="(item, index) in areaFormat(row.kol_info.areas)"
                  :key="index"
                >
                  {{ item }}
                </p>
                <template slot="reference">
                  <div>
                    <p v-for="(item, index) in areaFormat(row.kol_info.areas, false)" :key="index">
                      {{ item }}
                    </p>
                  </div>
                </template>
              </el-popover>
              <div v-if="areaFormat(row.kol_info.areas).length > 3">...</div>
              <div v-if="areaFormat(row.kol_info.areas).length === 0">--</div>
            </template>
          </el-table-column>
          <el-table-column prop="contract_uid" min-width="120px" label="刊例价 / 元">
            <template #default="{ row }">
              <el-popover
                placement="bottom-start"
                trigger="hover"
                popper-class="personal-library-klprice "
                v-if="klpriceFomartAndDis(row, false).length > 0"
              >
                <template slot="reference">
                  <div class="fans-count-wrap">
                    <p
                      class="klprice"
                      v-for="(item, index) in klpriceFomartAndDis(row, false)"
                      :key="index"
                    >
                      {{ item.name
                      }}{{
                        Object.keys(item.klprice)[0].substring(
                          0,
                          Object.keys(item.klprice)[0].length - 3,
                        )
                      }}:
                      <span class="many">{{ item.klprice[Object.keys(item.klprice)[0]] }}</span>
                    </p>
                    <!-- 超过3显示... -->
                    <p v-if="row.kol_info.platforms.split('、').length > 3">...</p>
                  </div>
                </template>
                <div class="personal-library-public-popover-content">
                  <div v-for="(item, index) in klpriceFomartAndDis(row)" :key="index">
                    <p style="padding: 0 12px; font-size: 14px; margin-bottom: 3px">
                      {{ item.name }}:
                    </p>
                    <el-row>
                      <el-col
                        :span="12"
                        v-for="(item1, index1) in Object.keys(item.klprice)"
                        :key="index1"
                        style="font-size: 14px; margin-top: 5px"
                      >
                        <span style="color: #666; margin-left: 10px">{{ item1 }}：</span>
                        <span style="color: #ff731e">{{ item.klprice[item1] }}</span>
                      </el-col>
                    </el-row>
                    <hr
                      style="border: 1px dashed rgba(233, 228, 228, 0.979)"
                      v-show="index < klpriceFomartAndDis(row).length - 1"
                    />
                  </div>
                </div>
              </el-popover>
              <div v-else>--</div>
            </template>
          </el-table-column>
          <el-table-column prop="contract_uid" label="合作品牌">
            <template #default="{ row }">
              <el-popover
                placement="bottom-start"
                trigger="hover"
                width="150"
                visible-arrow="false"
                popper-class="personal-library-active-platform-popover personal-library-public-popover"
                v-if="cooperationbrandFormat(row.kol_info.cooperation_brand).length > 0"
              >
                <div style="padding: 0 18px">
                  <div v-if="row.kol_info.cooperation_brand.length > 0">
                    <p
                      v-for="(item, index) in cooperationbrandFormat(
                        row.kol_info.cooperation_brand,
                      )"
                      :key="index"
                    >
                      {{ item }}
                    </p>
                  </div>
                </div>
                <template slot="reference">
                  <div>
                    <div v-if="row.kol_info.cooperation_brand.length > 0">
                      <p
                        v-for="(item, index) in cooperationbrandFormat(
                          row.kol_info.cooperation_brand,
                          false,
                        )"
                        :key="index"
                      >
                        {{ item }}
                      </p>
                    </div>
                    <div v-if="row.kol_info.cooperation_brand.length > 3">
                      <p>...</p>
                    </div>
                  </div>
                </template>
              </el-popover>
              <div v-else>--</div>
            </template>
          </el-table-column>
          <template #empty>
            <div class="tg-page-empty">
              <empty-common detail-text="空空如也~"></empty-common>
            </div>
          </template>
        </el-table>
        <el-pagination
          v-if="Permission.canViewKolList"
          class="contract-pagination"
          :current-page.sync="pagination.currentPage"
          :page-sizes.sync="pagination.pageSizes"
          :page-size="pagination.pageSize"
          layout="total, prev, pager, next, sizes, jumper"
          :total="pagination.total"
          @current-change="handleCurrentChange"
          @size-change="handlePageSizeChange"
        />
      </div>
    </tg-card>
    <add-personal
      ref="addPersonalKolDialog"
      @added="clickQueryMedium"
      @edited="clickQueryMedium"
      @cancel="clickQueryMedium"
    />
    <personal-detail
      v-if="detailId"
      ref="personalDetailDialog"
      :detailId="detailId"
      @closed="closedDetail"
    />
  </div>
</template>

<script>
import AddPersonal from './addPersonal';
import { queryKolList, deleteKol, exportKol } from '@/api/medium';
import { RIGHT_CODE as NEW_RIGHT_CODE } from '@/const/rightCode';
import PersonalDetail from '../personalDetail';
import { deepClone } from '@/utils/tools';
import { platformList, mediaType, areaType, kolTag, kolTagFormat } from '@/const/kolConst';
import { RouterNameSupplier } from '@/const/router';
import { computed } from '@vue/composition-api';
import { HasPermission } from '@/use/permission';
import { BusinessTypeOptions } from '@/types/tiange/common';
import { ObjectFilterEmpty } from '@/utils/func';

const _areaType = deepClone(areaType);
const _kolTag = deepClone(kolTag);
_areaType.unshift({
  value: '全选',
  key: '',
});
_kolTag.unshift({
  value: '全选',
  key: '',
});
export default {
  name: 'PersonalLibrary',
  components: {
    AddPersonal,
    PersonalDetail,
  },
  setup(props, ctx) {
    /** 权限检查 */
    const Permission = computed(() => {
      const canViewKolList = HasPermission(NEW_RIGHT_CODE.kol_list);
      const canEditKol = HasPermission(NEW_RIGHT_CODE.kol_edit);
      const canCreateKol = HasPermission(NEW_RIGHT_CODE.kol_create);
      const canExportKol = HasPermission(NEW_RIGHT_CODE.kol_export);
      const canDeleteKol = HasPermission(NEW_RIGHT_CODE.kol_delete);

      return { canEditKol, canCreateKol, canViewKolList, canExportKol, canDeleteKol };
    });
    return { Permission };
  },
  data() {
    return {
      detailId: null, // 选中kol详情id
      foldFlag: false,
      cooperationPlatformList: platformList,
      mediaTypeList: mediaType,
      areaTypeList: _areaType,
      kolTagList: _kolTag,
      ticketList: [
        {
          label: '全部',
          value: '',
        },
        {
          label: '是',
          value: 1,
        },
        {
          label: '否',
          value: 0,
        },
      ],
      conbinList: [
        {
          label: '全部',
          value: '',
        },
        {
          label: '是',
          value: 1,
        },
        {
          label: '否',
          value: 0,
        },
      ],
      results: [],
      loading: false,
      pagination: {
        currentPage: 1,
        pageSize: 10,
        pageSizes: [10, 20, 30],
        total: 0,
      },
      selection: [], // 被选中的数据
      searchForm: {
        platform: '', // 擅长平台
        platform_type: '', // 媒介类型
        area: '', // 擅长领域
        kol_tag: '', // kol标签
        special_ticket: '', // 是否专票
        kol_name: '', // kol昵称
        cooperation_brand: '', // 合作品牌
        is_coop: '', // 是否合作
        min_fans_num: '', // 最小粉丝数
        max_fans_num: '', // 最大粉丝数
      },
      business_type: '',
      BusinessTypeOptions,
    };
  },
  created() {
    // this.clickQueryMedium();
  },
  mounted() {
    this.clickQueryMedium();
  },
  activated() {
    this.clickQueryMedium();
  },
  methods: {
    // kol标签格式化
    kolTagFormat,
    // 关闭详情页
    closedDetail() {
      if (this.$route.query.kol_name) {
        this.$router.push({
          name: RouterNameSupplier.list,
        });
        this.detailId = null;
        this.clickQueryMedium();
      } else {
        this.detailId = null;
        this.clickQueryMedium();
      }
    },
    // 擅长平台排序(根据所选擅长平台进行排序)
    platformsSort(kolobj) {
      try {
        const { platforms } = kolobj.kol_info;
        if (platforms === '') {
          return [];
        }
        const { platform } = this.searchForm;
        const platformArr = platforms.split('、');
        const platformIndex = platformArr.findIndex(pp => pp === platform);
        let newplatformArr = [];
        if (platform !== '' && platformIndex > -1) {
          platformArr.splice(platformIndex, 1);
          newplatformArr = [platform].concat(platformArr);
        } else {
          newplatformArr = platformArr;
        }
        return newplatformArr;
      } catch (error) {
        return [];
      }
    },
    // 擅长以及粉丝数平台排序
    platformsAndfunsSort(kolobj, isall = true) {
      try {
        const newplatformArr = this.platformsSort(kolobj);
        const result = [];
        if (newplatformArr.length <= 0) {
          return [];
        }
        newplatformArr.forEach(pp => {
          if (pp === 'tb') {
            if (kolobj['star_info']) {
              result.push({
                name: platformList.find(ff => ff.key === pp).value,
                src: require(`@/assets/img/kol/${pp}.png`),
                fans_number:
                  kolobj['star_info'].fans_number === ''
                    ? '--'
                    : `${kolobj['star_info'].fans_number}万`,
              });
            }
          } else {
            if (kolobj[`kol_${pp}_info`]) {
              result.push({
                name: platformList.find(ff => ff.key === pp).value,
                src: require(`@/assets/img/kol/${pp}.png`),
                fans_number:
                  kolobj[`kol_${pp}_info`].fans_number === ''
                    ? '--'
                    : `${kolobj[`kol_${pp}_info`].fans_number}万`,
              });
            }
          }
        });
        if (isall) {
          return result;
        } else {
          return result.splice(0, 3);
        }
      } catch (error) {
        return [];
      }
    },
    // 刊例价排序展示
    klpriceFomartAndDis(kolobj, isall = true) {
      try {
        const newplatformArr = this.platformsSort(kolobj);
        const result = [];
        if (newplatformArr.length <= 0) {
          return [];
        }
        newplatformArr.forEach(pp => {
          switch (pp) {
            case 'tb': // 淘宝
              result.push({
                name: platformList.find(ff => ff.key === pp).value,
                klprice: {
                  混播刊例价: kolobj['star_info'].star_mix_price || '--',
                  专场刊例价: kolobj['star_info'].star_special_price || '--',
                  视频刊例价: kolobj['star_info'].video_publish_price || '--',
                  图文刊例价: kolobj['star_info'].photo_publish_price || '--',
                },
              });
              break;
            case 'douyin': // 抖音
              result.push({
                name: platformList.find(ff => ff.key === pp).value,
                klprice: {
                  混播单链接刊例价: kolobj[`kol_${pp}_info`].live_mix_publish_price || '--',
                  专场刊例价: kolobj[`kol_${pp}_info`].live_special_publish_price || '--',
                  '21-60s视频刊例价': kolobj[`kol_${pp}_info`].video_21_60_publish_price || '--',
                  '1-20s视频刊例价': kolobj[`kol_${pp}_info`].video_1_20_publish_price || '--',
                },
              });
              break;
            case 'kuaishou': // 快手
              result.push({
                name: platformList.find(ff => ff.key === pp).value,
                klprice: {
                  混播刊例价: kolobj[`kol_${pp}_info`].live_mix_publish_price || '--',
                  专场刊例价: kolobj[`kol_${pp}_info`].live_special_publish_price || '--',
                  视频刊例价: kolobj[`kol_${pp}_info`].video_publish_price || '--',
                },
              });
              break;
            case 'bili': // 哔哩
              result.push({
                name: platformList.find(ff => ff.key === pp).value,
                klprice: {
                  视频刊例价: kolobj[`kol_${pp}_info`].video_publish_price || '--',
                },
              });
              break;
            case 'yizhibo': // 一直播
              result.push({
                name: platformList.find(ff => ff.key === pp).value,
                klprice: {
                  直播刊例价: kolobj[`kol_${pp}_info`].live_publish_price || '--',
                },
              });
              break;
            case 'weibo': // 微博
              result.push({
                name: platformList.find(ff => ff.key === pp).value,
                klprice: {
                  直发刊例价: kolobj[`kol_${pp}_info`].direct_publish_price || '--',
                  转发刊例价: kolobj[`kol_${pp}_info`].trans_publish_price || '--',
                },
              });
              break;
            case 'wechat': // 微信
              result.push({
                name: platformList.find(ff => ff.key === pp).value,
                klprice: {
                  头条刊例价: kolobj[`kol_${pp}_info`].photo_headline_publish_price || '--',
                  次条刊例价: kolobj[`kol_${pp}_info`].photo_second_publish_price || '--',
                },
              });
              break;
            case 'xhs': // 小红书
              result.push({
                name: platformList.find(ff => ff.key === pp).value,
                klprice: {
                  视频刊例价: kolobj[`kol_${pp}_info`].video_publish_price || '--',
                  图文刊例价: kolobj[`kol_${pp}_info`].photo_publish_price || '--',
                  直播刊例价: kolobj[`kol_${pp}_info`].live_publish_price || '--',
                },
              });
              break;
            default:
              break;
          }
        });
        if (isall) {
          return result;
        } else {
          return result.splice(0, 3);
        }
      } catch (error) {
        return [];
      }
    },
    // 擅长领域格式化
    areaFormat(areas, isall = true) {
      if (areas === '') {
        return [];
      }
      if (isall) {
        return areas.split('、');
      } else {
        return areas.split('、').splice(0, 3);
      }
    },
    // 合作品牌格式化
    cooperationbrandFormat(cooperationbrand, isall = true) {
      if (isall) {
        return [...cooperationbrand];
      } else {
        return [...cooperationbrand].splice(0, 3);
      }
    },
    // 处理input框整数
    handleInputNumber(key) {
      if (this.searchForm[key]) {
        this.searchForm[key] = this.searchForm[key].replace(/[^\\.\d]/g, '');
      }
    },
    // 新窗口自动进入详情
    handleRowClick1() {
      this.detailId = this.$route.query.kol_id;
      this.$nextTick(function () {
        this.$refs.personalDetailDialog.visible = true;
      });
    },
    // 查询个人库
    clickQueryMedium(clean = true) {
      this.loading = true;
      this.searchForm.kol_name = this.$route.query.kol_name
        ? this.$route.query.kol_name
        : this.searchForm.kol_name;
      const formData = {
        ...this.searchForm,
        business_type: this.business_type,
        page: clean ? 1 : this.pagination.currentPage,
        num: this.pagination.pageSize,
      };
      queryKolList({ ...ObjectFilterEmpty(formData) })
        .then(res => {
          if (res.data.success) {
            // 处理数据
            res.data.data.data.map(item => {
              if (item.star_info) item['kol_tb_info'] = item.star_info;
              const platforms = item.kol_info.platforms.split('、'); // const platforms_list =
              // 遍历生成各个平台报价的数组
              const platformsList = [];
              platforms.forEach(platformKey => {
                // 处理价格
                let prices = '--';
                const currPlatformObj = platformList.find(
                  item => item.key !== '' && item.key === platformKey,
                );
                const platformName = currPlatformObj ? currPlatformObj.value : '';

                if (item[`kol_${platformKey}_info`]) {
                  switch (platformKey) {
                    case 'bili':
                      prices = item[`kol_${platformKey}_info`].video_price;
                      platformsList.push(
                        this.handleOneKolManyPlatformPriceFun(platformName, prices),
                      );
                      break;
                    case 'douyin':
                      // 直播专场
                      prices = item[`kol_${platformKey}_info`].live_special_price;
                      platformsList.push(
                        this.handleOneKolManyPlatformPriceFun(platformName + '(直播专场)', prices),
                      );
                      // 直播混播
                      prices = item[`kol_${platformKey}_info`].live_mix_price;
                      platformsList.push(
                        this.handleOneKolManyPlatformPriceFun(platformName + '(直播混播)', prices),
                      );
                      // 视频1-20秒
                      prices = item[`kol_${platformKey}_info`].video_1_20_price;
                      platformsList.push(
                        this.handleOneKolManyPlatformPriceFun(
                          platformName + '(视频1-20秒)',
                          prices,
                        ),
                      );
                      // 视频21-60秒
                      prices = item[`kol_${platformKey}_info`].video_21_60_price;
                      platformsList.push(
                        this.handleOneKolManyPlatformPriceFun(
                          platformName + '(视频21-60秒)',
                          prices,
                        ),
                      );
                      break;
                    case 'kuaishou':
                      // 视频
                      prices = item[`kol_${platformKey}_info`].video_price;
                      platformsList.push(
                        this.handleOneKolManyPlatformPriceFun(platformName + '(视频)', prices),
                      );
                      // 直播专场
                      prices = item[`kol_${platformKey}_info`].live_special_price;
                      platformsList.push(
                        this.handleOneKolManyPlatformPriceFun(platformName + '(直播专场)', prices),
                      );
                      // 直播混播
                      prices = item[`kol_${platformKey}_info`].live_mix_price;
                      platformsList.push(
                        this.handleOneKolManyPlatformPriceFun(platformName + '(直播混播)', prices),
                      );
                      break;
                    case 'tb':
                      // prices = item[`kol_${platformKey}_info`].taobao_live_mix_price + '/' + item[`kol_${platformKey}_info`].taobao_live_special_price
                      // 直播专场
                      prices = item[`kol_${platformKey}_info`].star_special_cost;
                      // prices = item[`star_info`].star_special_cost
                      platformsList.push(
                        this.handleOneKolManyPlatformPriceFun(platformName + '(直播专场)', prices),
                      );
                      // 直播混播
                      prices = item[`kol_${platformKey}_info`].star_mix_cost;
                      // prices = item[`star_info`].star_mix_cost
                      platformsList.push(
                        this.handleOneKolManyPlatformPriceFun(platformName + '(直播混播)', prices),
                      );
                      // 短视频
                      prices = item[`kol_${platformKey}_info`].video_price;
                      platformsList.push(
                        this.handleOneKolManyPlatformPriceFun(platformName + '(短视频)', prices),
                      );
                      // 图文
                      prices = item[`kol_${platformKey}_info`].photo_price;
                      platformsList.push(
                        this.handleOneKolManyPlatformPriceFun(platformName + '(图文)', prices),
                      );
                      // if () {
                      //   priceObj = this.handleOneKolManyPlatformPriceFun(platformName, prices)
                      // }
                      break;
                    // case 'tb_photo':
                    //   prices = item[`kol_${platformKey}_info`].taobao_photo_price
                    //   platformsList.push(this.handleOneKolManyPlatformPriceFun(platformName, prices))
                    //   break
                    case 'wechat':
                      // prices = item[`kol_${platformKey}_info`].photo_price
                      // platformsList.push(this.handleOneKolManyPlatformPriceFun(platformName, prices))
                      // 头条
                      prices = item[`kol_${platformKey}_info`].photo_headline_price;
                      platformsList.push(
                        this.handleOneKolManyPlatformPriceFun(platformName + '(头条)', prices),
                      );
                      // 次条
                      prices = item[`kol_${platformKey}_info`].photo_second_price;
                      platformsList.push(
                        this.handleOneKolManyPlatformPriceFun(platformName + '(次条)', prices),
                      );
                      break;
                    case 'weibo':
                      // 转发
                      prices = item[`kol_${platformKey}_info`].trans_price;
                      platformsList.push(
                        this.handleOneKolManyPlatformPriceFun(platformName + '(转发)', prices),
                      );
                      // 直发
                      prices = item[`kol_${platformKey}_info`].direct_price;
                      platformsList.push(
                        this.handleOneKolManyPlatformPriceFun(platformName + '(直发)', prices),
                      );
                      break;
                    case 'xhs':
                      // 图文
                      prices = item[`kol_${platformKey}_info`].photo_price;
                      platformsList.push(
                        this.handleOneKolManyPlatformPriceFun(platformName + '(图文)', prices),
                      );
                      // 视频
                      prices = item[`kol_${platformKey}_info`].video_price;
                      platformsList.push(
                        this.handleOneKolManyPlatformPriceFun(platformName + '(视频)', prices),
                      );
                      break;
                    case 'yizhibo':
                      prices = item[`kol_${platformKey}_info`].price;
                      platformsList.push(
                        this.handleOneKolManyPlatformPriceFun(platformName + '(直播)', prices),
                      );
                      break;
                    // case 'tb_video':
                    //   prices = item[`kol_${platformKey}_info`].taobao_video_price
                    //   platformsList.push(this.handleOneKolManyPlatformPriceFun(platformName, prices))
                    //   break
                  }
                }
                // return {
                //   platform_name: platformList.find(item => item.key === platformKey).value,
                //   price: prices
                // }
              });
              item['platforms_list'] = platformsList;
              // 遍历生成各个平台粉丝数的数组
              const platformsFansList = [];
              platforms.forEach(platformKey => {
                const currPlatformObj = platformList.find(
                  item => item.key !== '' && item.key === platformKey,
                );
                const platformName = currPlatformObj ? currPlatformObj.value : '';
                if (platformName) {
                  platformsFansList.push({
                    platform_name: platformList.find(item => item.key === platformKey).value,
                    fans_number: item[`kol_${platformKey}_info`]
                      ? item[`kol_${platformKey}_info`].fans_number
                      : '--',
                  });
                }
              });
              item['platforms_fans'] = platformsFansList;
              // 返回处理完的每一个kol的对象
              return item;
            });
            this.results = res.data.data.data;
            this.pagination.total = res.data.data.total;
            // 从kol去录入进去的新窗口
            if (this.$route.query.kol_name) {
              this.handleRowClick1();
            }
          } else {
            this.$message({
              type: 'warning',
              message: res.data.message,
              duration: 2000,
              showClose: true,
            });
          }
          this.loading = false;
        })
        .catch(() => {
          this.$message({
            type: 'warning',
            message: 'KOL列表查询失败',
            duration: 2000,
            showClose: true,
          });
          this.loading = false;
        });
    },

    // 重置
    resetMedium() {
      this.pagination.currentPage = 1;
      this.searchForm = {
        platform: '', // 擅长平台
        platform_type: '', // 媒介类型
        area: '', // 擅长领域
        kol_tag: '', // kol标签
        special_ticket: '', // 是否专票
        kol_name: '', // kol昵称
        is_coop: '', // 是否合作
        min_fans_num: '', // 最小粉丝数
        max_fans_num: '', // 最大粉丝数
      };
      this.business_type = '';
      this.clickQueryMedium();
    },
    // 选择类型
    selectTypeHandle(key, value) {
      this.searchForm[key] = value;
      if (key === 'platform' && value === '') {
        this.searchForm.max_fans_num = undefined;
        this.searchForm.min_fans_num = undefined;
      }
      this.pagination.currentPage = 1;
      this.clickQueryMedium();
    },
    // 翻页
    handleCurrentChange() {
      this.clickQueryMedium(false);
    },
    // 每页条数改变
    handlePageSizeChange(pageSize) {
      this.pagination.pageSize = pageSize;
      this.pagination.currentPage = 1;
      this.clickQueryMedium();
    },
    // 点击新增
    handleAddKolClick() {
      this.$refs.addPersonalKolDialog.show();
    },
    // 点击一条数据，进入详情
    handleRowClick(row) {
      this.detailId = row.kol_info.kol_id;
      this.$nextTick(() => {
        this.$refs.personalDetailDialog.visible = true;
      });
    },
    // 批量选择
    handleSelectionChange(value) {
      this.selection = value;
    },
    // 批量删除
    handleBatchDeleteKolClick() {
      if (this.selection.length === 0) {
        this.$message({
          type: 'warning',
          message: '至少选择一条数据',
          duration: 2000,
          showClose: true,
        });
        return false;
      }
      // 允许删除的数量
      const canDeleteCount = this.selection.reduce((sum, item) => {
        if (item.kol_info.allow_del === 1) {
          sum += 1;
        }
        return sum;
      }, 0);
      // 单选删除
      if (this.selection.length === 1 && this.selection[0].kol_info.allow_del === 1) {
        this.$confirm(`此操作将删除 ${this.selection.length} 个KOL, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          customClass: 'delete-kol-alert',
          center: true,
        })
          .then(() => {
            deleteKol({
              kol_ids: this.selection.map(item => item.kol_info.kol_id),
            })
              .then(res => {
                this.$message({
                  type: res.data.success ? 'success' : 'warning',
                  message: res.data.message,
                  duration: 2000,
                  showClose: true,
                });
                if (res.data.success) {
                  this.clickQueryMedium();
                }
              })
              .catch(() => {
                this.$message({
                  type: 'error',
                  message: 'KOL删除失败，稍后重试',
                  duration: 2000,
                  showClose: true,
                });
              });
          })
          .catch(() => {
            /* do nth */
          });
      } else {
        this.$alert('该KOL包含成本安排数据，不允许删除', '提示', {
          cancelButtonText: '取消',
          customClass: 'delete-kol-alert-red',
          center: true,
        }).catch(() => {
          // do nth
        });
      }
      // 多选删除
      if (this.selection.length > 1) {
        this.$confirm(
          `可删除 <span style="font-weight: 600;color:red;">${canDeleteCount}</span> 条<br>有成本安排数据的kol不允许删除，<br>不允许删除`,
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            customClass: 'delete-kol-alert',
            center: true,
            dangerouslyUseHTMLString: true,
          },
        )
          .then(() => {
            if (this.selection.map(item => item.kol_info.allow_del === 1)) {
              // 过滤不能删除的数据
              const newDeleteArr = this.selection.filter(item => item.kol_info.allow_del === 1);
              deleteKol({
                kol_ids: newDeleteArr.map(item => item.kol_info.kol_id),
              })
                .then(res => {
                  this.$message({
                    type: res.data.success ? 'success' : 'warning',
                    message: res.data.message,
                    duration: 2000,
                    showClose: true,
                  });
                  if (res.data.success) {
                    this.clickQueryMedium();
                  }
                })
                .catch(() => {
                  this.$message({
                    type: 'error',
                    message: 'KOL删除失败，稍后重试',
                    duration: 2000,
                    showClose: true,
                  });
                });
            }
          })
          .catch(() => {
            /* do nth */
          });
      }
    },
    // 处理每一条kol数据的报价用到的方法
    handleOneKolManyPlatformPriceFun(platformName, price) {
      return {
        platform_name: platformName,
        price: price,
      };
    },
    // 导出Kol
    handleExportKolClick() {
      if (this.selection.length === 0) {
        exportKol(this.searchForm);
      } else {
        // 有选择，直接根据kol_id导出
        const kolIds = this.selection.map(item => item.kol_info.kol_id);
        exportKol({
          kol_ids: JSON.stringify(kolIds),
        });
      }
    },
  },
  watch: {
    $route: {
      // 从别处进入触发刷新，详情页返回不触发
      handler(val, oldval) {
        // console.log(val.path);
        if (val.name === '供应商列表' && oldval.name !== '公司详情') {
          this.resetMedium();
        }
      },
    },
  },
};
</script>

<style lang="scss" scoped>
// 旧的都挪进去了
// 一大坨顶在文件头部太烦了
@import './personal.library.scss';
</style>
