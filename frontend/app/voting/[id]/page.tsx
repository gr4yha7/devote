'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useAccount } from 'wagmi';
import { getPollById, Poll, Vote, userVoteHistory } from '../../../lib/dummyData';
import ConnectWallet from '../../../components/ConnectWallet';
import VoteButton from '../../../components/VoteButton';

export default function PollDetail() {
  const { id } = useParams();
  const [poll, setPoll] = useState<Poll | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isVoting, setIsVoting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [userVotedOptionId, setUserVotedOptionId] = useState<string | null>(null);
  
  const { address, isConnected } = useAccount();
  
  useEffect(() => {
    // Get poll data
    if (id) {
      const foundPoll = getPollById(id as string);
      setPoll(foundPoll || null);
      
      // Check if user has already voted
      if (isConnected && address) {
        const userVote = userVoteHistory.find((vote: Vote) => vote.pollId === id && vote.voter.toLowerCase() === address.toLowerCase());
        if (userVote) {
          setHasVoted(true);
          setUserVotedOptionId(userVote.optionId);
          setSelectedOption(userVote.optionId);
        }
      }
      
      setLoading(false);
    }
  }, [id, address, isConnected]);
  
  // Format date to be more readable
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    });
  };
  
  // Calculate remaining time
  const getRemainingTime = () => {
    if (!poll) return '';
    
    const now = new Date();
    const endDate = new Date(poll.endDate);
    const diffTime = endDate.getTime() - now.getTime();
    
    if (diffTime <= 0) return 'Voting ended';
    
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''}, ${diffHours} hour${diffHours > 1 ? 's' : ''} remaining`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''}, ${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} remaining`;
    } else {
      return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} remaining`;
    }
  };
  
  const handleVote = async () => {
    if (!selectedOption || !isConnected) return;
    
    setIsVoting(true);
    
    // Simulate blockchain transaction delay
    setTimeout(() => {
      setIsVoting(false);
      setHasVoted(true);
      setUserVotedOptionId(selectedOption);
    }, 2000);
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (!poll) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Poll Not Found</h1>
          <p className="mb-6">The poll you're looking for does not exist or has been removed.</p>
          <Link href="/voting" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Back to Polls
          </Link>
        </div>
      </div>
    );
  }
  
  // Calculate total votes
  const totalVotes = poll.options.reduce((acc: number, option: { id: string; text: string; votes: number }) => acc + option.votes, 0);
  const isPollActive = new Date() < new Date(poll.endDate);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/voting" className="text-blue-600 hover:underline flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to All Polls
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl font-bold mb-2">{poll.title}</h1>
              <p className="text-gray-600">{poll.description}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${isPollActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
              {isPollActive ? 'Active' : 'Closed'}
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h2 className="text-lg font-semibold mb-3">Poll Details</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Start Date:</span>
                  <span>{formatDate(poll.startDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">End Date:</span>
                  <span>{formatDate(poll.endDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="font-medium">{isPollActive ? getRemainingTime() : 'Completed'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Votes:</span>
                  <span>{totalVotes.toLocaleString()}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-lg font-semibold mb-3">Current Results</h2>
              <div className="space-y-3">
                {poll.options.map((option: { id: string; text: string; votes: number }) => {
                  const percentage = totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0;
                  
                  return (
                    <div key={option.id} className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">{option.text}</span>
                        <div className="flex items-center">
                          <span className="text-sm font-medium mr-2">{percentage}%</span>
                          <span className="text-xs text-gray-500">({option.votes.toLocaleString()} votes)</span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`rounded-full h-2 ${userVotedOptionId === option.id ? 'bg-green-500' : 'bg-blue-500'}`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          
          {isPollActive && (
            <div className="border-t pt-6">
              <h2 className="text-lg font-semibold mb-4">Cast Your Vote</h2>
              
              {!isConnected ? (
                <div className="text-center p-6">
                  <p className="mb-4">Connect your wallet to cast your vote</p>
                  <ConnectWallet />
                </div>
              ) : hasVoted ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                  <div className="text-green-600 font-medium mb-1">Thank you for voting!</div>
                  <div className="text-sm text-gray-600">
                    Your vote has been recorded on the blockchain.
                  </div>
                </div>
              ) : (
                <div>
                  <div className="space-y-3 mb-6">
                    {poll.options.map((option: { id: string; text: string; votes: number }) => (
                      <label 
                        key={option.id} 
                        className={`
                          flex items-center p-4 border rounded-lg cursor-pointer transition-colors
                          ${selectedOption === option.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}
                        `}
                      >
                        <input
                          type="radio"
                          name={`poll-${poll.id}`}
                          value={option.id}
                          checked={selectedOption === option.id}
                          onChange={() => setSelectedOption(option.id)}
                          className="mr-3"
                        />
                        <span>{option.text}</span>
                      </label>
                    ))}
                  </div>
                  
                  <div className="flex justify-end">
                    <VoteButton 
                      disabled={!selectedOption || isVoting}
                      isLoading={isVoting}
                      onClick={handleVote}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}