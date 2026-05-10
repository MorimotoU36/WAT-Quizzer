import React, { useCallback, useEffect, useRef, useState } from 'react';
import Tree, { CustomNodeElementProps, RawNodeDatum } from 'react-d3-tree';
import { CategoryParentChildAPIResponseDto } from 'quizzer-lib';

interface CategoryTreeGraphProps {
  parentChildList: CategoryParentChildAPIResponseDto[];
  onDelete: (id: number) => void;
}

const buildTreeData = (parentChildList: CategoryParentChildAPIResponseDto[]): RawNodeDatum[] => {
  const childNames = new Set(parentChildList.map((r) => r.child_category_name));
  const rootNames = [...new Set(parentChildList.map((r) => r.parent_category_name))].filter(
    (name) => !childNames.has(name)
  );

  const parentToChildren = new Map<string, CategoryParentChildAPIResponseDto[]>();
  for (const rel of parentChildList) {
    if (!parentToChildren.has(rel.parent_category_name)) {
      parentToChildren.set(rel.parent_category_name, []);
    }
    parentToChildren.get(rel.parent_category_name)!.push(rel);
  }

  const buildNode = (name: string, relationId?: number): RawNodeDatum => {
    const childRels = parentToChildren.get(name) ?? [];
    return {
      name,
      attributes: relationId != null ? { _relationId: relationId } : undefined,
      children: childRels.map((rel) => buildNode(rel.child_category_name, rel.id)),
    };
  };

  return rootNames.map((name) => buildNode(name));
};

export const CategoryTreeGraph = ({ parentChildList, onDelete }: CategoryTreeGraphProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [translate, setTranslate] = useState({ x: 80, y: 200 });

  useEffect(() => {
    if (containerRef.current) {
      const { height } = containerRef.current.getBoundingClientRect();
      setTranslate({ x: 80, y: height / 2 });
    }
  }, []);

  const renderNode = useCallback(
    ({ nodeDatum }: CustomNodeElementProps) => {
      const relationId = nodeDatum.attributes?._relationId as number | undefined;
      const name = nodeDatum.name;

      // 複数ルートをまとめる仮想ルートノード
      if (name === '') {
        return <g><circle r={3} fill="#bbb" /></g>;
      }

      const boxWidth = Math.max(80, name.length * 9 + 32);
      const boxHeight = 28;
      const isRoot = relationId == null;

      return (
        <g>
          <rect
            x={-boxWidth / 2}
            y={-boxHeight / 2}
            width={boxWidth}
            height={boxHeight}
            rx={5}
            fill={isRoot ? '#fff9c4' : '#e3f2fd'}
            stroke={isRoot ? '#f9a825' : '#1976d2'}
            strokeWidth={1.5}
          />
          <text
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#333"
            fontSize={11}
            style={{ pointerEvents: 'none', userSelect: 'none' } as React.CSSProperties}
          >
            {name}
          </text>
          {!isRoot && (
            <g
              transform={`translate(${boxWidth / 2 - 10}, ${-boxHeight / 2})`}
              onClick={(e) => {
                e.stopPropagation();
                onDelete(relationId!);
              }}
              style={{ cursor: 'pointer' }}
            >
              <circle cx={5} cy={5} r={7} fill="#ef5350" />
              <text
                x={5}
                y={5}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="white"
                fontSize={11}
                fontWeight="bold"
                style={{ pointerEvents: 'none', userSelect: 'none' } as React.CSSProperties}
              >
                ×
              </text>
            </g>
          )}
        </g>
      );
    },
    [onDelete]
  );

  if (parentChildList.length === 0) {
    return <p className="text-gray-500">登録されている親子関係はありません</p>;
  }

  const treeData = buildTreeData(parentChildList);
  const data: RawNodeDatum =
    treeData.length === 1 ? treeData[0] : { name: '', children: treeData };

  return (
    <div>
      <div
        ref={containerRef}
        className="border border-gray-200 rounded bg-white overflow-hidden"
        style={{ width: '100%', height: 500 }}
      >
        <Tree
          data={data}
          orientation="horizontal"
          translate={translate}
          nodeSize={{ x: 220, y: 50 }}
          separation={{ siblings: 1.2, nonSiblings: 1.5 }}
          renderCustomNodeElement={renderNode}
          pathFunc="step"
          collapsible={false}
          zoom={0.8}
          scaleExtent={{ min: 0.2, max: 3 }}
        />
      </div>
      <p className="text-xs text-gray-400 mt-1">
        ドラッグでスクロール、ホイールでズーム。子カテゴリの <span className="text-red-400 font-bold">×</span> をクリックすると親子関係を削除できます。
      </p>
    </div>
  );
};
