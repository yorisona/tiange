import { defineComponent, onActivated, ref } from '@vue/composition-api';
import utils from '@/utils';
import { RouterNameSupplier } from '@/const/router';
import { useAnchorData } from './use';
import InputRange from '../common/InputRange/index.vue';
import Folder from '@/modules/supplier/components/folder/index.vue';
import { usePermission } from '@/use/permission';
import { useRouter } from '@/use/vue-router';
import liverModel from '@/modules/supplier/components/model/index.vue';
import dialogImageView from '../common/dialogImageView/index.vue';
import { AsyncConfirm } from '@/use/asyncConfirm';
import { DeleteKolForSupplier } from '@/services/supplier';
import record from '@/modules/supplier/playerManager/common/record/index.vue';
import { is_creator_maintainer } from '../common/utils/utils';

export default defineComponent({
  components: {
    InputRange,
    Folder,
    liverModel,
    dialogImageView,
    record,
  },
  setup(prop, ctx) {
    const router = useRouter();
    const data = useAnchorData();
    const hasDisplay = window.localStorage.getItem('isDisplay') as any;
    const displayType = ref<boolean>(!hasDisplay ? true : !!(hasDisplay * 1));
    const dialogImageViewRef = ref<{ show: (...args: any) => void }>();
    let pickerMinDate: any = null;
    const day30 = 30 * 24 * 3600 * 1000;
    const pickerOptions = {
      onPick: (val: any) => {
        if (val.minDate && pickerMinDate) {
          pickerMinDate = null;
        } else if (val.minDate) {
          pickerMinDate = val.minDate.getTime();
        }
      },
      disabledDate: (time: any) => {
        if (pickerMinDate) {
          return (
            time.getTime() > pickerMinDate + day30 ||
            time.getTime() < pickerMinDate - day30 ||
            time.getTime() > Date.now()
          );
        }
        return time.getTime() > Date.now();
      },
    };

    onActivated(() => {
      data.query(data.queryForm);
    });
    const onKeyPress = (event: any) => {
      if (event.which !== 13) return;
      data.queryStart();
    };
    const permission = usePermission();
    const show = ref<boolean>(false);
    const handleFolderClick = () => {
      show.value = !show.value;
    };

    if (router.currentRoute.query.source === 'console_anchor_apply') {
      // @ts-ignore
      data.queryForm.verify_status = 1;
    }
    data.query(data.queryForm);
    const onDeleteModel = async (row: any) => {
      const res = await AsyncConfirm(ctx, '是否确定删除此主播？');
      if (res) {
        const res = await DeleteKolForSupplier(row.id);
        if (res.data.success) {
          ctx.root.$message.success(res.data.message);
          data.query(data.queryForm);
        } else {
          ctx.root.$message.error(res.data.message);
        }
      }
    };

    const recordRef = ref<{ show: () => void } | undefined>(undefined);

    const isCreatorMaintainer = (row: any) => {
      return is_creator_maintainer(ref(row)).value;
    };

    return {
      onDeleteModel,
      data,
      permission,
      pickerOptions,
      onKeyPress,
      show,
      displayType,
      handleFolderClick,
      dialogImageViewRef,
      recordRef,
      isCreatorMaintainer,
    };
  },
  render() {
    const { data } = this;
    return (
      <div class="tg-page-container flex-auto" style="min-width: 1100px">
        <tg-card class="mgb-10" padding={[16, 0, 4, 16]}>
          <el-form size="mini" show-message={false} label-width="60px">
            <div class="filter-form-div no-wrap">
              <div class="filter-form-item ">
                <el-form-item label="主播名称：" nativeOnKeypress={this.onKeyPress}>
                  <el-input placeholder="请输入主播名称" v-model={data.queryForm.flower_name} />
                </el-form-item>
              </div>
              <div class="filter-form-item ">
                <el-form-item label="主播真名：" nativeOnKeypress={this.onKeyPress}>
                  <el-input placeholder="请输入真名" v-model={data.queryForm.real_name} />
                </el-form-item>
              </div>
              <div class="filter-form-item ">
                <el-form-item label="合作状态：">
                  <el-select
                    popper-class="el-select-popper-mini"
                    style={{ width: '100%' }}
                    v-model={data.queryForm.cooperation_status}
                  >
                    <el-option label="全部" value="" />
                    <el-option label="合作中" value="1" />
                    <el-option label="未合作" value="2" />
                  </el-select>
                </el-form-item>
              </div>
              <div class="filter-form-item ">
                <el-form-item label="审核状态：">
                  <el-select
                    popper-class="el-select-popper-mini"
                    style={{ width: '100%' }}
                    v-model={data.queryForm.verify_status}
                  >
                    <el-option label="全部" value="" />
                    <el-option label="基础信息已完善" value={0} />
                    <el-option label="审核中" value={1} />
                    <el-option label="已通过" value={2} />
                    <el-option label="未通过" value={-1} />
                  </el-select>
                </el-form-item>
              </div>
              <div class="filter-form-item more">
                <el-form-item label-width="0">
                  <div style="min-width: 208px; max-width: 208px;">
                    <tg-button class="mgr-8" onclick={this.handleFolderClick}>
                      高级筛选
                    </tg-button>
                    <tg-button class="mgr-8" type="primary" onClick={this.data.queryStart}>
                      查询
                    </tg-button>
                    <tg-button class="mgr-8" onClick={this.data.reset}>
                      重置
                    </tg-button>
                  </div>
                </el-form-item>
              </div>
            </div>
            {this.show && (
              <span>
                <div class="filter-form-div no-wrap">
                  <div class="filter-form-item">
                    <el-form-item label="主播类型：">
                      <el-select
                        popper-class="el-select-popper-mini"
                        style={{ width: '100%' }}
                        v-model={data.queryForm.anchor_type}
                      >
                        <el-option label="全部" value="" />
                        <el-option label="网络营销师" value="1" />
                        <el-option label="练习生" value="2" />
                      </el-select>
                    </el-form-item>
                  </div>
                  <div class="filter-form-item ">
                    <el-form-item label="主播性别：">
                      <el-select
                        popper-class="el-select-popper-mini"
                        style={{ width: '100%' }}
                        v-model={data.queryForm.gender}
                      >
                        <el-option label="全部" value="" />
                        <el-option label="男" value="1" />
                        <el-option label="女" value="2" />
                      </el-select>
                    </el-form-item>
                  </div>
                  <div class="filter-form-item ">
                    <el-form-item label="直播年限：" prop="live_years">
                      <div class="range-box">
                        <input-range
                          style={{ width: '100%' }}
                          v-model={data.queryForm.live_years}
                        />
                      </div>
                    </el-form-item>
                  </div>
                  <div class="filter-form-item ">
                    <el-form-item label="创建人：" nativeOnKeypress={this.onKeyPress}>
                      <el-input placeholder="请输入创建人" v-model={data.queryForm.add_by} />
                    </el-form-item>
                  </div>
                  <div class="filter-form-item">
                    <el-form-item label="个人标签：" nativeOnKeypress={this.onKeyPress}>
                      <el-input placeholder="请输入个人标签" v-model={data.queryForm.anchor_tag} />
                    </el-form-item>
                  </div>
                </div>
                <div class="filter-form-div no-wrap">
                  <div class="filter-form-item more">
                    <el-form-item label="创建时间：">
                      <el-date-picker
                        picker-options={this.pickerOptions}
                        value-format="yyyy-MM-dd"
                        format="yyyy.MM.dd"
                        type="daterange"
                        style={{ width: '202px' }}
                        v-model={data.gmt_create}
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        range-separator="~"
                      />
                    </el-form-item>
                  </div>
                </div>
              </span>
            )}
          </el-form>
          {this.show && (
            <tg-label-group
              class="tg-label-group-mini"
              style="margin-top: 5px"
              v-model={this.data.queryForm.good_at_category}
              label="擅长类目"
              options={this.data.catesList}
              onChange={this.data.queryStart}
            />
          )}
        </tg-card>
        <div class="mtg-card " style="padding: 0">
          {this.permission.supplier_anchor_detail && (
            <tg-button-line
              style={
                this.displayType
                  ? 'justify-content: space-between; padding: 12px 16px 0 16px'
                  : 'justify-content: space-between; padding: 12px 16px 12px 16px'
              }
            >
              <div style="display: flex; align-items: center;">
                <tg-button
                  icon="ico-btn-add"
                  type="primary"
                  onClick={() => {
                    this.$router.push({ name: RouterNameSupplier.player_add });
                  }}
                >
                  新增主播
                </tg-button>
                <tg-button
                  class="mgl-12"
                  type="link"
                  onClick={() => {
                    this.recordRef?.show();
                  }}
                >
                  查看记录
                </tg-button>
              </div>
              <div class="check-list-picture">
                <tg-button
                  class={this.displayType ? 'isActive' : ''}
                  onClick={() => {
                    this.displayType = true;
                    window.localStorage.setItem('isDisplay', '1');
                  }}
                >
                  <tg-icon name="ico-list" />
                  <span>列表样式</span>
                </tg-button>
                <tg-button
                  class={!this.displayType ? 'isActive mgl-8' : 'mgl-8'}
                  onClick={() => {
                    this.displayType = false;
                    window.localStorage.setItem('isDisplay', '0');
                  }}
                >
                  <tg-icon name="ico-icon_suolvetu" />
                  <span>缩略图</span>
                </tg-button>
              </div>
            </tg-button-line>
          )}
          {this.displayType ? (
            <div
              class="table-box"
              style={
                this.permission.supplier_anchor_detail
                  ? 'padding:12px 16px 0 16px'
                  : 'padding:16px 16px 0 16px'
              }
              ref="tableRef"
            >
              <tg-table
                stripe
                height={'100%'}
                onrow-click={(row: any) => {
                  this.$router.push({
                    name: RouterNameSupplier.player_detail,
                    params: { id: row.id },
                  });
                }}
                data={this.data.list}
              >
                <el-table-column
                  label="主播名称"
                  minWidth={160}
                  scopedSlots={{
                    default: ({ row }: any) => {
                      return utils.ellipsisText(row.flower_name, 20);
                    },
                  }}
                />
                <el-table-column label="主播ID" minWidth={100} prop="id" />
                <el-table-column label="真名" prop="real_name" minWidth={120} align="center" />
                <el-table-column label="性别" prop="gender" align="center" minWidth={60} />
                <el-table-column
                  label="直播年限"
                  minWidth={80}
                  align="center"
                  scopedSlots={{
                    default: ({ row }: any) => {
                      return <div>{row.live_year}年</div>;
                    },
                  }}
                />
                <el-table-column label="" minWidth={10} />
                <el-table-column
                  label="主播类型"
                  minWidth={120}
                  prop="anchor_type"
                  align="center"
                />
                <el-table-column
                  label="个人标签"
                  prop="name"
                  minWidth={202}
                  scopedSlots={{
                    default: ({ row }: any) => {
                      if (row.anchor_tag.length === 0) return <span>--</span>;
                      return (
                        <el-popover
                          placement="bottom"
                          trigger="hover"
                          scopedSlots={{
                            reference: () => {
                              return <p class="good-area-line">{row.anchor_tag.join('、')}</p>;
                            },
                          }}
                        >
                          <div class="popover-container">
                            {row.anchor_tag.map((item: string, key: number) => (
                              <span key={key}>{item}</span>
                            ))}
                          </div>
                        </el-popover>
                      );
                    },
                  }}
                />
                <el-table-column
                  label="擅长类目"
                  prop="name"
                  minWidth={202}
                  scopedSlots={{
                    default: ({ row }: any) => {
                      if (row.good_at_categories.length === 0) return <span>--</span>;
                      const strLength = row.good_at_categories.join('、').length;
                      if (strLength <= 12) {
                        return <p class="good-area-line">{row.good_at_categories.join('、')}</p>;
                      } else {
                        return (
                          <el-popover
                            placement="bottom"
                            trigger="hover"
                            scopedSlots={{
                              reference: () => {
                                return (
                                  <p class="good-area-line">{row.good_at_categories.join('、')}</p>
                                );
                              },
                            }}
                          >
                            <div class="popover-container">
                              {row.good_at_categories.map((item: string, key: number) => (
                                <span key={key}>{item}</span>
                              ))}
                            </div>
                          </el-popover>
                        );
                      }
                    },
                  }}
                />
                <el-table-column
                  label="创建时间"
                  minWidth={100}
                  align="center"
                  scopedSlots={{
                    default: ({ row }: any) => {
                      return row.gmt_create ? row.gmt_create : '--';
                    },
                  }}
                />
                <el-table-column
                  label="创建人"
                  minWidth={120}
                  align="center"
                  show-overflow-tooltip={true}
                  scopedSlots={{
                    default: ({ row }: any) => {
                      return row.add_by ? row.add_by : '--';
                    },
                  }}
                />
                <el-table-column
                  label="审核状态"
                  minWidth={135}
                  scopedSlots={{
                    default: ({ row }: any) => {
                      return row.verify_status === 0 ? (
                        <div class="co-status">
                          <p class="point fail"></p>
                          <p>基础信息已完善</p>
                        </div>
                      ) : row.verify_status === 1 ? (
                        <div class="co-status">
                          <p class="point process"></p>
                          <p>审核中</p>
                        </div>
                      ) : row.verify_status === 2 ? (
                        <div class="co-status">
                          <p class="point success"></p>
                          <p class="success">已通过</p>
                        </div>
                      ) : row.verify_status === -1 ? (
                        <div class="co-status">
                          <p class="point block"></p>
                          <p>未通过</p>
                        </div>
                      ) : (
                        ''
                      );
                    },
                  }}
                />
                <el-table-column
                  label="合作状态"
                  minWidth={80}
                  scopedSlots={{
                    default: ({ row }: any) => {
                      return row.cooperation_status === 1 ? (
                        <div class="co-status">
                          <p class="point success"></p>
                          <p class="success">合作中</p>
                        </div>
                      ) : (
                        <div class="co-status">
                          <p class="point fail"></p>
                          <p class="fail">未合作</p>
                        </div>
                      );
                    },
                  }}
                />
                <el-table-column
                  fixed="right"
                  label="操作"
                  prop="name"
                  min-width={120}
                  scopedSlots={{
                    default: ({ row }: any) => {
                      return (
                        <div class="operation">
                          <a>查看</a>
                          {/* { this.permission.supplier_anchor_detail && ((this.isCreatorMaintainer(row) && row.verify_status !== 1) || (!this.isCreatorMaintainer(row) && row.verify_status === 2)) } */}
                          {this.permission.supplier_anchor_detail &&
                            this.isCreatorMaintainer(row) &&
                            row.verify_status !== 1 &&
                            row.verify_status !== 2 && (
                              <a
                                onclick={(evt: Event) => {
                                  evt.stopPropagation();
                                  this.$router.push({
                                    name: RouterNameSupplier.player_modify,
                                    params: {
                                      id: row.id,
                                      verify_status: row.verify_status,
                                    },
                                  });
                                }}
                              >
                                编辑
                              </a>
                            )}
                          {this.permission.supplier_anchor_check && row.verify_status === 1 && (
                            <a
                              onclick={(evt: Event) => {
                                evt.stopPropagation();
                                this.$router.push({
                                  name: RouterNameSupplier.player_check,
                                  params: {
                                    id: row.id,
                                  },
                                });
                              }}
                            >
                              审核
                            </a>
                          )}
                          {this.permission.supplier_anchor_delete &&
                            (row.verify_status === 0 || row.verify_status === -1) && (
                              <a
                                onclick={(evt: Event) => {
                                  evt.stopPropagation();
                                  this.onDeleteModel(row);
                                }}
                              >
                                删除
                              </a>
                            )}
                        </div>
                      );
                    },
                  }}
                />
                <fragments slot="empty">
                  <empty-common detail-text="暂无主播列表~"></empty-common>
                </fragments>
              </tg-table>
            </div>
          ) : (
            <div class="table-box display-picture">
              {this.data.list.map((item: any) => {
                let url = item.images[0];
                if (url && url.indexOf('thumbnail=1') === -1) {
                  url = `${url}?thumbnail=1`;
                }
                return (
                  <liver-model
                    item={item}
                    isReview={this.permission.supplier_anchor_check && item.verify_status === 1}
                    isEdit={
                      this.permission.supplier_anchor_detail &&
                      this.isCreatorMaintainer(item) &&
                      item.verify_status !== 1 &&
                      item.verify_status !== 2
                    }
                    showPreview={true}
                    isDelete={
                      this.permission.supplier_anchor_delete &&
                      (item.verify_status === 0 || item.verify_status === -1)
                    }
                    onPreview={(row: any) => {
                      this.dialogImageViewRef?.show('查看照片', row.images);
                    }}
                    cover={url}
                    onShow={(row: any) => {
                      this.$router.push({
                        name: RouterNameSupplier.player_detail,
                        params: { id: row.id },
                      });
                    }}
                    onEdit={(row: any) => {
                      this.$router.push({
                        name: RouterNameSupplier.player_modify,
                        params: {
                          id: row.id,
                          verify_status: row.verify_status,
                        },
                      });
                    }}
                    onReview={(row: any) => {
                      this.$router.push({
                        name: RouterNameSupplier.player_check,
                        params: {
                          id: row.id,
                        },
                      });
                    }}
                    onDelete={(row: any) => {
                      this.onDeleteModel(row);
                    }}
                  />
                );
              })}
              {!this.data.list.length && (
                <div class="empty-model" style="marginTop:150px">
                  <empty-common detail-text="暂无数据"></empty-common>
                </div>
              )}
            </div>
          )}
          {this.data.list.length > 0 && (
            <div class="block flex-none" style="margin:0 16px">
              <el-pagination
                current-page={this.data.page_num}
                page-sizes={[10, 20, 50, 100, 200]}
                pageSize={this.data.queryForm.num}
                total={this.data.total}
                oncurrent-change={(page_num: number) => {
                  this.data.query({
                    ...this.data.queryForm,
                    page_num,
                  });
                }}
                onsize-change={(num: number) => {
                  this.data.queryForm.num = num;
                  this.data.queryStart();
                }}
                layout="total, prev, pager, next, sizes, jumper"
              />
            </div>
          )}
        </div>
        <dialogImageView ref="dialogImageViewRef" />
        <record ref="recordRef"></record>
      </div>
    );
  },
});
