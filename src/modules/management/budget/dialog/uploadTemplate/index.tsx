import { defineComponent, ref } from '@vue/composition-api';
import { ValidationFileUpload } from '@/modules/supplier/playerManager/common/FormValidation';
import moment from 'moment';
import { ImportDepartmentManagementFile, ImportProjectManagementFile } from '@/services/management';
import { sleep } from '@/utils/func';
import { Message } from 'element-ui';
export default defineComponent({
  setup(props, ctx) {
    const file_path = ref('');
    const type_str = ref<string>('');
    const show_success = ref(false);
    const show_fail = ref(false);
    const finish_obj = ref({
      error_count: '',
      success_count: '',
      error_msg: '',
    });
    const select_year = ref(moment().format('YYYY'));
    const currentYearOptions = [
      { label: moment().format('YYYY') + ' 年', value: Number(moment().format('YYYY')) },
    ];
    const show = (value: string, year: string) => {
      type_str.value = value;
      select_year.value = year;
    };
    const save_loading = ref(false);
    const onSaveBtnClick = async () => {
      if (!file_path.value) {
        ctx.root.$message.warning('请选择文件！');
        return;
      }
      save_loading.value = true;
      if (type_str.value === '2') {
        const [{ data: response }, _] = await Promise.all([
          await ImportDepartmentManagementFile({
            file_path: file_path.value,
            year: Number(select_year.value),
          }),
          await sleep(200),
        ]);
        save_loading.value = false;
        if (response.success) {
          show_success.value = true;
          show_fail.value = false;
        } else {
          show_success.value = false;
          show_fail.value = true;
        }
        finish_obj.value = response.data;
      } else if (type_str.value === '1') {
        const [{ data: response }, _] = await Promise.all([
          await ImportProjectManagementFile({
            file_path: file_path.value,
            year: Number(select_year.value),
          }),
          await sleep(200),
        ]);
        save_loading.value = false;
        if (response.success) {
          show_success.value = true;
          show_fail.value = false;
        } else {
          show_success.value = false;
          show_fail.value = true;
        }
        finish_obj.value = response.data;
      }
    };
    const handleRemoveFileClick = () => {
      file_path.value = '';
    };
    const onClose = () => {
      ctx.emit('close');
    };
    const onSuccessClick = () => {
      show_success.value = false;
      show_success.value = false;
      ctx.emit('close');
      ctx.emit('submit');
    };
    return {
      finish_obj,
      onSuccessClick,
      show_success,
      show_fail,
      onClose,
      handleRemoveFileClick,
      file_path,
      currentYearOptions,
      onSaveBtnClick,
      show,
      type_str,
      select_year,
      save_loading,
    };
  },
  render() {
    return (
      <div>
        {this.show_success === false && this.show_fail === false && (
          <div>
            <div class="dialog-container">
              <el-form size="mini" label-width="60px">
                <el-form-item label="所属年度：">
                  <el-select
                    popper-class="el-select-popper-mini"
                    v-model={this.select_year}
                    class="budget-select"
                    placeholder="请选择所属年度"
                    style="width: 100%"
                  >
                    {this.currentYearOptions.map((el, index) => {
                      return (
                        <el-option label={el.label} value={el.value} key={index + 1}></el-option>
                      );
                    })}
                  </el-select>
                </el-form-item>
                <el-form-item label="选择文件：">
                  <tg-upload
                    // action={this.upload_url}
                    action="/api/resources/upload_file"
                    data={{ type: 'allocated', storage: 2 }}
                    show-file-list={false}
                    beforeUpload={ValidationFileUpload({
                      fileSize: 5,
                      extensions: ['.xls', '.xlsx'],
                    })}
                    success={(res: any) => {
                      if (res.success) {
                        this.file_path = res.data.source;
                      } else {
                        Message.error(res.message || '上传文件失败！');
                      }

                      // this.onSaveBtnClick(res.data.source);
                    }}
                  >
                    <tg-button disabled={this.file_path !== ''} icon="ico-btn-upload">
                      上传文件
                    </tg-button>
                  </tg-upload>
                </el-form-item>
              </el-form>
              {this.file_path && (
                <fileItem
                  showDown={false}
                  showPreview={false}
                  filepath={this.file_path}
                  onRemove={() => this.handleRemoveFileClick()}
                />
              )}
              {!this.file_path && <div class="tips-div">支持扩展名：xlsx；文件大小不超过5M</div>}
            </div>
            <div class="btns-line">
              <tg-button onClick={this.onClose}>取消</tg-button>
              <tg-button v-loading={this.save_loading} type="primary" onClick={this.onSaveBtnClick}>
                保存
              </tg-button>
            </div>
          </div>
        )}
        {this.show_success && (
          <div class="dialog-container message">
            <tg-icon name="ico-chenggongtongzhi"></tg-icon>
            <div class="title">目标导入完成</div>
            <div class="tips">成功导入目标数据{this.finish_obj.success_count}条</div>
            <tg-button v-loading={this.save_loading} type="primary" onClick={this.onSuccessClick}>
              我知道了
            </tg-button>
          </div>
        )}
        {this.show_fail && (
          <div class="dialog-container message">
            <tg-icon name="ico-shibaitongzhi"></tg-icon>
            <div class="title">目标导入完成</div>
            <div class="label">
              成功导入目标数据{this.finish_obj.success_count}条，
              <span class="fail">失败{this.finish_obj.error_count}条</span>
            </div>
            <div class="tips">{this.finish_obj.error_msg}</div>
            <tg-button onClick={this.onSuccessClick}>我知道了</tg-button>
          </div>
        )}
      </div>
    );
  },
});
