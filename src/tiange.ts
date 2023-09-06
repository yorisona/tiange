import { PluginObject, VueConstructor } from 'vue/types/umd';
import TgButton from '@/components/Button/button';
import TgGhostButton from '@/components/Button/ghost';
import TgButtonLine from '@/components/Button/line';
import TgBlock from '@/layouts/block';
import TgBreadcrumbs from '@/layouts/breadcrumbs';
import TgCard from '@/components/Card/card';
import TgDialog from '@/components/Dialog';
import TgLabel from '@/components/Label';
import TgTabs from '@/components/Tabs';
import TgTag from '@/components/Tag';
import TgIcon from '@/components/IconFont/tg.vue';
import DefText from '@/components/DefText';
import TgFileCardGroup from '@/components/FileCard/file.card.group';
import TgFileCard from '@/components/FileCard/file.card';
import TgMaskLoading from '@/components/MaskLoading';
import TgCalendar from '@/components/Calendar';
import TgSteps from '@/components/Steps';
import TgCheckBox from '@/components/CheckBox/index.vue';
import TgRadio from '@/components/Radio/index.vue';
import TgDivider from '@/components/Divider/index.vue';
import TgMask from '@/components/Mask/index.vue';
import DrawerHeader from '@/components/DrawerHeader/drawer.header.vue';
import DrawerCustomer from '@/components/DrawerHeader/drawer.customer';
import Upp from '@/components/Uploader/uploader';
import Uppf from '@/components/Uploader/uploader.file';
import TgTable from '@/components/Table';
import TgUpload from '@/components/Upload';
import TgImage from '@/components/Image';

const install: PluginObject<undefined> = {
  install(vue: VueConstructor) {
    vue.component(TgButton.name, TgButton);
    vue.component(TgGhostButton.name, TgGhostButton);
    vue.component(TgButtonLine.name, TgButtonLine);
    vue.component(TgBlock.name, TgBlock);
    vue.component(TgBreadcrumbs.name, TgBreadcrumbs);
    vue.component(TgCard.name, TgCard);
    vue.component(TgTable.name, TgTable);
    vue.component(TgUpload.name, TgUpload);
    vue.component(TgImage.name, TgImage);

    vue.use(TgDialog);
    vue.use(TgLabel);
    vue.use(TgTabs);
    vue.use(TgTag);

    vue.component(TgIcon.name, TgIcon);
    vue.component('DefText', DefText);
    vue.component(TgFileCard.name, TgFileCard);
    vue.component(TgFileCardGroup.name, TgFileCardGroup);
    vue.component(TgMaskLoading.name, TgMaskLoading);
    vue.component(TgCheckBox.name, TgCheckBox);
    vue.component(TgRadio.name, TgRadio);
    vue.component(TgDivider.name, TgDivider);
    vue.component(TgMask.name, TgMask);
    vue.use(TgCalendar);
    vue.use(TgSteps);
    vue.component('Upp', Upp);
    vue.component('Uppf', Uppf);
    vue.component(Upp.name, Upp);
    vue.component(Uppf.name, Uppf);

    // ! 下面的是业务组件
    // ! 后续如有需要做单独组件库项目，请拆分独立注册

    vue.component(DrawerHeader.name, DrawerHeader);
    vue.component(DrawerCustomer.name, DrawerCustomer);
  },
};

export default install;
