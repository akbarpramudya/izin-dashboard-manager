
import React from 'react';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DataItem {
  name: string;
  [key: string]: string | number;
}

interface BarChartProps {
  title: string;
  data: DataItem[];
  categories: {
    key: string;
    name: string;
    color: string;
  }[];
  xAxisDataKey: string;
}

export const BarChart: React.FC<BarChartProps> = ({
  title,
  data,
  categories,
  xAxisDataKey,
}) => {
  return (
    <Card className="w-full overflow-hidden transition-all duration-200 hover:shadow-md">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsBarChart
              data={data}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey={xAxisDataKey}
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={{ stroke: '#E5E7EB' }}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={{ stroke: '#E5E7EB' }}
              />
              <Tooltip
                wrapperStyle={{ outline: 'none' }}
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #E5E7EB',
                  borderRadius: '0.375rem',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                }}
              />
              <Legend
                wrapperStyle={{ paddingTop: 20 }}
                iconSize={10}
                iconType="circle"
              />
              {categories.map((category) => (
                <Bar
                  key={category.key}
                  dataKey={category.key}
                  name={category.name}
                  fill={category.color}
                  radius={[4, 4, 0, 0]}
                  barSize={category.key === categories[0].key ? 20 : 20}
                />
              ))}
            </RechartsBarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
