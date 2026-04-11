import React from 'react';
import { Treemap, ResponsiveContainer, Tooltip } from 'recharts';
import { Typography } from '@mui/material';
import { CategoryTreemapItem } from '@/hooks/useCategoryTreemapData';

interface CategoryTreemapChartProps {
  data: CategoryTreemapItem[];
}

const COLORS = [
  '#4e79a7',
  '#f28e2b',
  '#e15759',
  '#76b7b2',
  '#59a14f',
  '#edc948',
  '#b07aa1',
  '#ff9da7',
  '#9c755f',
  '#bab0ac'
];

interface CustomContentProps {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  name?: string;
  size?: number;
  depth?: number;
  index?: number;
  root?: { children?: unknown[] };
}

const CustomContent = (props: CustomContentProps) => {
  const { x = 0, y = 0, width = 0, height = 0, name, size, depth, index = 0, root } = props;

  if (depth === 1) {
    // 親カテゴリのグループ背景
    const colorIndex = index % COLORS.length;
    return (
      <g>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          style={{ fill: COLORS[colorIndex], stroke: '#fff', strokeWidth: 2, opacity: 0.15 }}
        />
        {width > 60 && height > 20 && (
          <text
            x={x + width / 2}
            y={y + 14}
            textAnchor="middle"
            fill="#333"
            fontSize={12}
            fontWeight="bold"
            style={{ pointerEvents: 'none' }}
          >
            {name}
          </text>
        )}
      </g>
    );
  }

  if (depth === 2) {
    // 子カテゴリの葉ノード
    const parentIndex = ((root?.children as unknown[]) ?? []).findIndex((_, i) => i === Math.floor(index / 1));
    const colorIndex = (parentIndex >= 0 ? parentIndex : index) % COLORS.length;
    return (
      <g>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          style={{ fill: COLORS[colorIndex], stroke: '#fff', strokeWidth: 1, opacity: 0.8 }}
        />
        {width > 50 && height > 30 && (
          <>
            <text
              x={x + width / 2}
              y={y + height / 2 - 6}
              textAnchor="middle"
              fill="#fff"
              fontSize={11}
              style={{ pointerEvents: 'none' }}
            >
              {name}
            </text>
            <text
              x={x + width / 2}
              y={y + height / 2 + 10}
              textAnchor="middle"
              fill="#fff"
              fontSize={11}
              fontWeight="bold"
              style={{ pointerEvents: 'none' }}
            >
              {size}問
            </text>
          </>
        )}
      </g>
    );
  }

  // depth=0: ルートノード（スタンドアローンな葉ノード）
  const colorIndex = index % COLORS.length;
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        style={{ fill: COLORS[colorIndex], stroke: '#fff', strokeWidth: 2, opacity: 0.85 }}
      />
      {width > 50 && height > 30 && (
        <>
          <text
            x={x + width / 2}
            y={y + height / 2 - 6}
            textAnchor="middle"
            fill="#fff"
            fontSize={11}
            style={{ pointerEvents: 'none' }}
          >
            {name}
          </text>
          <text
            x={x + width / 2}
            y={y + height / 2 + 10}
            textAnchor="middle"
            fill="#fff"
            fontSize={11}
            fontWeight="bold"
            style={{ pointerEvents: 'none' }}
          >
            {size}問
          </text>
        </>
      )}
    </g>
  );
};

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: { payload: CategoryTreemapItem }[] }) => {
  if (active && payload && payload.length > 0) {
    const node = payload[0].payload;
    if (node.size != null) {
      return (
        <div className="bg-white border border-gray-300 rounded p-2 text-sm shadow">
          <p className="font-bold">{node.name}</p>
          <p>{node.size}問</p>
        </div>
      );
    }
  }
  return null;
};

export const CategoryTreemapChart = ({ data }: CategoryTreemapChartProps) => {
  if (data.length === 0) return null;

  return (
    <div className="mt-8 !mb-8">
      <Typography variant="h6" component="h6" className="!mb-2">
        カテゴリ別問題数
      </Typography>
      <ResponsiveContainer width="100%" height={400}>
        <Treemap data={data} dataKey="size" content={<CustomContent />}>
          <Tooltip content={<CustomTooltip />} />
        </Treemap>
      </ResponsiveContainer>
    </div>
  );
};
