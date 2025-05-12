interface Proposal {
  id: string | number;
  title: string;
  description: string;
  startTime: string | number | Date;
  endTime: string | number | Date;
  votesFor: number;
  votesAgainst: number;
  votesAbstain: number;
  hasVoted: boolean;
  userVote?: number;
  userWeight?: number;
}

interface ProposalListProps {
  proposals: Proposal[];
  castVote: (id: string | number) => void;
  loading: boolean;
  setVoteType: (voteType: number) => void;
  currentVoteType: number;
}

export default function ProposalList({ proposals, castVote, loading, setVoteType, currentVoteType }: ProposalListProps) {
  // Format date to a readable string
  const formatDate = (date: string | number | Date): string => {
    return new Date(date).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Calculate time remaining
  const getTimeRemaining = (endTime: string | number | Date): string => {
    const now = new Date();
    const end = new Date(endTime);
    const diff = end.getTime() - now.getTime();
    
    if (diff <= 0) return 'Voting ended';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days}d ${hours}h remaining`;
    if (hours > 0) return `${hours}h ${minutes}m remaining`;
    return `${minutes}m remaining`;
  };

  // Calculate vote percentages
  const calculatePercentages = (proposal: Proposal) => {
    const total = proposal.votesFor + proposal.votesAgainst + proposal.votesAbstain;
    if (total === 0) return { for: 0, against: 0, abstain: 0 };
    
    return {
      for: Math.round((proposal.votesFor / total) * 100),
      against: Math.round((proposal.votesAgainst / total) * 100),
      abstain: Math.round((proposal.votesAbstain / total) * 100)
    };
  };

  if (proposals.length === 0 && !loading) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Proposals</h2>
        <p className="text-gray-500">No proposals have been created yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4">Governance Proposals</h2>
      
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="loader"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {proposals.map((proposal: Proposal) => {
            const percentages = calculatePercentages(proposal);
            const isActive = new Date(proposal.endTime) > new Date();
            const showVotingControls = isActive && !proposal.hasVoted;
            
            return (
              <div key={proposal.id} className="border border-gray-200 rounded-lg p-5">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-semibold">{proposal.title}</h3>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {isActive ? 'Active' : 'Closed'}
                  </span>
                </div>
                
                <p className="text-gray-600 mt-2">{proposal.description}</p>
                
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="bg-green-50 p-2 rounded">
                    <div className="flex justify-between items-center">
                      <span className="text-green-700 text-sm font-medium">For</span>
                      <span className="text-green-700 font-semibold">{percentages.for}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: `${percentages.for}%` }}></div>
                    </div>
                  </div>
                  
                  <div className="bg-red-50 p-2 rounded">
                    <div className="flex justify-between items-center">
                      <span className="text-red-700 text-sm font-medium">Against</span>
                      <span className="text-red-700 font-semibold">{percentages.against}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div className="bg-red-500 h-2 rounded-full" style={{ width: `${percentages.against}%` }}></div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-2 rounded">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 text-sm font-medium">Abstain</span>
                      <span className="text-gray-700 font-semibold">{percentages.abstain}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div className="bg-gray-500 h-2 rounded-full" style={{ width: `${percentages.abstain}%` }}></div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 text-sm text-gray-500">
                  <div className="flex justify-between">
                    <span>Started: {formatDate(proposal.startTime)}</span>
                    <span>Ends: {formatDate(proposal.endTime)}</span>
                  </div>
                  <div className="mt-1">
                    <span>{getTimeRemaining(proposal.endTime)}</span>
                  </div>
                </div>
                
                {proposal.hasVoted && (
                  <div className="mt-4 bg-blue-50 p-3 rounded-md">
                    <div className="text-sm text-blue-700">
                      <span className="font-medium">Your vote: </span>
                      {proposal.userVote === 1 && "For"}
                      {proposal.userVote === 2 && "Against"}
                      {proposal.userVote === 3 && "Abstain"}
                      <span className="ml-2 font-medium">Weight: {proposal.userWeight}</span>
                    </div>
                  </div>
                )}
                
                {showVotingControls && (
                  <div className="mt-4">
                    <div className="flex flex-col space-y-2">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setVoteType(1)}
                          className={`px-4 py-2 rounded-md flex-1 ${
                            currentVoteType === 1 
                              ? 'bg-green-600 text-white' 
                              : 'bg-green-100 text-green-700 hover:bg-green-200'
                          }`}
                        >
                          For
                        </button>
                        <button
                          onClick={() => setVoteType(2)}
                          className={`px-4 py-2 rounded-md flex-1 ${
                            currentVoteType === 2 
                              ? 'bg-red-600 text-white' 
                              : 'bg-red-100 text-red-700 hover:bg-red-200'
                          }`}
                        >
                          Against
                        </button>
                        <button
                          onClick={() => setVoteType(3)}
                          className={`px-4 py-2 rounded-md flex-1 ${
                            currentVoteType === 3 
                              ? 'bg-gray-600 text-white' 
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          Abstain
                        </button>
                      </div>
                      
                      <button
                        onClick={() => castVote(proposal.id)}
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md"
                      >
                        {loading ? 'Submitting...' : 'Submit Vote'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}