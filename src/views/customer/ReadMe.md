# 客户-协同模块
  - customer下目录结构：
    - achievement -> 业绩登记表页面
      - components -> 业绩登记表页相关组件
          AchievementCondition.vue -> 筛选条件组件
          AchievementTable.vue -> 列表展示组件
      index.vue -> 业绩登记表页面容器
    - cost -> 成本安排表页面
      - components -> 成本安排表页面相关组件
          CostCondition.vue -> 筛选条件组件
          ConstTable.vue -> 列表展示组件
      index.vue -> 成本安排表页面容器
    - index.vue -> 客户列表页面
    - cooperative -> 协同模块相关页面
      - chat_record -> 洽谈记录相关页面
          AddChatRecord.vue -> 新增/编辑洽谈记录
          ChatRecordList.vue -> 更多洽谈记录列表展示
      - components -> 协同模块通用组件
          CardItems.vue -> 数字金额卡片展示组件
          CustomerSimpleDetail.vue -> 客户基本信息展示组件
          CustomerStageProgress.vue -> 协同阶段进度展示组件
          StageProgressCardItems.vue -> 协同阶段容器组件（用来承载数组卡片以及各个阶段弹窗交互）
      - confirm_cooperation -> 确认合作相关页面
          achievement -> 业绩登记相关页面
            AchievementList.vue -> 业绩登记列表
            AddAchievement.vue -> 新增/编辑业绩
          cost -> 成本安排相关页面
            AddCost.vue -> 新增/编辑成本
            CostList.vue -> 成本安排列表
          ConfirmCooperationDetail.vue 业绩、成本Tab容器
      - cooperation -> 合作相关页面
          AddCooperation.vue -> 新增/编辑合作
          ConfirmCooperation.vue -> 确认合作弹窗
          CooperationDetail.vue -> 意向客户详情组件
          CooperationDetailMain.vue -> 合作详情容器
      - customer_detail -> 客户详情页面容器
          components -> 客户详情页面相关组件
            CustomerChatRecord.vue -> 客户洽谈组件
            CustomerCooperationList.vue -> 合作列表组件
            CustomerDetailInfo.vue -> 客户信息组件
          index.vue -> 客户详情页面容器
      - data_entry -> 数据录入相关页面
          AddScene.vue -> 添加场次弹窗页
          LiveData.vue -> 直播数据容器
      - execute_end -> 执行结束相关页面
          ExecuteEnd.vue -> 执行结束操作弹窗
          ExecuteEndDetail.vue -> 执行结束详情页
      - execute_project -> 执行项目相关页面
          AddDocumentary.vue -> 新增/编辑跟单
          AEDocumentaryList.vue -> 跟单列表页
          ExecuteAccount.vue -> 跟单金额展示组件
          ExecuteProject.vue -> 执行项目操作弹窗
          ExecuteProjectDetail.vue -> 执行AE跟单记录Tab容器
      - mixin mixin相关处理
          CooperativeStore.js -> 协同模块状态管理mixin
          CurrentUserPower.js -> 当前用户权限判断mixin

  - display/component/SceneDetailDialog.vue -> 用于协同模块中场次详情弹窗容器

  - components目录下封装公共组件
      - check_all -> 全选/反选组件
      - common_dialog -> 公共弹窗组件
      - header_button -> 头部按钮组件
      - image_dialog -> 图片预览弹窗组件
      - import_file -> 批量导入弹窗组件
      - more_items -> 更多项展示组件
      - select_items -> 选择项展示组件
      - sub_panel -> 内联Panel组件
      - table_nodata -> Table表格无数据展示组件

  - store目录下相关状态管理
      - modules/cooperative -> 协同模块相关状态管理
        - chatrecord 洽谈模块store
        - cooperation 合作模块store
        - execute 执行模块store

  - api/cooperative.js -> 协同模块接口请求文件

  - const/cooperative.js -> 协同模块常量数据封装


