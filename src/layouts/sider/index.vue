<template>
  <!-- side -->
  <el-aside
    class="aside-menu"
    style="background: #0a2142"
    :class="menuIsMini ? 'mini' : ''"
    :width="menuIsMini ? '60px' : '176px'"
  >
    <div class="logo" :class="menuIsMini ? 'mini' : ''">
      <div class="logo-img"></div>
    </div>
    <el-menu
      v-if="menus.length > 0"
      ref="elmenu"
      :default-active="activePath"
      router
      style="border: none"
      text-color="rgba(255, 255, 255, 0.8)"
      active-text-color="var(--theme-color)"
      :default-openeds="computedOpeneds"
      @open="onMenuOpen"
      @close="onMenuClose"
    >
      <template v-for="(item, index) in menus">
        <!-- 无菜单 -->
        <template v-if="item.children.length === 0">
          <el-menu-item
            :key="index"
            :index="item.path"
            :class="activeParentPath === item.path ? ' is-active' : ''"
          >
            <template #title>
              <template v-if="activeParentPath === item.path">
                <tg-icon :name="`${item.meta.icon}`" :class="item.meta.icon" />
                <span data-name="template-title" style="color: var(--theme-color)">{{
                  item.meta.name
                }}</span>
              </template>
              <template v-else>
                <tg-icon :name="item.meta.icon" class="nohover" />
                <tg-icon :name="`${item.meta.icon}`" class="ishover" />
                <span data-name="template-title">{{ item.meta.name }}</span>
              </template>
            </template>
            <div class="extra-single-mini-menu-item" :key="`ex-${index}`">
              <router-link :to="{ name: item.name }">{{ item.meta.name }}</router-link>
            </div>
          </el-menu-item>
        </template>
        <!-- 含子菜单 -->
        <template v-else>
          <template v-if="getRouteAuth(item.meta)">
            <el-submenu :key="index" :index="item.path" :data-has-right="getRouteAuth(item.meta)">
              <template #title>
                <template v-if="activeParentPath === item.path">
                  <tg-icon :name="`${item.meta.icon}`" :class="item.meta.icon" />
                </template>
                <template v-else>
                  <tg-icon :name="item.meta.icon" :class="item.meta.icon" class="nohover" />
                  <tg-icon :name="`${item.meta.icon}`" class="ishover" />
                </template>
                <span>{{ item.meta.name }}</span>
              </template>
              <el-menu-item-group>
                <template v-for="(children, submenuIndex) in item.children">
                  <template v-if="getRouteAuth(children.meta)">
                    <el-menu-item
                      v-if="children.path === 'shangJiaXiTong'"
                      :class="
                        $route.path === children.path ? 'is-super-active hover-item' : 'hover-item'
                      "
                      :key="submenuIndex"
                      style="padding-left: 51px"
                      ><a
                        class="shangJiaXiTong"
                        href="https://dashboard.goumee.com/"
                        target="_blank"
                        >{{ children.meta.name }}</a
                      ></el-menu-item
                    >
                    <el-menu-item
                      v-if="!children.hidden && children.path !== 'shangJiaXiTong'"
                      :index="children.path"
                      :class="
                        $route.path === children.path ? 'is-super-active hover-item' : 'hover-item'
                      "
                      :key="submenuIndex"
                      style="padding-left: 51px"
                    >
                      {{ children.meta.name }}
                    </el-menu-item>
                  </template>
                </template>
              </el-menu-item-group>
            </el-submenu>
          </template>
        </template>
      </template>
    </el-menu>
    <div class="menu-scale-icon">
      <tg-icon
        :name="menuIsMini ? 'ico-menu-zhankai' : 'ico-menu-shouqi'"
        @click="handleCollapse"
        style="font-size: 24px; cursor: pointer"
      />
    </div>
  </el-aside>
</template>

<script src="./index.ts"></script>

<style lang="less">
@import '~@/styles/utils/index.less';

.aside-menu {
  user-select: none;
  @asideBgc: #0a2142;
  @menuItemHeight: 40px;
  .pos-r();
  z-index: 1000;
  transition: width 0.3s linear;
  > .el-menu {
    height: calc(100vh - 140px);
    /*flex: auto;*/
    overflow-x: hidden;
    overflow-y: auto;
    overflow-y: overlay;
    .bgc(@asideBgc);
    &::-webkit-scrollbar {
      /*display: none;*/
      width: 6px;
    }
    &::-webkit-scrollbar-thumb {
      background-color: #5c6879 !important;
      color: #5c6879 !important;
    }
  }
  .menu-scale-icon {
    display: flex;
    position: fixed;
    bottom: 0px;
    z-index: 11111;
    .wh(60px, 56px);
    justify-self: flex-start;
    align-items: center;
    justify-content: center;
    .brd-r(fade(black, 6));
    svg.icon {
      color: rgba(255, 255, 255, 0.6) !important;
      fill: rgba(255, 255, 255, 0.6) !important;
    }
  }
  .shangJiaXiTong {
    color: rgba(255, 255, 255, 0.7);
  }
  .el-menu-item {
    .bgc(@asideBgc);
    z-index: 3500;
    > .extra-single-mini-menu-item {
      .d-n();
      @width: 96px;
      z-index: 3000;
      position: fixed;
      left: 60px;
      .wh(@width, @menuItemHeight);
      .bgc(@asideBgc);
      box-shadow: #e2e2e2 3px 0px 6px;
      .ta-c();
      > a {
        .d-b();
        .wh(@width, @menuItemHeight);
        .fgc(#99a1aa);
      }
    }
    &.hover-item:hover {
      color: rgba(255, 255, 255, 0.7) !important;
    }
  }
  .el-submenu {
    &:hover {
      .el-submenu__title {
        &:hover {
          background: rgba(var(--theme-rgb-color), 0.6) !important;
        }
      }
    }
  }
  &:not(.mini) {
    .el-submenu.is-active {
      .bgc(@asideBgc);
      &:before {
        .bgc(@asideBgc);
      }
    }
  }

  // 菜单项标题
  .el-menu-item,
  .el-submenu > .el-submenu__title {
    display: flex;
    align-items: center;
    padding-left: 18px !important;
    .hlh(@menuItemHeight, @menuItemHeight);
    row-gap: 8px;
    > span {
      .pos-r();
      .fs(14px);
      .mgl(10px);
      > b {
        .pos-atr(100; 16px; -14px);
        .wh(8px, 8px);
        .brdr(50%);
        .bgc(rgb(233, 83, 99));
      }
    }
    > svg.icon {
      .fs(20px);
    }
  }
  .el-menu .el-submenu > .el-menu--inline .el-menu-item-group .el-menu-item {
    padding-left: 48px !important;
  }

  &.mini {
    .el-menu-item {
      &:hover {
        > .extra-single-mini-menu-item {
          .d-b();
        }
      }
    }

    .el-submenu {
      > .el-submenu__title {
        > span,
        > .el-submenu__icon-arrow {
          .d-n();
        }
      }
      > .el-menu {
        .d-b();
      }
    }
  }

  .el-submenu.is-active.is-opened .el-icon-arrow-down {
    color: #ffffff;
  }
  .el-submenu.is-active .el-icon-arrow-down {
    color: #ffffff;
  }
  .el-menu-item:hover {
    /*background: rgba(var(--theme-rgb-color), 0.6) !important;*/
    background: #2a5eb7 !important;
    > span {
      color: rgba(255, 255, 255, 0.7);
    }
  }
  .el-submenu:hover {
    .el-submenu__title {
      /*background: cyan !important;*/
      > span {
        color: rgba(255, 255, 255, 0.7);
      }
      .el-icon-arrow-down {
        color: rgba(255, 255, 255, 0.7);
      }
    }
  }
  .el-menu-item:hover {
    .template-title {
      .fc(16px,var(--theme-color));
    }
  }

  .el-menu-item {
    &:hover {
      > .nohover {
        display: none;
      }
    }
    &:not(:hover) {
      > .ishover {
        display: none;
      }
    }
  }

  .el-submenu:hover > .el-submenu__title {
    > .nohover {
      display: none;
    }
    > .ishover {
      display: block;
      color: rgba(255, 255, 255, 0.6) !important;
    }
  }
  .el-submenu:not(:hover) > .el-submenu__title {
    > .ishover {
      display: none;
    }
  }
  .el-submenu:not(:hover):not(.is-active) > .el-submenu__title,
  .el-menu-item:not(:hover):not(.is-active) {
    > span {
      color: fade(white, 70);
    }
  }
}
</style>
