<template>
  <tg-card :padding="[0, 18, 0, 18]">
    <div class="ProjectStepBlock">
      <tg-steps :steps="stepDateList" :active="stepActiveNumber" />
      <!-- 项目试播 -->
      <projectTrial
        ref="projectTrial"
        :visible="ProjectStepTrialFormVisible"
        @ProjectTrailStep:close="onProjectTrailStepDialogModalClose"
        :step="project_status"
        @getDetail="getDetail"
      />
      <!-- 区域-区域执行 -->
      <projectArea
        ref="projectArea"
        :visible="ProjectStepAreaFormVisible"
        @ProjectAreaStep:close="onProjectAreaStepDialogModalClose"
        @getDetail="getDetail"
      />
      <!-- 项目完结 -->
      <projectFinal
        ref="projectFinal"
        :visible="ProjectStepFinalFormVisible"
        @ProjectFinalStep:close="onProjectFinalStepDialogModalClose"
        @getDetail="getDetail"
      />
    </div>
  </tg-card>
</template>

<script src="./project.step.ts"></script>

<style lang="less">
@charset 'utf-8';

.ProjectStepBlock {
  box-sizing: border-box;

  > .project-steps {
    flex: none;
    height: 97px;

    .step-icon-block {
      width: 24px;
      float: left;
      font-weight: 600;
    }

    .step-icon {
      border-radius: 50%;
      border: 1px solid;
      border-color: inherit;
      position: relative;
      z-index: 1;
      display: inline-flex;
      justify-content: center;
      align-items: center;
      width: 24px;
      height: 24px;
      font-size: 14px;
      box-sizing: border-box;
      background: #fff;
      transition: 0.15s ease-out;
    }

    .step-ongoing {
      color: #fff;
      border-color: var(--theme-color);
      background-color: var(--theme-color);
    }
    .step-done {
      color: #5c82ff;
      border-color: var(--theme-color);
      opacity: 0.9;
    }

    .step-await {
      color: var(--text-color);
      border: 2px solid rgba(60, 82, 105, 0.4);
      opacity: 0.3;
    }
    .status-await {
      color: var(--text-color);
      opacity: 0.3;
    }
    .status-done {
      color: var(--text-color);
      font-weight: 600;
    }

    .project-status-block {
      display: grid;
      padding-top: 18px;
      height: 97px;

      grid-template-columns: repeat(4, 1fr);
      .project-status-item {
        min-width: 250px;

        .project-status-info {
          width: 56px;
          float: left;
          margin-left: 6px;
          margin-top: 3px;
        }

        .project-status-name {
          font-weight: 600;
          color: var(--text-color);
          line-height: 18px;
        }
        .progress-bar {
          width: calc(100% - 98px);
          height: 2px;
          float: right;
          margin: 11px 6px 0 6px;
          background-color: #a4b2c2;
          opacity: 0.3;
        }
      }
    }
  }
}
</style>
