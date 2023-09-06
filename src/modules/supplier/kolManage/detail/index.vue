<template>
  <div class="kol-detail-wrapper">
    <div class="kol-wrapper-main">
      <div class="wrapper-left">
        <div class="header-fixed">
          <div class="star-info">
            <p class="star-name">{{ kolInfo.kol_name }}</p>
            <tg-icon
              v-if="kolInfo.verify_status === 1 && canEdit"
              name="ico-edit"
              class="case-edit"
              @click="handleEditClick"
            />
          </div>
          <div class="type-info">
            <h3 class="info-title">业务类型</h3>
            <span
              v-for="(item, index) in businessTypeFun(kolInfo.business_type)"
              :key="index"
              class="type-tag"
              >{{ item }}</span
            >
          </div>
          <div class="type-info">
            <h3 class="info-title">达人标签</h3>
            <span class="type-tag">{{ kolTagFun(kolInfo.kol_tag) }}</span>
            <!-- warning 超过5个显示按钮-->
            <span
              v-if="(kolInfo.areas_info || []).length > 5"
              class="tag-btn"
              @click="handleGoodAction"
              >{{ goodAction ? '收起' : '展开'
              }}<tg-icon :class="{ 'tag-icon': goodAction }" name="ico-arrow-down"
            /></span>
          </div>
        </div>
        <div v-if="(kolInfo.cooperation_brand || []).length > 0" class="type-info">
          <h3 class="info-title">合作品牌</h3>
          <template v-if="brandAction">
            <span v-for="(item, index) of kolInfo.cooperation_brand" :key="index">
              <el-popover
                v-if="item && item.length > 7"
                placement="top-start"
                width="200"
                trigger="hover"
                :content="item"
              >
                <p slot="reference" class="type-tag ellipsis">
                  {{ item }}
                </p>
              </el-popover>
              <p v-else class="type-tag ellipsis">
                {{ item }}
              </p>
            </span>
          </template>
          <template v-else>
            <span
              v-for="(item, index) of (kolInfo.cooperation_brand || []).slice(0, 5)"
              :key="index"
            >
              <el-popover
                v-if="item && item.length > 7"
                placement="top-start"
                width="200"
                trigger="hover"
                :content="item"
              >
                <p slot="reference" class="type-tag ellipsis">
                  {{ item }}
                </p>
              </el-popover>
              <p v-else class="type-tag ellipsis">
                {{ item }}
              </p>
            </span>
          </template>
          <!-- warning 超过5个显示按钮-->
          <span
            v-if="(kolInfo.cooperation_brand || []).length > 5"
            class="tag-btn"
            @click="handleBrandAction"
            >{{ brandAction ? '收起' : '展开'
            }}<tg-icon :class="{ 'tag-icon': brandAction }" name="ico-arrow-down"
          /></span>
        </div>
        <div class="type-info">
          <h3 class="info-title">擅长类目</h3>
          <template v-if="goodAction">
            <span v-for="(item, index) of kolInfo.areas_info" :key="index" class="type-tag">{{
              item.name
            }}</span>
          </template>
          <template v-else>
            <span
              v-for="(item, index) of (kolInfo.areas_info || []).slice(0, 5)"
              :key="index"
              class="type-tag"
              >{{ item.name }}</span
            >
          </template>
          <!-- warning 超过5个显示按钮-->
          <span
            v-if="(kolInfo.areas_info || []).length > 5"
            class="tag-btn"
            @click="handleGoodAction"
            >{{ goodAction ? '收起' : '展开'
            }}<tg-icon :class="{ 'tag-icon': goodAction }" name="ico-arrow-down"
          /></span>
        </div>
        <div class="add-by-info type-info">
          <h3 class="info-title">创建及审核信息</h3>
          <div class="line-add-by">
            <span class="label-name">审核状态：</span>
            <p v-if="kolInfo.verify_status === 0" class="label-value">审核中</p>
            <p v-else-if="kolInfo.verify_status === 1" class="label-value">已通过</p>
            <p v-else class="label-value">未通过</p>
          </div>
          <div class="line-add-by">
            <span class="label-name">创建人：</span>
            <p class="label-value">{{ kolInfo.add_by ? kolInfo.add_by : '--' }}</p>
          </div>
          <div class="line-add-by">
            <span class="label-name">创建时间：</span>
            <p class="label-value">
              {{ kolInfo.gmt_create ? kolInfo.gmt_create.replace(/-/g, '.') : '--' }}
            </p>
          </div>
          <div class="line-add-by">
            <span class="label-name">审核人：</span>
            <p class="label-value">{{ kolInfo.verify_by ? kolInfo.verify_by : '--' }}</p>
          </div>
          <div class="line-add-by">
            <span class="label-name">审核时间：</span>
            <p class="label-value">
              {{ kolInfo.verify_time ? kolInfo.verify_time.replace(/-/g, '.') : '--' }}
            </p>
          </div>
        </div>
      </div>
      <div class="wrapper-right">
        <div class="list-wrapper">
          <div>
            <div class="item-wrapper">
              <h3 class="info-title">
                <head-lines style="margin: 10px 0" title="公司信息" />
              </h3>
              <div class="list">
                <div class="item">
                  <p class="label">所属公司：</p>
                  <p class="message">{{ kolInfo.kol_company_name || '--' }}</p>
                </div>
                <div class="item">
                  <p class="label">是否可开专票：</p>
                  <p v-if="kolInfo.special_ticket === 1" class="message">是</p>
                  <p v-else-if="kolInfo.special_ticket === 0" class="message">否</p>
                  <p v-else class="message">--</p>
                </div>
              </div>
            </div>
            <div class="item-wrapper">
              <head-lines style="margin: 10px 0" title="联系方式" />
              <div class="list">
                <div class="item">
                  <p class="label">联系人：</p>
                  <p class="message">
                    {{ kolInfo.contacts || '--' }}
                  </p>
                </div>
                <div class="item">
                  <p class="label">联系电话：</p>
                  <p class="message">{{ kolInfo.contact_phone ? kolInfo.contact_phone : '--' }}</p>
                </div>
                <div class="item">
                  <p class="label">微信号：</p>
                  <p class="message">
                    {{ kolInfo.contact_wechat ? kolInfo.contact_wechat : '--' }}
                  </p>
                </div>
              </div>
              <div class="list">
                <div class="item">
                  <p class="label">QQ号：</p>
                  <p class="message">{{ kolInfo.contact_qq ? kolInfo.contact_qq : '--' }}</p>
                </div>
                <div class="item">
                  <p class="label">寄样地址：</p>
                  <p class="message">
                    {{ kolInfo.province }}{{ kolInfo.city }}{{ kolInfo.county
                    }}{{ kolInfo.address ? kolInfo.address : '--' }}
                  </p>
                </div>
              </div>
            </div>
            <div class="case-wrapper">
              <head-lines style="margin: 10px 0" title="达人案例" />
              <div class="case-box">
                <p
                  v-if="kolInfo && (kolInfo.case || []).length === 0"
                  style="color: var(--text-third-color)"
                >
                  暂无案例
                </p>
                <div
                  class="case-item"
                  v-for="(item, index) in caseFunarr(kolInfo.case)"
                  :key="index"
                >
                  <FileItem :key="index" :filepath="item" :readonly="true" :showPreview="false" />
                </div>
              </div>
            </div>
            <div class="platforms">
              <head-lines style="margin: 10px 0" title="擅长平台" />
              <div class="platforms-content">
                <div class="platform-wrapper" v-if="dyInfo.douyin_name && !isDouyinInEdit">
                  <div class="platform-header">
                    <div class="platform-item-title">抖音平台</div>
                    <div class="right" v-if="kolInfo.verify_status === 1 && canEdit">
                      <tg-button size="mini" @click="clickEditButtonHandle('douyin')"
                        >编辑</tg-button
                      >
                    </div>
                  </div>
                  <div class="list">
                    <div class="item">
                      <p class="label">昵称：</p>
                      <p class="message">{{ dyInfo.douyin_name || '--' }}</p>
                    </div>
                    <div class="item">
                      <p class="label">抖音号：</p>
                      <p v-if="dyInfo.douyin_id || dyInfo.douyin_id === 0" class="message">
                        {{ dyInfo.douyin_id }}
                      </p>
                      <p v-else>--</p>
                    </div>
                    <div class="item">
                      <p class="label">百应ID：</p>
                      <p v-if="dyInfo.baiying_id || dyInfo.baiying_id === 0" class="message">
                        {{ dyInfo.baiying_id }}
                      </p>
                      <p v-else>--</p>
                    </div>
                    <div class="item">
                      <p class="label">UID：</p>
                      <p v-if="dyInfo.qianchuan_uid || dyInfo.qianchuan_uid === 0" class="message">
                        {{ dyInfo.qianchuan_uid }}
                      </p>
                      <p v-else>--</p>
                    </div>
                    <div class="item">
                      <p class="label">粉丝数：</p>
                      <p v-if="dyInfo.fans_number || dyInfo.fans_number === 0" class="message">
                        {{ dyInfo.fans_number }} 万
                      </p>
                      <p v-else>--</p>
                    </div>
                    <div class="item">
                      <p class="label">获赞数：</p>
                      <p v-if="dyInfo.praise_number || dyInfo.praise_number === 0" class="message">
                        {{ dyInfo.praise_number }} 万
                      </p>
                      <p v-else>--</p>
                    </div>
                    <div class="item" v-if="isDouyinLiveFull">
                      <p class="label">坑位费成本价：</p>
                      <p
                        v-if="dyInfo.live_pit_price || dyInfo.live_pit_price === 0"
                        class="message"
                      >
                        {{ dyInfo.live_pit_price }}
                      </p>
                      <p v-else>--</p>
                    </div>
                    <div class="item" v-if="isDouyinLiveFull">
                      <p class="label">坑位费刊例价：</p>
                      <p
                        v-if="dyInfo.live_pit_publish_price || dyInfo.live_pit_publish_price === 0"
                        class="message"
                      >
                        {{ dyInfo.live_pit_publish_price }}
                      </p>
                      <p v-else>--</p>
                    </div>
                    <div class="item" v-if="isDouyinLiveFull">
                      <p class="label">混播佣金比例：</p>
                      <p
                        v-if="
                          dyInfo.mix_min_commission_percent ||
                          dyInfo.mix_min_commission_percent === 0
                        "
                        class="message"
                      >
                        {{ dyInfo.mix_min_commission_percent }}
                      </p>
                      <p v-else>--</p>
                    </div>
                    <div class="item" v-if="isDouyinLiveFull">
                      <p class="label">纯佣金比例：</p>
                      <p
                        v-if="
                          dyInfo.pure_min_commission_percent ||
                          dyInfo.pure_min_commission_percent === 0
                        "
                        class="message"
                      >
                        {{ dyInfo.pure_min_commission_percent }}
                      </p>
                      <p v-else>--</p>
                    </div>
                    <div class="item" v-if="isDouyinLiveFull">
                      <p class="label">专场成本价：</p>
                      <p class="message">
                        {{ dyInfo.live_special_price || '--' }}
                      </p>
                    </div>
                    <div class="item" v-if="isDouyinLiveFull">
                      <p class="label">专场刊例价：</p>
                      <p class="message">{{ dyInfo.live_special_publish_price || '--' }}</p>
                    </div>

                    <div class="item" v-if="isDouyinLiveFull">
                      <p class="label">专场佣金：</p>
                      <p
                        v-if="
                          dyInfo.special_commission_min_percent ||
                          dyInfo.special_commission_min_percent === 0
                        "
                        class="message"
                      >
                        {{ dyInfo.special_commission_min_percent }}
                      </p>
                      <p v-else>--</p>
                    </div>

                    <div class="item" v-if="isDouyinLiveFull">
                      <p class="label">场均销售额：</p>
                      <p
                        v-if="dyInfo.avg_sales_amount || dyInfo.avg_sales_amount === 0"
                        class="message"
                      >
                        {{ dyInfo.avg_sales_amount }} 万
                      </p>
                      <p v-else>--</p>
                    </div>
                    <div class="item" v-if="isDouyinGrassFull">
                      <p class="label">星图20秒成本价：</p>
                      <p
                        v-if="
                          dyInfo.video_1_20_star_map_price || dyInfo.video_1_20_star_map_price === 0
                        "
                        class="message"
                      >
                        {{ dyInfo.video_1_20_star_map_price }}
                      </p>
                      <p v-else>--</p>
                    </div>

                    <div class="item" v-if="isDouyinGrassFull">
                      <p class="label">星图20-60秒成本价：</p>
                      <p
                        v-if="
                          dyInfo.video_21_60_star_map_price ||
                          dyInfo.video_21_60_star_map_price === 0
                        "
                        class="message"
                      >
                        {{ dyInfo.video_21_60_star_map_price }}
                      </p>
                      <p v-else>--</p>
                    </div>

                    <div class="item" v-if="isDouyinGrassFull">
                      <p class="label">星图60秒以上成本价：</p>
                      <p
                        v-if="
                          dyInfo.video_gt_60_star_map_price ||
                          dyInfo.video_gt_60_star_map_price === 0
                        "
                        class="message"
                      >
                        {{ dyInfo.video_gt_60_star_map_price }}
                      </p>
                      <p v-else>--</p>
                    </div>

                    <div class="item" v-if="isDouyinGrassFull">
                      <p class="label">购物车费用（不含税）：</p>
                      <p
                        v-if="
                          dyInfo.shopcart_without_fee_price ||
                          dyInfo.shopcart_without_fee_price === 0
                        "
                        class="message"
                      >
                        {{ dyInfo.shopcart_without_fee_price }}
                      </p>
                      <p v-else>--</p>
                    </div>

                    <div class="item" v-if="isDouyinGrassFull">
                      <p class="label">购物车佣金比例：</p>
                      <p
                        v-if="
                          dyInfo.shopcart_min_commission_percent ||
                          dyInfo.shopcart_min_commission_percent === 0
                        "
                        class="message"
                      >
                        {{ dyInfo.shopcart_min_commission_percent }}
                      </p>
                      <p v-else>--</p>
                    </div>
                  </div>
                </div>
                <edit-douyin
                  v-else-if="dyInfo.douyin_name && isDouyinInEdit"
                  :data="editDouyinData"
                  :close="closeEditForm"
                  :submit="submitEditForm"
                  :kolTag="kolTag"
                />
                <div class="platform-wrapper" v-if="tbInfo.star_name && !isTaobaoInEdit">
                  <div class="platform-header">
                    <div class="platform-item-title">淘宝平台</div>
                    <div class="right" v-if="kolInfo.verify_status === 1 && canEdit">
                      <tg-button size="mini" @click="clickEditButtonHandle('tb')">编辑</tg-button>
                    </div>
                  </div>
                  <div class="list">
                    <div class="item">
                      <p class="label">淘宝账号：</p>
                      <p class="message">
                        {{ tbInfo.star_name || '--' }}
                      </p>
                    </div>
                    <div class="item">
                      <p class="label">淘宝ID：</p>
                      <p class="message">
                        {{ tbInfo.star_id || '--' }}
                      </p>
                    </div>
                    <div class="item">
                      <p class="label">粉丝数：</p>
                      <p v-if="tbInfo.fans_number || tbInfo.fans_number === 0" class="message">
                        {{ tbInfo.fans_number }} 万
                      </p>
                      <p v-else>--</p>
                    </div>
                    <div class="item">
                      <p class="label">混播成本价：</p>
                      <p v-if="tbInfo.star_mix_cost || tbInfo.star_mix_cost === 0" class="message">
                        {{ tbInfo.star_mix_cost }}
                      </p>
                      <p v-else>--</p>
                    </div>
                    <div class="item">
                      <p class="label">混播刊例价：</p>
                      <p class="message">
                        {{ tbInfo.star_mix_price || '--' }}
                      </p>
                    </div>
                    <div class="item">
                      <p class="label">混播佣金比例：</p>
                      <p
                        v-if="
                          tbInfo.mix_min_commission_percent ||
                          tbInfo.mix_min_commission_percent === 0
                        "
                        class="message"
                      >
                        {{ tbInfo.mix_min_commission_percent }}
                      </p>
                      <p v-else>--</p>
                    </div>
                    <div class="item">
                      <p class="label">纯佣金比例：</p>
                      <p
                        v-if="
                          tbInfo.pure_min_commission_percent ||
                          tbInfo.pure_min_commission_percent === 0
                        "
                        class="message"
                      >
                        {{ tbInfo.pure_min_commission_percent }}
                      </p>
                      <p v-else>--</p>
                    </div>
                    <div class="item">
                      <p class="label">专场成本价：</p>
                      <p
                        v-if="tbInfo.star_special_cost || tbInfo.star_special_cost === 0"
                        class="message"
                      >
                        {{ tbInfo.star_special_cost }}
                      </p>
                      <p v-else>--</p>
                    </div>
                    <div class="item">
                      <p class="label">专场刊例价：</p>
                      <p class="message">
                        {{ tbInfo.star_special_price || '--' }}
                      </p>
                    </div>
                    <div class="item">
                      <p class="label">专场佣金：</p>
                      <p
                        v-if="
                          tbInfo.special_commission_min_percent ||
                          tbInfo.special_commission_min_percent === 0
                        "
                        class="message"
                      >
                        {{ tbInfo.special_commission_min_percent }}
                      </p>
                      <p v-else>--</p>
                    </div>
                  </div>
                </div>
                <edit-taobao
                  v-else-if="tbInfo.star_name && isTaobaoInEdit"
                  :data="editTaobaoData"
                  :close="closeEditForm"
                  :submit="submitEditForm"
                />
                <div class="platform-wrapper" v-if="xhsInfo.xhs_name && !isXiaohongshuInEdit">
                  <div class="platform-header">
                    <div class="platform-item-title">小红书平台</div>
                    <div class="right" v-if="kolInfo.verify_status === 1 && canEdit">
                      <tg-button size="mini" @click="clickEditButtonHandle('xhs')">编辑</tg-button>
                    </div>
                  </div>
                  <div class="list">
                    <div class="item">
                      <p class="label">昵称：</p>
                      <p class="message">
                        {{ xhsInfo.xhs_name || '--' }}
                      </p>
                    </div>
                    <div class="item">
                      <p class="label">粉丝数：</p>
                      <p v-if="xhsInfo.fans_number || xhsInfo.fans_number === 0" class="message">
                        {{ xhsInfo.fans_number }} 万
                      </p>
                      <p v-else>--</p>
                    </div>
                    <div class="item">
                      <p class="label">获赞与收藏：</p>
                      <p
                        v-if="xhsInfo.praise_collection || xhsInfo.praise_collection === 0"
                        class="message"
                      >
                        {{ xhsInfo.praise_collection }} 万
                      </p>
                      <p v-else>--</p>
                    </div>
                    <div class="item">
                      <p class="label">主页链接：</p>
                      <p class="message">
                        {{ xhsInfo.homepage_link || '--' }}
                      </p>
                    </div>
                    <div class="item">
                      <p class="label">图文不报备成本价：</p>
                      <p
                        v-if="
                          xhsInfo.photo_not_filing_price || xhsInfo.photo_not_filing_price === 0
                        "
                        class="message"
                      >
                        {{ xhsInfo.photo_not_filing_price }}
                      </p>
                      <p v-else>--</p>
                    </div>
                    <div class="item">
                      <p class="label">图文报备成本价：</p>
                      <p
                        v-if="xhsInfo.photo_filing_price || xhsInfo.photo_filing_price === 0"
                        class="message"
                      >
                        {{ xhsInfo.photo_filing_price }}
                      </p>
                      <p v-else>--</p>
                    </div>
                    <div class="item">
                      <p class="label">视频不报备成本价：</p>
                      <p
                        v-if="
                          xhsInfo.video_not_filing_price || xhsInfo.video_not_filing_price === 0
                        "
                        class="message"
                      >
                        {{ xhsInfo.video_not_filing_price }}
                      </p>
                      <p v-else>--</p>
                    </div>
                    <div class="item">
                      <p class="label">视频报备成本价：</p>
                      <p
                        v-if="xhsInfo.video_filing_price || xhsInfo.video_filing_price === 0"
                        class="message"
                      >
                        {{ xhsInfo.video_filing_price }}
                      </p>
                      <p v-else>--</p>
                    </div>
                  </div>
                </div>
                <edit-xiaohongshu
                  v-else-if="xhsInfo.xhs_name && isXiaohongshuInEdit"
                  :data="editXiaohongshuData"
                  :close="closeEditForm"
                  :submit="submitEditForm"
                />
                <div class="platform-wrapper" v-if="ksInfo.kuaishou_name && !isKuaishouInEdit">
                  <div class="platform-header">
                    <div class="platform-item-title">快手平台</div>
                    <div class="right" v-if="kolInfo.verify_status === 1 && canEdit">
                      <tg-button size="mini" @click="clickEditButtonHandle('kuaishou')"
                        >编辑</tg-button
                      >
                    </div>
                  </div>
                  <div class="list">
                    <div class="item">
                      <p class="label">昵称：</p>
                      <p class="message">
                        {{ ksInfo.kuaishou_name || '--' }}
                      </p>
                    </div>
                    <div class="item">
                      <p class="label">快手号：</p>
                      <p v-if="ksInfo.kuaishou_id || ksInfo.kuaishou_id === 0" class="message">
                        {{ ksInfo.kuaishou_id }}
                      </p>
                      <p v-else>--</p>
                    </div>
                    <div class="item">
                      <p class="label">粉丝数：</p>
                      <p v-if="ksInfo.fans_number || ksInfo.fans_number === 0" class="message">
                        {{ ksInfo.fans_number }} 万
                      </p>
                      <p v-else>--</p>
                    </div>
                    <div class="item">
                      <p class="label">坑位费成本价：</p>
                      <p
                        v-if="ksInfo.live_pit_price || ksInfo.live_pit_price === 0"
                        class="message"
                      >
                        {{ ksInfo.live_pit_price }}
                      </p>
                      <p v-else>--</p>
                    </div>
                    <div class="item">
                      <p class="label">坑位费刊例价：</p>
                      <p
                        v-if="ksInfo.live_pit_publish_price || ksInfo.live_pit_publish_price === 0"
                        class="message"
                      >
                        {{ ksInfo.live_pit_publish_price }}
                      </p>
                      <p v-else>--</p>
                    </div>
                    <div class="item">
                      <p class="label">混播佣金比例：</p>
                      <p
                        v-if="
                          ksInfo.mix_min_commission_percent ||
                          ksInfo.mix_min_commission_percent === 0
                        "
                        class="message"
                      >
                        {{ ksInfo.mix_min_commission_percent }}
                      </p>
                      <p v-else>--</p>
                    </div>
                    <div class="item">
                      <p class="label">纯佣金比例：</p>
                      <p
                        v-if="
                          ksInfo.pure_min_commission_percent ||
                          ksInfo.pure_min_commission_percent === 0
                        "
                        class="message"
                      >
                        {{ ksInfo.pure_min_commission_percent }}
                      </p>
                      <p v-else>--</p>
                    </div>
                    <div class="item">
                      <p class="label">专场成本价：</p>
                      <p
                        v-if="ksInfo.live_special_price || ksInfo.live_special_price === 0"
                        class="message"
                      >
                        {{ ksInfo.live_special_price }}
                      </p>
                      <p v-else>--</p>
                    </div>
                    <div class="item">
                      <p class="label">专场刊例价：</p>
                      <p
                        v-if="
                          ksInfo.live_special_publish_price ||
                          ksInfo.live_special_publish_price === 0
                        "
                        class="message"
                      >
                        {{ ksInfo.live_special_publish_price }}
                      </p>
                      <p v-else>--</p>
                    </div>
                    <div class="item">
                      <p class="label">专场佣金比例：</p>
                      <p
                        v-if="
                          ksInfo.special_commission_min_percent ||
                          ksInfo.special_commission_min_percent === 0
                        "
                        class="message"
                      >
                        {{ ksInfo.special_commission_min_percent }}
                      </p>
                      <p v-else>--</p>
                    </div>
                    <div class="item">
                      <p class="label">场均销售额：</p>
                      <p
                        v-if="ksInfo.avg_sales_amount || ksInfo.avg_sales_amount === 0"
                        class="message"
                      >
                        {{ ksInfo.avg_sales_amount }} 万
                      </p>
                      <p v-else>--</p>
                    </div>
                  </div>
                </div>
                <edit-kuaishou
                  v-else-if="ksInfo.kuaishou_name && isKuaishouInEdit"
                  :data="editKuaishouData"
                  :close="closeEditForm"
                  :submit="submitEditForm"
                />
              </div>
            </div>
          </div>
        </div>
        <div v-if="isApprovalBtnShow" class="approval-wrapper">
          <div class="fix-box">
            <el-button class="reject-btn" @click="showRejectDialog"> 审核不通过 </el-button>
            <el-button type="primary" class="approve-btn" @click="approveKol(kolInfo.kol_id)">
              审核通过
            </el-button>
          </div>
        </div>
      </div>
    </div>
    <dialogCheck ref="dialogRejectRef" :save="rejectKol" />
  </div>
</template>
<script src="./index.ts"></script>
<style lang="less" scoped>
@import './index.less';
</style>
