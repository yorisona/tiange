<template>
  <div class="tg-user-page">
    <!-- <tg-block class="flex-none" :bodyStyle="{ padding: '0' }" style="height: 48px">
      <tg-tabs :tabs="tabs" v-model="checkedTab" @change="onTabChange" />
    </tg-block> -->
    <component class="flex-auto" :is="tabPane" />
  </div>
</template>

<script src="./index.ts"></script>
