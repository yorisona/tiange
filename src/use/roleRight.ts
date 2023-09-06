/**
 * 角色权限
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-10 14:04:47
 */
import { RIGHT_CODE } from '@/const/roleCode';
import { GetRights } from '@/services/system';
import { RightNode, RightTree, RightTreeOriginal } from '@/types/tiange/system';
import { parse, unique } from '@/utils/func';
import { computed, ref, SetupContext } from '@vue/composition-api';
import { ElTree, TreeData } from 'element-ui/types/tree';

export const useRoleRight = (ctx: SetupContext) => {
  const hasRight = (code: number): boolean =>
    ctx.root.$store.getters['user/getUserRole'].includes(code);

  return { hasRight, RIGHT_CODE };
};

// 功能角色 - 权限树
export const useRight = () => {
  const originalList = ref<RightTreeOriginal[]>([]);
  const rights = ref<RightNode[]>([]);
  const rightTree = ref<RightTree[]>([]);

  const flatRightTree = (tree: RightTreeOriginal[]): RightNode[] => {
    return tree
      .map(el => {
        const { sub_nodes, ...rest } = el;

        if (sub_nodes.length > 0) {
          return [{ ...rest }, ...flatRightTree(sub_nodes)];
        } else {
          return [{ ...rest }];
        }
      })
      .flat();
  };

  /** 获取子权限列表 */
  const findChildren = (tree: RightNode[], p_code = 0): RightNode[] =>
    tree.filter(el => el.superior_code === p_code);

  /** 获取叶子节点子权限列表 */
  const findLeafChildren = (tree: RightNode[], p_code = 0): RightNode[] =>
    findChildren(tree, p_code).filter(el => findChildren(tree, el.right_code).length === 0);

  /** 获取非叶子节点子权限列表 */
  const findNonLeafChildren = (tree: RightNode[], p_code = 0): RightNode[] =>
    findChildren(tree, p_code).filter(el => findChildren(tree, el.right_code).length > 0);

  /** 给权限树修剪一下，移除叶子节点 */
  const makeRightTree = (tree: RightNode[], p_code = 0): RightTree[] =>
    tree
      .filter(el => el.superior_code === p_code)
      .map(el => ({ ...el, children: makeRightTree(tree, el.right_code) }))
      .filter(el => {
        if (el.level === 1) {
          // * 顶层(level 1)的必然包含子节点
          return true;
        } else if (el.level === 2 && findChildren(tree, el.right_code).length > 0) {
          // * 当存在是叶子节点的子权限时，自身不为叶子节点
          return true;
        } else {
          // * 自身不为叶子节点的level2, 或 level3(level3全为叶子节点)
          return false;
        }
      })
      .map(el => {
        const children = findChildren(tree, el.right_code);

        const all_code: number[] =
          el.level === 3
            ? [el.right_code]
            : el.level === 2
            ? [el.right_code, ...children.map(child => child.right_code)]
            : [
                el.right_code,
                ...children
                  .map(child => child.right_code)
                  .map(code => {
                    const children = findChildren(tree, code);

                    return [code, ...children.map(child => child.right_code)];
                  })
                  .flat(),
              ];

        return { ...el, all_code: unique(all_code) };
      });

  /** 获取权限树 */
  const getRights = async () => {
    const { data: response } = await GetRights();
    if (response.success) {
      originalList.value = parse(response.data);
      rights.value = flatRightTree(parse(response.data)).sort((aa, bb) => aa.level - bb.level);
      // * 给权限树修剪一下，移除叶子节点
      // * 叶子节点不在树里展示，在树右侧展示
      rightTree.value = makeRightTree(parse(rights.value));
    } else {
      originalList.value = [];
      rights.value = [];
      rightTree.value = [];
    }
  };

  /** 展开列表 */
  const expanded = ref<number[]>([]);

  /** 设置展开 */
  const setExpanded = (code: number) => {
    if (expanded.value.find(el => el === code)) {
      expanded.value = expanded.value.filter(el => el !== code);
    } else {
      expanded.value.push(code);
    }
  };

  const isExpanded = (code: number) => expanded.value.find(el => el === code) !== undefined;

  const treeRef = ref<ElTree<'right_code', TreeData> | undefined>(undefined);

  /** 当前选中权限node */
  const checkedRightNode = ref<RightTree | undefined>(undefined);

  /** 当前选中权限code */
  const checkedRightCode = computed<number | ''>(() => checkedRightNode.value?.right_code ?? '');

  /** 设置选中权限码 */
  const setRightChecked = (node: RightTree) => {
    checkedRightNode.value = { ...node };
  };

  /** 指定名称页面是否为当前选中展开权限码页面 */
  const isCheckedRight = (code: number) => code === checkedRightCode.value;

  /** 当前选中权限的子权限(叶子节点)列表 */
  const checkedRightChildren = computed(() =>
    checkedRightCode.value === '' ? [] : findLeafChildren(rights.value, checkedRightCode.value),
  );

  return {
    rights,
    getRights,
    rightTree,
    checkedRightNode,
    checkedRightCode,
    setRightChecked,
    treeRef,
    checkedRightChildren,
    isCheckedRight,
    setExpanded,
    isExpanded,
    findChildren,
    findLeafChildren,
    findNonLeafChildren,
  };
};
