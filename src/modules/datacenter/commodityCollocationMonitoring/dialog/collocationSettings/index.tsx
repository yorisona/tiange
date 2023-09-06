import { defineComponent, ref } from '@vue/composition-api';
import { Query_Evaluation_Group } from '@/services/performance';
import { isEmpty } from '@/utils/func';
// import { Message } from 'element-ui';
import { useRequest } from '@gm/hooks/ahooks';
import {
  save_or_update_explain_combination,
  GetGoodsCollocationDetailBySn,
} from '@/services/datacenter';
// import { Select } from '@gm/component/select';
import goodsEmpty from '@/assets/img/goods-empty.png';

export default defineComponent({
  setup(props, ctx) {
    // 推荐搭配
    const recommendedCollocationOption = ref<any[]>([]);
    const recommendedCollocationVal = ref<string>('');
    const product_sn_list = ref<string>();
    const redioVal = ref<number>(0);
    const show = (params: any | any[], project_id: string) => {
      console.log(params, 'params');
      if (!Array.isArray(params)) {
        const value = params;
        formData.value.explain_id = value.explain_id;
        formData.value.combination_type =
          value.combination_type || E.datacenter.CombinationType.use_recommend;
        formData.value.product_sn_list = value.item_list.map((it: any) => it.product_sn.trim());
        if (formData.value.product_sn_list.length === 0) {
          formData.value.product_sn_list.push('');
        }
        product_sn_list.value = params.product_sn;
      } else {
        formData.value.explain_id = params.map((it: any) => it.explain_id);
        formData.value.combination_type = E.datacenter.CombinationType.use_recommend;
        // 5.38后端需要做去重,当选择商品不同时,不允许使用推荐搭配
        const productSnArray = params.map((it: any) => it.product_sn);
        const allProductSnEqual = productSnArray.every(sn => sn === productSnArray[0]);
        if (!allProductSnEqual) {
          return;
        }
        const uniqueProductSnArray = [...new Set(productSnArray)];
        product_sn_list.value = uniqueProductSnArray.join();
      }
      console.log(product_sn_list.value, 'sss');

      if (product_sn_list.value) {
        GetGoodsCollocationDetailBySn({
          project_id: project_id,
          product_sn: product_sn_list.value,
          filter_search: true,
        }).then((res: any) => {
          if (res.data.success) {
            recommendedCollocationOption.value = res.data.data;
            const defaultIdx = recommendedCollocationOption.value.findIndex(it => {
              const val = it.map((it: any) => it.product_sn).join('/');
              return val === formData.value.product_sn_list.join('/');
            });
            console.log(res.data.data, formData.value.product_sn_list, defaultIdx, 'res.data.data');
            if (defaultIdx === -1) {
              // recommendedCollocationVal.value = formData.value.product_sn_list
              //   .map((it: any) => it.trim())
              //   .join('/');
              redioVal.value = 0;
            } else {
              redioVal.value = defaultIdx + 1;
            }
          }
        });
      }
    };
    const formRef = ref<IFormRef>();
    const options = ref<TG.OptionType[]>([]);
    const formData = ref({
      explain_id: 0 as number | number[],
      combination_type: E.datacenter.CombinationType.use_not_recommend,
      product_sn_list: [''],
    });
    const reqSave = useRequest(save_or_update_explain_combination, {
      manual: true,
      onSuccess() {
        ctx.emit('submit', {});
        ctx.emit('close');
      },
    });

    const onSaveBtnClick = async () => {
      console.log(formData.value, 'formData.value');
      formRef.value?.validate(success => {
        if (success) {
          let product_sns: string[] = [];
          if (formData.value.combination_type === E.datacenter.CombinationType.use_recommend) {
            // if (redioVal.value === 0 && !recommendedCollocationVal.value) {
            //   Message.error('请选择推荐搭配');
            //   return;
            // }
            if (redioVal.value === 0) {
              product_sns = formData.value.product_sn_list
                .map(it => {
                  return (it || '').trim();
                })
                .filter(it => !isEmpty(it));
            } else {
              product_sns =
                recommendedCollocationOption.value[redioVal.value - 1]?.map(
                  (it: any) => it.product_sn,
                ) || [];
            }
          } else if (
            formData.value.combination_type === E.datacenter.CombinationType.use_not_recommend
          ) {
            product_sns = formData.value.product_sn_list
              .map(it => {
                return (it || '').trim();
              })
              .filter(it => !isEmpty(it));
            // if (product_sns.length === 0) {
            //   Message.error('至少填写一项搭配款款号');
            //   return;
            // }
          }
          const params = {
            ...formData.value,
            product_sn_list: product_sns.filter(it => !isEmpty(it)),
          };
          if (Array.isArray(params.explain_id)) {
            // @ts-ignore
            params.explain_ids = params.explain_id;
            // @ts-ignore
            delete params.explain_id;
          }
          if (
            formData.value.combination_type === E.datacenter.CombinationType.not_use_combination
          ) {
            // @ts-ignore
            delete params.product_sn_list;
          }
          reqSave.runAsync(params as any);
        }
      });
    };
    const Query = (val: string) => {
      Query_Evaluation_Group({ num: 20, page_num: 1 }, {
        name: val,
      } as any).then((res: any) => {
        if (res.data.success) {
          options.value = res.data.data.data.map((item: any) => {
            return {
              label: item.name,
              value: item.id,
              obj: item,
            };
          });
        } else {
          options.value = [];
        }
      });
    };
    const typeChange = (val: E.datacenter.CombinationType) => {
      formData.value.combination_type = val;
    };

    return {
      onSaveBtnClick,
      show,
      formData,
      formRef,
      options,
      Query,
      recommendedCollocationVal,
      recommendedCollocationOption,
      redioVal,
      typeChange,
    };
  },
  render() {
    const { formData } = this;
    return (
      <div class="dialog-container">
        <el-form
          size="mini"
          ref="formRef"
          hide-required-asterisk={true}
          attrs={{
            model: formData,
          }}
        >
          <div class="trend">
            {/* <el-radio-group v-model={formData.combination_type}> */}
            <tg-button
              selected={formData.combination_type === E.datacenter.CombinationType.use_recommend}
              onClick={() => {
                this.typeChange(E.datacenter.CombinationType.use_recommend);
              }}
            >
              使用了推荐搭配
            </tg-button>
            <tg-button
              selected={
                formData.combination_type === E.datacenter.CombinationType.use_not_recommend
              }
              onClick={() => {
                this.typeChange(E.datacenter.CombinationType.use_not_recommend);
              }}
            >
              使用了非推荐搭配
            </tg-button>
            <tg-button
              selected={
                formData.combination_type === E.datacenter.CombinationType.not_use_combination
              }
              onClick={() => {
                this.typeChange(E.datacenter.CombinationType.not_use_combination);
              }}
            >
              没有使用搭配
            </tg-button>
            {/* </el-radio-group> */}
          </div>
          {E.datacenter.CombinationType.not_use_combination !== formData.combination_type && (
            <el-form-item
              class="item-scope"
              prop="product_sn_list"
              rules={{ required: true, message: '请输入搭配款款号' }}
            >
              {formData.combination_type === E.datacenter.CombinationType.use_recommend ? (
                <fragments>
                  {/* <Select
                    popper-class="el-select-popper-mini"
                    v-model={this.recommendedCollocationVal}
                    placeholder="请选择或手动输入新增"
                    style={{ width: '100%' }}
                    options={this.recommendedCollocationOption}
                    allow-create
                    filterable
                  /> */}
                  <el-radio-group v-model={this.redioVal} class="radio-group">
                    <div>
                      <el-radio label={0} class="special-radio">
                        {/* <el-input
                        placeholder="输入商品款号新增搭配，多个商品款号需用“/”分隔开"
                        size="mini"
                        style="width: 330px;"
                        v-model={this.recommendedCollocationVal}
                      /> */}
                        <div class="form-box">
                          {formData.product_sn_list.map((item, index) => {
                            return (
                              <div class="numbers" key={index}>
                                <el-input
                                  placeholder="请输入搭配款款号"
                                  v-model={formData.product_sn_list[index]}
                                />
                                {formData.product_sn_list.length > 1 && (
                                  <tg-icon
                                    name="ico-btn-delete"
                                    onClick={() => {
                                      formData.product_sn_list.splice(index, 1);
                                    }}
                                  />
                                )}
                              </div>
                            );
                          })}
                        </div>
                        <tg-button
                          icon="ico-btn-add"
                          class="mgt-16"
                          type="primary"
                          disabled={formData.product_sn_list.length >= 3}
                          onClick={() => {
                            formData.product_sn_list.push('');
                          }}
                        >
                          新增款号
                        </tg-button>
                      </el-radio>
                    </div>
                    {this.recommendedCollocationOption.map((item: any, idx: number) => {
                      return (
                        <div>
                          <el-radio label={idx + 1} class="img-box">
                            {item?.map((it: any) => {
                              return (
                                <div style="margin-top: 20px;">
                                  <img src={it.image_url ? it.image_url : goodsEmpty} />
                                  <div v-ellipsis={'60px'} style="margin-top: -16px;">
                                    {it.product_sn}
                                  </div>
                                </div>
                              );
                            })}
                          </el-radio>
                        </div>
                      );
                    })}
                  </el-radio-group>
                </fragments>
              ) : (
                <div class="form-box">
                  {formData.product_sn_list.map((item, index) => {
                    return (
                      <div class="numbers" key={index}>
                        <el-input
                          placeholder="请输入搭配款款号"
                          v-model={formData.product_sn_list[index]}
                        />
                        {formData.product_sn_list.length > 1 && (
                          <tg-icon
                            name="ico-btn-delete"
                            onClick={() => {
                              formData.product_sn_list.splice(index, 1);
                            }}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </el-form-item>
          )}

          <tg-button
            icon="ico-btn-add"
            type="primary"
            v-show={formData.combination_type === E.datacenter.CombinationType.use_not_recommend}
            disabled={formData.product_sn_list.length >= 3}
            onClick={() => {
              formData.product_sn_list.push('');
            }}
          >
            新增款号
          </tg-button>
        </el-form>
      </div>
    );
  },
});
