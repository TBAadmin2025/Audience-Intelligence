import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

export const ScoreGauge = ({ score, size = 200, strokeWidth = 15, color = "#C9A96A" }: { score: number, size?: number, strokeWidth?: number, color?: string }) => {
  const data = [
    { value: score },
    { value: 100 - score },
  ];

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={size / 2 - strokeWidth}
            outerRadius={size / 2}
            startAngle={90}
            endAngle={-270}
            paddingAngle={0}
            dataKey="value"
            stroke="none"
          >
            <Cell fill={color} />
            <Cell fill="#F7F7F7" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-5xl font-serif font-bold text-navy">{score}</span>
      </div>
    </div>
  );
};
