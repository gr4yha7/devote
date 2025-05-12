'use client';
// components/ResultsChart.tsx
import { PollOption } from '../lib/dummyData';

interface ResultsChartProps {
  options: PollOption[];
  highlightOptionId?: string;
}

const ResultsChart = ({ options, highlightOptionId }: ResultsChartProps) => {
  // Calculate total votes
  const totalVotes = options.reduce((acc, option) => acc + option.votes, 0);
  
  // Colors for different chart bars
  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-purple-500',
    'bg-yellow-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-red-500',
    'bg-orange-500',
  ];
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Results</h3>
        <span className="text-gray-500">{totalVotes} total votes</span>
      </div>
      
      <div className="space-y-4">
        {options.map((option, index) => {
          const percentage = totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0;
          const isHighlighted = option.id === highlightOptionId;
          
          return (
            <div key={option.id} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className={`font-medium ${isHighlighted ? 'text-blue-600' : ''}`}>
                  {option.text}
                  {isHighlighted && <span className="ml-2 text-sm">(Your vote)</span>}
                </span>
                <span className="font-medium">{percentage}%</span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className={`h-2.5 rounded-full ${isHighlighted ? 'bg-blue-600' : colors[index % colors.length]}`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
              
              <div className="text-sm text-gray-500">
                {option.votes} votes
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ResultsChart;