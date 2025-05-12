// components/VotingStats.tsx

interface TokenBalance {
  formatted: string;
  symbol: string;
}

interface VotingStats {
  totalVotesFor: number;
  totalVotesAgainst: number;
  totalVotesAbstain: number;
  totalProposals: number;
  activeVoters: number;
}

interface VotingStatsProps {
  stats: VotingStats;
  tokenBalance?: TokenBalance;
}

export default function VotingStats({ stats, tokenBalance }: VotingStatsProps) {
  const { 
    totalVotesFor, 
    totalVotesAgainst, 
    totalVotesAbstain,
    totalProposals, 
    activeVoters 
  } = stats;
  
  const totalVotes = totalVotesFor + totalVotesAgainst + totalVotesAbstain;
  
  // Calculate vote type percentages
  const forPercentage = totalVotes > 0 ? Math.round((totalVotesFor / totalVotes) * 100) : 0;
  const againstPercentage = totalVotes > 0 ? Math.round((totalVotesAgainst / totalVotes) * 100) : 0;
  const abstainPercentage = totalVotes > 0 ? Math.round((totalVotesAbstain / totalVotes) * 100) : 0;
  
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4">Governance Stats</h2>
      
      {tokenBalance && (
        <div className="mb-4 p-4 bg-indigo-50 rounded-lg">
          <div className="text-sm font-medium text-indigo-700">Your Token Balance</div>
          <div className="flex items-baseline mt-1">
            <div className="text-2xl font-bold text-indigo-900">
              {parseFloat(tokenBalance.formatted).toFixed(2)}
            </div>
            <div className="ml-2 text-sm text-indigo-700">{tokenBalance.symbol}</div>
          </div>
          <div className="mt-2 text-xs text-indigo-600">
            More tokens = more voting power
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-blue-600 text-sm font-medium">Total Votes</div>
          <div className="text-2xl font-bold">{totalVotes}</div>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-green-600 text-sm font-medium">Proposals</div>
          <div className="text-2xl font-bold">{totalProposals}</div>
        </div>
      </div>
      
      <div className="bg-purple-50 p-4 rounded-lg mb-4">
        <div className="text-purple-600 text-sm font-medium">Active Voters</div>
        <div className="text-2xl font-bold">{activeVoters}</div>
      </div>
      
      <div className="mt-4">
        <h3 className="text-lg font-medium mb-2">Vote Distribution</h3>
        
        <div className="space-y-3">
          <div>
            <div className="flex justify-between items-center">
              <span className="text-green-700 text-sm">For</span>
              <span className="text-green-700 text-sm font-medium">{forPercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
              <div 
                className="bg-green-500 h-2 rounded-full" 
                style={{ width: `${forPercentage}%` }}
              ></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between items-center">
              <span className="text-red-700 text-sm">Against</span>
              <span className="text-red-700 text-sm font-medium">{againstPercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
              <div 
                className="bg-red-500 h-2 rounded-full" 
                style={{ width: `${againstPercentage}%` }}
              ></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700 text-sm">Abstain</span>
              <span className="text-gray-700 text-sm font-medium">{abstainPercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
              <div 
                className="bg-gray-500 h-2 rounded-full" 
                style={{ width: `${abstainPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}