'use client';

import { useEffect, useState } from 'react';
import { useAccount, useContractRead, useContractWrite, useBlockNumber } from 'wagmi';
import { formatEther } from 'viem';
import DAPPGovernorABI from '../contracts/DAPPGovernor';

type ProposalState = 
  | 'Pending' 
  | 'Active' 
  | 'Canceled' 
  | 'Defeated' 
  | 'Succeeded' 
  | 'Queued' 
  | 'Expired' 
  | 'Executed';

const ProposalStateMap: Record<number, ProposalState> = {
  0: 'Pending',
  1: 'Active',
  2: 'Canceled',
  3: 'Defeated',
  4: 'Succeeded',
  5: 'Queued',
  6: 'Expired',
  7: 'Executed'
};

interface Proposal {
  id: bigint;
  title: string;
  description: string;
  proposer: string;
  status: ProposalState;
  votesFor: bigint;
  votesAgainst: bigint;
  votesAbstain: bigint;
  startBlock: bigint;
  endBlock: bigint;
  eta?: bigint; // For queued proposals
  hasVoted: boolean;
  userVote?: number; // 0: Against, 1: For, 2: Abstain
}

interface GovernanceProposalListProps {
  governorAddress: `0x${string}`;
  tokenAddress: `0x${string}`;
  onRefreshNeeded: () => void;
}

export default function GovernanceProposalList({
  governorAddress,
  tokenAddress,
  onRefreshNeeded
}: GovernanceProposalListProps) {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loadingProposals, setLoadingProposals] = useState(true);
  const [error, setError] = useState<string>('');
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [currentVoteType, setCurrentVoteType] = useState<number>(1); // Default to For
  const [isSubmittingVote, setIsSubmittingVote] = useState(false);
  const [isQueueing, setIsQueueing] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  
  const { address: userAddress } = useAccount();
  const { data: blockNumber } = useBlockNumber({ watch: true });

  // Vote casting
  const { write: castVote } = useContractWrite({
    address: governorAddress,
    abi: DAPPGovernorABI,
    functionName: 'castVote',
  });

  // Queue proposal
  const { write: queueProposal } = useContractWrite({
    address: governorAddress,
    abi: DAPPGovernorABI,
    functionName: 'queue',
  });

  // Execute proposal
  const { write: executeProposal } = useContractWrite({
    address: governorAddress,
    abi: DAPPGovernorABI,
    functionName: 'execute',
  });

  // Get current block number
  useEffect(() => {
    if (blockNumber) {
      fetchProposals();
    }
  }, [blockNumber, governorAddress, userAddress]);

  // Mock function to fetch proposals - in a real app, you'd use event logs
  const fetchProposals = async () => {
    setLoadingProposals(true);
    setError('');
    
    try {
      // This is a simplified example - normally you'd fetch from events
      // For this example, we'll use mock data
      const mockProposals: Proposal[] = [
        {
          id: BigInt(1),
          title: 'Treasury Allocation for Q3',
          description: 'Proposal to allocate funds for Q3 initiatives including development and marketing.',
          proposer: '0x1234...5678',
          status: 'Active',
          votesFor: BigInt(500000 * 10**18),
          votesAgainst: BigInt(200000 * 10**18),
          votesAbstain: BigInt(50000 * 10**18),
          startBlock: BigInt(Number(blockNumber) - 100),
          endBlock: BigInt(Number(blockNumber) + 1000),
          hasVoted: false
        },
        {
          id: BigInt(2),
          title: 'Protocol Upgrade Proposal',
          description: 'Upgrade the protocol to v2.0 with new features and security improvements.',
          proposer: '0xabcd...ef01',
          status: 'Succeeded',
          votesFor: BigInt(800000 * 10**18),
          votesAgainst: BigInt(150000 * 10**18),
          votesAbstain: BigInt(30000 * 10**18),
          startBlock: BigInt(Number(blockNumber) - 2000),
          endBlock: BigInt(Number(blockNumber) - 500),
          hasVoted: true,
          userVote: 1 // User voted For
        }
      ];
      
      setProposals(mockProposals);
    } catch (err) {
      console.error('Error fetching proposals:', err);
      setError('Failed to load proposals. Please try again later.');
    } finally {
      setLoadingProposals(false);
    }
  };

  // Handle voting on a proposal
  const handleVote = (proposal: Proposal) => {
    if (!userAddress) {
      setError('Please connect your wallet to vote');
      return;
    }
    
    setIsSubmittingVote(true);
    
    try {
      castVote({
        args: [proposal.id, BigInt(currentVoteType)],
        onSuccess: () => {
          // Update local state to reflect vote
          setProposals(prevProposals => 
            prevProposals.map(p => 
              p.id === proposal.id 
                ? {...p, hasVoted: true, userVote: currentVoteType}
                : p
            )
          );
          setIsSubmittingVote(false);
          onRefreshNeeded();
        },
        onError: (err) => {
          console.error('Vote error:', err);
          setError(`Failed to cast vote: ${err instanceof Error ? err.message : 'Unknown error'}`);
          setIsSubmittingVote(false);
        },
      });
    } catch (err) {
      console.error('Vote error:', err);
      setError(`Error casting vote: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setIsSubmittingVote(false);
    }
  };

  // Handle queueing a proposal
  const handleQueue = (proposal: Proposal) => {
    if (!userAddress) {
      setError('Please connect your wallet to queue this proposal');
      return;
    }
    
    setIsQueueing(true);
    
    // In a real app, you would store or retrieve the proposal details
    // Here we're using dummy values
    const targets = ['0x0000000000000000000000000000000000000000'];
    const values = [0n];
    const calldatas = ['0x'];
    const descriptionHash = proposal.description; // This would be keccak256(bytes(description))
    
    try {
      queueProposal({
        args: [targets, values, calldatas, descriptionHash],
        onSuccess: () => {
          // Update proposal status
          setProposals(prevProposals => 
            prevProposals.map(p => 
              p.id === proposal.id 
                ? {...p, status: 'Queued'}
                : p
            )
          );
          setIsQueueing(false);
          onRefreshNeeded();
        },
        onError: (err) => {
          console.error('Queue error:', err);
          setError(`Failed to queue proposal: ${err instanceof Error ? err.message : 'Unknown error'}`);
          setIsQueueing(false);
        },
      });
    } catch (err) {
      console.error('Queue error:', err);
      setError(`Error queueing proposal: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setIsQueueing(false);
    }
  };

  // Handle executing a proposal
  const handleExecute = (proposal: Proposal) => {
    if (!userAddress) {
      setError('Please connect your wallet to execute this proposal');
      return;
    }
    
    setIsExecuting(true);
    
    // Same dummy values as in queue
    const targets = ['0x0000000000000000000000000000000000000000'];
    const values = [0n];
    const calldatas = ['0x'];
    const descriptionHash = proposal.description;
    
    try {
      executeProposal({
        args: [targets, values, calldatas, descriptionHash],
        onSuccess: () => {
          // Update proposal status
          setProposals(prevProposals => 
            prevProposals.map(p => 
              p.id === proposal.id 
                ? {...p, status: 'Executed'}
                : p
            )
          );
          setIsExecuting(false);
          onRefreshNeeded();
        },
        onError: (err) => {
          console.error('Execute error:', err);
          setError(`Failed to execute proposal: ${err instanceof Error ? err.message : 'Unknown error'}`);
          setIsExecuting(false);
        },
      });
    } catch (err) {
      console.error('Execute error:', err);
      setError(`Error executing proposal: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setIsExecuting(false);
    }
  };

  // Format date for display
  const formatBlockCountdown = (targetBlock: bigint, currentBlock: bigint) => {
    const diff = Number(targetBlock - currentBlock);
    if (diff <= 0) return 'Ended';
    // Assuming ~12 second blocks
    const seconds = diff * 12;
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    
    if (days > 0) return `~${days}d ${hours}h remaining`;
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `~${hours}h ${minutes}m remaining`;
    return `~${minutes}m remaining`;
  };

  // Calculate vote percentages
  const calculatePercentages = (proposal: Proposal) => {
    const total = proposal.votesFor + proposal.votesAgainst + proposal.votesAbstain;
    if (total === 0n) return { for: 0, against: 0, abstain: 0 };
    
    return {
      for: Number((proposal.votesFor * 100n) / total),
      against: Number((proposal.votesAgainst * 100n) / total),
      abstain: Number((proposal.votesAbstain * 100n) / total)
    };
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4">Governance Proposals</h2>
      
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">
          {error}
        </div>
      )}
      
      {loadingProposals ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : proposals.length === 0 ? (
        <div className="text-center py-6">
          <p className="text-gray-500">No proposals have been created yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {proposals.map(proposal => {
            const percentages = calculatePercentages(proposal);
            const isActive = proposal.status === 'Active';
            const showVotingControls = isActive && !proposal.hasVoted && userAddress;
            const canQueue = proposal.status === 'Succeeded' && userAddress;
            const canExecute = proposal.status === 'Queued' && userAddress;
            
            return (
              <div key={proposal.id.toString()} className="border border-gray-200 rounded-lg p-5">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-semibold">{proposal.title}</h3>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    proposal.status === 'Active' ? 'bg-green-100 text-green-700' :
                    proposal.status === 'Succeeded' ? 'bg-blue-100 text-blue-700' :
                    proposal.status === 'Executed' ? 'bg-purple-100 text-purple-700' :
                    proposal.status === 'Queued' ? 'bg-yellow-100 text-yellow-700' :
                    proposal.status === 'Defeated' ? 'bg-red-100 text-red-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {proposal.status}
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
                    <div className="text-xs text-gray-500 mt-1">
                      {formatEther(proposal.votesFor)} votes
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
                    <div className="text-xs text-gray-500 mt-1">
                      {formatEther(proposal.votesAgainst)} votes
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
                    <div className="text-xs text-gray-500 mt-1">
                      {formatEther(proposal.votesAbstain)} votes
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 text-sm text-gray-500">
                  <div className="flex justify-between">
                    <span>Start: Block #{proposal.startBlock.toString()}</span>
                    <span>End: Block #{proposal.endBlock.toString()}</span>
                  </div>
                  <div className="mt-1">
                    {blockNumber && (
                      <span>
                        {isActive 
                          ? formatBlockCountdown(proposal.endBlock, BigInt(blockNumber))
                          : proposal.status === 'Pending'
                            ? formatBlockCountdown(proposal.startBlock, BigInt(blockNumber))
                            : ''
                        }
                      </span>
                    )}
                  </div>
                </div>
                
                {proposal.hasVoted && (
                  <div className="mt-4 bg-blue-50 p-3 rounded-md">
                    <div className="text-sm text-blue-700">
                      <span className="font-medium">Your vote: </span>
                      {proposal.userVote === 1 && "For"}
                      {proposal.userVote === 0 && "Against"}
                      {proposal.userVote === 2 && "Abstain"}
                    </div>
                  </div>
                )}
                
                {showVotingControls && (
                  <div className="mt-4">
                    <div className="flex flex-col space-y-2">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setCurrentVoteType(1)}
                          className={`px-4 py-2 rounded-md flex-1 ${
                            currentVoteType === 1 
                              ? 'bg-green-600 text-white' 
                              : 'bg-green-100 text-green-700 hover:bg-green-200'
                          }`}
                        >
                          For
                        </button>
                        <button
                          onClick={() => setCurrentVoteType(0)}
                          className={`px-4 py-2 rounded-md flex-1 ${
                            currentVoteType === 0
                              ? 'bg-red-600 text-white' 
                              : 'bg-red-100 text-red-700 hover:bg-red-200'
                          }`}
                        >
                          Against
                        </button>
                        <button
                          onClick={() => setCurrentVoteType(2)}
                          className={`px-4 py-2 rounded-md flex-1 ${
                            currentVoteType === 2
                              ? 'bg-gray-600 text-white' 
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          Abstain
                        </button>
                      </div>
                      
                      <button
                        onClick={() => handleVote(proposal)}
                        disabled={isSubmittingVote}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md"
                      >
                        {isSubmittingVote ? 'Submitting...' : 'Submit Vote'}
                      </button>
                    </div>
                  </div>
                )}
                
                {canQueue && (
                  <div className="mt-4">
                    <button
                      onClick={() => handleQueue(proposal)}
                      disabled={isQueueing}
                      className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-2 px-4 rounded-md"
                    >
                      {isQueueing ? 'Queueing...' : 'Queue Proposal'}
                    </button>
                  </div>
                )}
                
                {canExecute && (
                  <div className="mt-4">
                    <button
                      onClick={() => handleExecute(proposal)}
                      disabled={isExecuting}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-md"
                    >
                      {isExecuting ? 'Executing...' : 'Execute Proposal'}
                    </button>
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