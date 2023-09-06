# goumee-star-temp

### 注意事项

yarn 安装时会提示 node 版本不对,请执行 yarn config set ignore-engines true

### Error cannot find module './public/dll/bundle.json'

npm run dll

eslint 升级到 8.x,使用 webstorm 的童鞋请注意看这篇文章, 更改后重启 webstorm https://blog.csdn.net/liming1016/article/details/124544409

## 路由配置

#### 二级页面返回按钮显示及注意事项

二级页面 返回按钮有 meta:hidden 控制 (isNoShowBack 为先) 二级页面路由 path：默认三层 (否则从一级页面跳转后，点击返回不了一级) activePath: 一级页面亮蓝色，新页面点击返回去一级页面 parentPath: 一级页面所在的项 mate: 新增字段-isNewPage：跳转新打开页面需要特殊处理的，在 D:\work\tiangedev\goumee-star-frontend\src\layouts\home\home.ts 里面修改返回事件 backClick

##### 二级导航条修改

const showBackTitleHandle = inject('showBackTitleHandle') as Function; showBackTitleHandle(routes);

## tg 组件变化

#### tg-table 支持 formatter 模板字符串

```js
{
  ...,
  prop: 'refund_after_sent_out_num',
  formatter: `{?A} ({refund_before_sent_out_ratio/2}%)`,
}
```

- 支持?判断符先行判断,假值直接返回--
- A 默认代表 prop
- 支持花括号获取变量
- 支持简单计算

## 新增指令

#### click-outsideclick-outside 点击元素外部触发事件

#### auto-placeholder 用于表单内自动获取 el-form-item 的 label

因为每次要更改<el-form-item label='****'>后,还需要手动更改内部表单组件的 placeholder 太麻烦了,而且往往会忘记

```js
const promptMap = new Map([
  ['el-input', '请输入'],
  ['el-select', '请选择'],
  ['el-date-editor', '请选择'],
  ['el-textarea', '请输入'],
  ['tg-tree-select-container', '请选择'],
]); // 可以自行添加

// demo
<el-form-item label="项目名称：">
  <Select
    options={this.project_options}
    v-model={queryForm.project_id}
    style="width:100%"
    v-auto-placeholder
    filterable={true}
  />
</el-form-item>; // output: 请选择项目名称
```

#### load-more 用于滚动加载更多默认获取 el-table,内部集成了防抖

```js
v-load-more={{
  el: 'el-table', // 滚动的元素,默认el-table
  delay: 2000, // 防抖
  cb() { // 回调
    console.log('on');
  },
}}
```

#### ellipsis 用于文本溢出显示省略号

> 因为每次引入组件 or 方法感觉麻烦,原生写了一个,样式已经跟 ui 确认过了

注意: 该指令只对上边界做了处理,目前仅推荐在简单的文字溢出处理使用,可能有其他边界情况,请自行处理

```js
v-ellipsis={'60px'} // 支持string和number
```

- 集成了对文件后缀的处理,如果有文件后缀,会自动从中间截断,并且显示后缀
- string: 60px | 60% // 显示的宽度
- number: 10 // 显示的字数
