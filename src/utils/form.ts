/**
 * 表单相关
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-05-24 10:47:31
 */
import type { Ref } from '@vue/composition-api';
import type { ElForm } from 'element-ui/types/form';
import type { Option, OptionsGroup } from '@/types/components/options';

/**
 * 表单引用的类型
 */
export type ElFormRef = ElForm | null;

/**
 * 简化获取表单校验结果
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-05-24 10:50:05
 */
export const validate = async (formRef: Ref<ElFormRef>): Promise<boolean> =>
  new Promise(resolve => {
    formRef.value?.validate(valid => resolve(valid));
  });

/**
 * 选项转分组选项
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-06-07 14:20:33
 */
export const Options2GroupedOptions = <T>(options: Required<Option<T>>[]) => {
  const array: OptionsGroup<T>[] = [];

  options.forEach(option => {
    const { label, value, group } = option;
    if (group) {
      const groupItem = array.find(el => el.label === option.group);
      if (groupItem !== undefined) {
        groupItem.options.push({
          label,
          value,
        });
      } else {
        array.push({
          label: group,
          options: [
            {
              label,
              value,
            },
          ],
        });
      }
    } else {
      array.push({
        label,
        options: [],
        value,
      });
    }
  });

  return array;
};
