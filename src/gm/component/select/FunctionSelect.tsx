import { h, PropType, ref, defineComponent, watch } from '@vue/composition-api';
import { Select } from './Select';
import { GetAuthQueryUser, GetSearchProject } from '@/services/supplier';
import { QueryOperatingProjects } from '@/services/finance';
export enum EFunctionSelectType {
  /** 花名查询 **/
  FLOWER_NAME,
  /** 搜索店播项目或营销项目  */
  SEARCH_PROJECT,
  /** 搜索损益表项目 */
  SEARCH_PROFIT_LOSS,
}

export interface IFunctionSelectConfig {
  request?: (value: string) => Promise<TG.OptionType[]>;
}
export const FunctionSelect = defineComponent({
  name: 'FunctionSelect',
  props: {
    config: {
      type: Object as PropType<IFunctionSelectConfig>,
    },
    modeType: {
      type: Object as PropType<EFunctionSelectType>,
      required: true,
    },
    placeholder: {
      type: String as PropType<string>,
    },
    clearable: {
      type: Boolean,
    },
    defaultValue: {
      type: Array as PropType<TG.OptionType[]>,
    },
    size: {
      type: String as PropType<'mini' | 'small'>,
    },
    multiple: {
      type: Boolean,
    },
    otherParams: {
      type: Object as PropType<any>,
      default: () => ({}),
    },
  },
  methods: {},
  setup: props => {
    const options = ref<TG.OptionType[]>(props.defaultValue || []);

    const RemoteMethodMap = {
      [EFunctionSelectType.FLOWER_NAME]: (value: string) => {
        GetAuthQueryUser({
          search_value: value,
          is_checked: 1,
          search_type: 2,
          ...props.otherParams,
        }).then((res: any) => {
          options.value =
            res.data?.map((item: any) => {
              return { label: item.username, value: item.id };
            }) || [];
        });
      },
      [EFunctionSelectType.SEARCH_PROJECT]: (value: string) => {
        GetSearchProject({
          name: value,
          ...props.otherParams,
        }).then((res: any) => {
          options.value = res ?? [];
        });
      },
      [EFunctionSelectType.SEARCH_PROFIT_LOSS]: (value: string) => {
        QueryOperatingProjects({
          project_name: value,
          ...props.otherParams,
        }).then((res: any) => {
          options.value =
            res.data?.data?.map((item: any) => {
              return { label: item.project_name, value: item.project_id };
            }) || [];
        });
      },
    };

    const propsConfig = props.config;

    const RemoteMethod = (value: string) => {
      console.log('触发搜索', value);
      if (value.trim() === '') {
        if (!props.multiple) options.value = [];
        return;
      }
      if (propsConfig !== undefined && propsConfig.request) {
        propsConfig.request(value).then(data => (options.value = data));
      } else {
        RemoteMethodMap[props.modeType](value);
      }
    };
    watch(
      () => props.defaultValue,
      (newVal: any) => {
        options.value = newVal;
      },
    );
    return { options, RemoteMethod };
  },
  render() {
    // @ts-ignore
    const options: TG.OptionType[] = this.options;
    const { RemoteMethod } = this;

    const props = {
      attrs: {
        ...this.$attrs,
        'remote-method': RemoteMethod,
      },
      props: {
        filterable: true,
        remote: true,
        options,
        ...this.$options.propsData,
      },
      on: {
        ...this.$listeners,
      },
    };

    return h(Select, props);
  },
});
