<script>
import { mapGetters } from 'vuex';
// * 似乎没有在用 brand 了
import brand from './brand';
import uploadFile from './uploadFile';
import uploadPicture from './uploadPicture';
import addAddr from './addAddr';
import { onMounted, ref, nextTick } from '@vue/composition-api';

export default {
  name: 'goodAtPlatform',
  components: {
    brand,
    uploadFile,
    uploadPicture,
    addAddr,
  },
  props: {
    baseData: {
      type: Array,
      default() {
        return [];
      },
    },
    titleClass: {
      // 标题样式
      type: String,
      default: 'info-header',
    },
    labelWidth: {
      // label宽度
      type: String,
      default: '140px',
    },
    title: {
      // 标题文字
      type: String,
      default: '基本信息',
    },
    size: {
      type: String,
      default: 'small',
    },
    editForm: {
      // 编辑状态数据
      type: Object,
      default: () => null,
    },
    labelPosition: {
      // label方向
      type: String,
      default: 'right',
    },
    gutter: {
      // el-row gutter
      type: Number,
      default: 0,
    },
  },
  computed: {
    ...mapGetters({
      companyList: 'customer/companyList',
    }),
  },
  setup(props, ctx) {
    const autoFocuseRef = ref(undefined);
    onMounted(() => {
      nextTick(() => {
        autoFocuseRef.value.focus();
      });
    });
    return {
      autoFocuseRef,
    };
  },
  directives: {},
  data() {
    return {
      baseForm: {},
      baseRules: {},
      loading: false,
    };
  },
  created() {
    // 新增时生成form数据，编辑时先生成在赋值
    this.baseData.forEach(n => {
      n.options.rules && this.$set(this.baseRules, n.key, n.options.rules); // 初始化校验规则
      this.$set(
        this.baseForm,
        n.key,
        this.editForm ? this.editForm[n.key] : typeof n.value !== 'undefined' ? n.value : '',
      ); // 初始化表单数据
      n.watchFun &&
        this.$watch(n.watchFun.key, (newVal, oldVal) => {
          n.watchFun.callback(newVal, oldVal, this.baseForm);
        }); // 绑定监听事件
    });
  },

  render(h) {
    return h(
      'el-row',
      {
        props: {
          gutter: this.gutter,
        },
      },
      [
        h(
          'el-row',
          {
            class: this.titleClass,
          },
          this.title,
        ),
        h(
          'el-form',
          {
            class: '',
            props: {
              labelWidth: this.labelWidth,
              model: this.baseForm,
              labelPosition: this.labelPosition,
              size: this.size,
            },
            ref: 'ruleForm',
          },
          this.baseData.map(v => {
            const {
              options,
              nativeOn,
              on = {},
              directives,
              labelSlot,
              componentsClass,
              props,
              attrs = {},
              span,
              offset = 0,
              components,
              slot,
              ref,
              selectOptions,
              style = {},
            } = v;
            const opts = [
              { on: {}, nativeOn: {}, props: {}, attrs: {}, model: { value: '' }, style },
            ];
            options.prop = options.prop || v.key;
            opts[0].props = props;
            opts[0].on = {};
            const evts = Object.keys(on);
            if (evts.length) {
              evts.forEach(j => {
                opts[0].on[j] = val => {
                  on[j](val, this.baseForm);
                };
              });
            }
            opts[0].class = componentsClass;
            opts[0].attrs = attrs;
            opts[0].attrs.maxLength = attrs.maxLength || 40;
            opts[0].directives = directives;
            opts[0].model.value = this.baseForm[v.key];
            opts[0].model.callback = val => this.$set(this.baseForm, v.key, val);
            opts[0].ref = ref;
            // 绑定键盘事件
            if (nativeOn && nativeOn.keyup) {
              opts[0].nativeOn.keyup = val => {
                nativeOn.keyup && nativeOn.keyup(val, this.baseForm, v.key);
              };
            } else {
              opts[0].nativeOn.keyup = val => {
                const _val = val.target.value;
                const reg = /\s/gi;
                if (reg.test(_val)) {
                  this.$set(this.baseForm, v.key, _val.replace(reg, ''));
                  val.target.value = _val.replace(reg, '');
                }
              };
            }

            let checkTop = '';
            switch (v.components) {
              case 'el-select': {
                opts[1] = [];
                opts[0].props.placeholder = attrs.placeholder;
                opts[0].model.value =
                  v.related && v.related.watch !== undefined
                    ? v.related.watch
                    : opts[0].model.value;

                const [key, val, list] = this.getKes(selectOptions);
                opts[1][0] = list.map(n =>
                  h('el-option', {
                    props: {
                      label: n[key],
                      value: n[val],
                      key: n[val],
                    },
                  }),
                );
                break;
              }
              case 'el-radio-group': {
                opts[1] = [];
                const [_key, _val, _list] = this.getKes(selectOptions);
                opts[1][0] = _list.map(n =>
                  h(
                    'el-radio',
                    {
                      props: {
                        label: n[_val],
                      },
                    },
                    n[_key],
                  ),
                );

                break;
              }
              case 'el-checkbox-group': {
                opts[1] = [];
                const [_key, _val, _list] = this.getKes(selectOptions);

                if (v.hasAll) {
                  checkTop = h(
                    'el-checkbox',
                    {
                      props: {
                        indeterminate: v.hasAll.isIndeterminate,
                      },
                      class: v.hasAll.class,
                      model: {
                        value: v.hasAll.checkAll,
                        callback: val => (v.hasAll.checkAll = val),
                      },
                      on: {
                        change: val => {
                          this.handleCheckAllChange(val, v.key, _list, _val, v);
                        },
                      },
                    },
                    '全选',
                  );
                }
                opts[1][0] = _list.map(n =>
                  h(
                    'el-checkbox',
                    {
                      props: {
                        label: n[_val],
                      },
                      on: {
                        change: val => {
                          this.handleCheckedCategoryChange(val, v.key, v);
                        },
                      },
                    },
                    n[_key],
                  ),
                );
                break;
              }
              case 'upload-file':
              case 'upload-picture': {
                opts[0].on = {};
                opts[0].props.loading = this.loading;
                opts[0].on.success = params => {
                  this.uploadFile(params, v.key, props.accept, v.on.success);
                };
                opts[0].on.delete = idx => {
                  this.deleteFile(idx, v.key);
                };
                opts[0].on.deleteImg = () => {
                  this.deleteImg(v.key);
                };
                break;
              }
              default:
                break;
            }

            return h(
              'el-col',
              {
                props: {
                  span: span,
                  offset: offset,
                },
                style: v.colStyle,
              },
              [
                h(
                  'el-form-item',
                  {
                    style: {
                      ...v.options.style,
                      display: !v.related
                        ? 'block'
                        : this.baseForm[v.related.key] === v.related.value
                        ? 'block'
                        : 'none',
                    },
                    class: v.options.componentsClass,
                    props: { ...options },
                  },
                  [
                    labelSlot && labelSlot.VNode(h),
                    checkTop,
                    h(components, ...opts, [
                      slot &&
                        h(
                          slot.template,
                          {
                            slot: slot.name,
                          },
                          slot.text,
                        ),
                    ]),
                    v.options.slot && v.options.slot.VNode && v.options.slot.VNode(h),
                  ],
                ),
              ],
            );
          }),
        ),
      ],
    );
  },
  methods: {
    async validate() {
      const result = await this.$refs['ruleForm'].validate();
      return new Promise((resolve, reject) => {
        if (result) {
          resolve(this.baseForm);
        } else {
          reject(false);
        }
      });
    },
    resetFields() {
      this.$refs['ruleForm'].resetFields();
    },
    resetFiled(k, val) {
      this.$set(this.baseForm, k, val);
    },
    handleCheckAllChange(val, k, list, _v, obj) {
      this.baseForm[k] = val ? list.map(v => v[_v]) : [];
      if (obj.hasAll) {
        obj.hasAll.isIndeterminate = false;
      }
    },
    handleCheckedCategoryChange(val, key, obj) {
      const checkedCount = obj.selectOptions.data.length;
      if (obj.hasAll) {
        obj.hasAll.checkAll = checkedCount === this.baseForm[key].length;
        obj.hasAll.isIndeterminate =
          this.baseForm[key].length !== 0 && this.baseForm[key].length < checkedCount;
      }
    },
    getKes(selectOptions) {
      let _key = '';
      let _val = '';
      let _list = [];
      if (selectOptions) {
        _key = selectOptions.key;
        _val = selectOptions.val;
        _list = selectOptions.type === 'vuex' ? this[selectOptions.data] : selectOptions.data;
      }

      return [_key, _val, _list];
    },
    deleteFile(idx, key) {
      this.baseForm[key].splice(idx, 1);
    },
    deleteImg(key) {
      this.baseForm[key] = '';
    },

    uploadFile(params, key, accept, uploadCase, size) {
      // const vm = this;
      const file = params.file;
      const fileType = file.name.split('.')[file.name.split('.').length - 1];
      const found = accept.find(type => {
        return type.toLowerCase() === fileType.toLowerCase();
      });
      if (!found) {
        this.$message.error('上传格式不正确！');
        return;
      }
      if (size && file.size > size * 1024 * 1024) {
        this.$message.error(`上传文件大小不能超过 ${size}MB!`);
        return;
      }

      this.loading = true;
      const form = new FormData();
      form.append('file', file);
      uploadCase
        .call(this, form)
        .then(data => {
          this.loading = false;
          if (data.data) {
            if (Array.isArray(this.baseForm[key])) {
              this.baseForm[key].push(data.data.data.source);
            } else {
              this.baseForm[key] = data.data.data.source;
            }
          }
        })
        .catch(() => {
          this.loading = false;
        });
    },
  },
};
</script>
