'use client';
// app/voting/page.tsx
import { useState } from 'react';
import { activePolls, completedPolls } from '../../lib/dummyData';
import VotingCard from '../../components/VotingCard';

export default function VotingPage() {
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');
  
  return (
    <div className="space-y-8">
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Voting Portal</h1>
        <p className="text-gray-600">
          Cast your vote on active proposals or review past votes. All votes are
          securely recorded on the blockchain for maximum transparency.
        </p>
      </div>
      
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="container mx-auto">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('active')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'active'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Active Polls
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'completed'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Completed Polls
            </button>
          </nav>
        </div>
      </div>
      
      {/* Poll Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {activeTab === 'active' ? (
          activePolls.length > 0 ? (
            activePolls.map((poll) => (
              <VotingCard key={poll.id} poll={poll} />
            ))
          ) : (
            <div className="col-span-2 text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No active polls</h3>
              <p className="text-gray-500">
                There are no active polls at the moment. Please check back later.
              </p>
            </div>
          )
        ) : (
          completedPolls.length > 0 ? (
            completedPolls.map((poll) => (
              <VotingCard 
                key={poll.id} 
                poll={poll}
                userHasVoted={true}
                userVotedOptionId={poll.options[0].id} // Mock data for demonstration
              />
            ))
          ) : (
            <div className="col-span-2 text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No completed polls</h3>
              <p className="text-gray-500">
                There are no completed polls to show.
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
}