import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import type { Category } from '../../types';

type Props = { breakdown: Record<string, number>; categories: Category[] };

export default function CategoryDonut({ breakdown, categories }: Props) {
  const data = categories
    .map(c => ({ name: c.label, value: Math.round((breakdown[c.id] || 0) / 60), color: c.color }))
    .filter(d => d.value > 0);
  return (
    <ResponsiveContainer width="100%" height={240}>
      <PieChart>
        <Pie data={data} dataKey="value" innerRadius={50} outerRadius={90}>
          {data.map((d, i) => <Cell key={i} fill={d.color} />)}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
}
