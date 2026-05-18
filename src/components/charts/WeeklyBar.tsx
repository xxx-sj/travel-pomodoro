import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import type { WeeklyByDay } from '../../lib/stats';
import type { Category } from '../../types';

type Props = { data: WeeklyByDay[]; categories: Category[] };

export default function WeeklyBar({ data, categories }: Props) {
  const flat = data.map(d => ({
    name: d.dayLabel,
    ...Object.fromEntries(Object.entries(d.categories).map(([k, v]) => [k, Math.round(v / 60)])),
  }));
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={flat}>
        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} unit="m" />
        <Tooltip />
        {categories.map(c => (
          <Bar key={c.id} dataKey={c.id} stackId="a" fill={c.color} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
