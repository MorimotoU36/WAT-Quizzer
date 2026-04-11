import { useState } from 'react';
import { CategoryParentChildAPIResponseDto, CategoryQuizCountDto } from 'quizzer-lib';
import { getCategoryQuizCountAPI, getCategoryParentChildListAPI } from '@/utils/api-wrapper';

export interface CategoryTreemapItem {
  name: string;
  size?: number;
  children?: ReadonlyArray<CategoryTreemapItem>;
  [key: string]: unknown;
}

const buildTreemapData = (
  categories: CategoryQuizCountDto[],
  parentChild: CategoryParentChildAPIResponseDto[]
): CategoryTreemapItem[] => {
  const countMap = new Map<number, number>();
  const nameMap = new Map<number, string>();
  for (const cat of categories) {
    countMap.set(cat.id, cat.count);
    nameMap.set(cat.id, cat.name);
  }

  const parentToChildren = new Map<number, number[]>();
  const childSet = new Set<number>();
  for (const rel of parentChild) {
    if (!parentToChildren.has(rel.parent_category_id)) {
      parentToChildren.set(rel.parent_category_id, []);
    }
    parentToChildren.get(rel.parent_category_id)!.push(rel.child_category_id);
    childSet.add(rel.child_category_id);
  }

  const result: CategoryTreemapItem[] = [];

  for (const cat of categories) {
    if (childSet.has(cat.id)) continue;
    if (cat.count === 0) continue;

    if (parentToChildren.has(cat.id)) {
      const children: CategoryTreemapItem[] = [];
      let childrenTotalCount = 0;

      for (const childId of parentToChildren.get(cat.id)!) {
        const childCount = countMap.get(childId) ?? 0;
        const childName = nameMap.get(childId) ?? '';
        if (childCount > 0) {
          children.push({ name: childName, size: childCount });
          childrenTotalCount += childCount;
        }
      }

      const exclusiveCount = cat.count - childrenTotalCount;
      if (exclusiveCount > 0) {
        children.push({ name: `${cat.name}（直接）`, size: exclusiveCount });
      }

      if (children.length > 0) {
        result.push({ name: cat.name, children });
      }
    } else {
      result.push({ name: cat.name, size: cat.count });
    }
  }

  return result;
};

export const useCategoryTreemapData = () => {
  const [treemapData, setTreemapData] = useState<CategoryTreemapItem[]>([]);

  const fetchTreemapData = async (file_num: number) => {
    if (file_num === -1) return;

    const [countResult, parentChildResult] = await Promise.all([
      getCategoryQuizCountAPI({ getCategoryQuizCountData: { file_num } }),
      getCategoryParentChildListAPI({ getCategoryParentChildListData: { file_num } })
    ]);

    const categories = (countResult.result as CategoryQuizCountDto[] | undefined) ?? [];
    const parentChild = (parentChildResult.result as CategoryParentChildAPIResponseDto[] | undefined) ?? [];

    setTreemapData(buildTreemapData(categories, parentChild));
  };

  return { treemapData, fetchTreemapData };
};
