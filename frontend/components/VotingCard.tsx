'use client';
// components/VotingCard.tsx
import { useState } from 'react';
import Link from 'next/link';
import { Poll, PollOption } from '../lib/dummyData';
import VoteButton from './VoteButton';

interface VotingCardProps {
  poll: Poll;
  userHasVoted?: boolean;
  userVotedOptionId?: string;
}

const VotingCard = ({ poll, userHasVoted = false, userVotedOptionId }: VotingCardProps) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(userVotedOptionId || null);
  const [isVoting, setIsVoting] = useState(false);
  const [hasVoted, setHasVoted] = useState(userHasVoted);
  
  // Calculate total votes
  const totalVotes = poll.options.reduce((acc, option) => acc + option.votes, 0);
  
  // Format date to be more readable
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  // Calculate remaining time
  const getRemainingTime = () => {
    const now = new Date();
    const endDate = new Date(poll.endDate);
    const diffTime = endDate.getTime() - now.getTime();
    
    if (diffTime <= 0) return 'Voting ended';
    
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} remaining`;
    } else {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} remaining`;
    }
  };
  
  const handleVote = async () => {
    if (!selectedOption) return;
    
    setIsVoting(true);
    
    // Simulate blockchain transaction delay
    setTimeout(() => {
      setIsVoting(false);
      setHasVoted(true);
    }, 2000);
  };
  
  return (
    <div className="card bg-white shadow-md rounded-lg overflow-hidden">
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2">{poll.title}</h3>
        <p className="text-gray-600 mb-4">{poll.description}</p>
        
        <div className="flex justify-between text-sm text-gray-500 mb-4">
          <span>Started: {formatDate(poll.startDate)}</span>
          <span>Ends: {formatDate(poll.endDate)}</span>
        </div>
        
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">{getRemainingTime()}</span>
            <span className="text-sm font-medium">{totalVotes} votes</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full" 
              style={{ width: `${Math.min(100, (new Date(poll.endDate).getTime() - new Date().getTime()) / (new Date(poll.endDate).getTime() - new Date(poll.startDate).getTime()) * 100)}%` }}
            ></div>
          </div>
        </div>
        
        <div className="space-y-3 mb-6">
          {poll.options.map((option) => {
            const percentage = totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0;
            
            return (
              <div key={option.id} className="relative">
                <label className={`
                  flex items-center p-4 border rounded-lg cursor-pointer transition-colors
                  ${hasVoted ? 'pointer-events-none' : 'hover:bg-gray-50'}
                  ${selectedOption === option.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}
                `}>
                  {!hasVoted && (
                    <input
                      type="radio"
                      name={`poll-${poll.id}`}
                      value={option.id}
                      checked={selectedOption === option.id}
                      onChange={() => setSelectedOption(option.id)}
                      className="mr-3"
                    />
                  )}
                  <span className="flex-grow">{option.text}</span>
                  {hasVoted && (
                    <span className="ml-2 font-medium">
                      {percentage}%
                      {userVotedOptionId === option.id && (
                        <span className="ml-2 text-green-600 text-sm">(Your vote)</span>
                      )}
                    </span>
                  )}
                </label>
                
                {hasVoted && (
                  <div className="mt-1">
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div 
                        className={`h-1.5 rounded-full ${userVotedOptionId === option.id ? 'bg-green-500' : 'bg-blue-500'}`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        <div className="flex justify-between items-center">
          <Link 
            href={`/voting/${poll.id}`} 
            className="text-blue-600 hover:underline"
          >
            View Details
          </Link>
          
          {!hasVoted ? (
            <VoteButton 
              disabled={!selectedOption || isVoting}
              isLoading={isVoting}
              onClick={handleVote}
            />
          ) : (
            <span className="text-green-600 font-medium">Vote recorded</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default VotingCard;