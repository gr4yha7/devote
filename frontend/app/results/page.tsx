'use client';
// app/results/page.tsx
import { useState } from 'react';
import { allPolls, Poll, PollOption } from '../../lib/dummyData';
import ResultsChart from '../../components/ResultsChart';

export default function ResultsPage() {
  const [selectedPollId, setSelectedPollId] = useState<string>(allPolls[0]?.id || '');
  
  // Find the selected poll
  const selectedPoll = allPolls.find(poll => poll.id === selectedPollId);
  
  return (
    <div className="space-y-8">
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Voting Results</h1>
        <p className="text-gray-600">
          View the results of all polls, both active and completed. 
          All results are directly fetched from the blockchain.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Poll List */}
        <div className="lg:col-span-1">
          <div className="card bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-4 border-b">
              <h3 className="font-semibold">Select a Poll</h3>
            </div>
            <div className="p-4">
              <div className="space-y-2 max-h-[500px] overflow-y-auto">
                {allPolls.map(poll => (
                  <button
                    key={poll.id}
                    onClick={() => setSelectedPollId(poll.id)}
                    className={`
                      w-full text-left p-3 rounded-lg transition-colors
                      ${selectedPollId === poll.id ? 'bg-blue-50 border-blue-500 border' : 'hover:bg-gray-50 border border-gray-200'}
                    `}
                  >
                    <div className="font-medium">{poll.title}</div>
                    <div className="text-sm text-gray-500 mt-1 truncate">{poll.description}</div>
                    <div className="flex justify-between items-center mt-2 text-xs">
                      <span className={`px-2 py-1 rounded-full ${poll.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {poll.isActive ? 'Active' : 'Completed'}
                      </span>
                      <span>
                        {poll.options.reduce((acc, option) => acc + option.votes, 0)} votes
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Results Display */}
        <div className="lg:col-span-2">
          {selectedPoll ? (
            <div className="card bg-white shadow-md rounded-lg overflow-hidden">
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-2">{selectedPoll.title}</h2>
                <p className="text-gray-600 mb-6">{selectedPoll.description}</p>
                
                <div className="flex justify-between items-center text-sm text-gray-500 mb-6">
                  <div>
                    <span>Started: </span>
                    <span className="font-medium">
                      {new Date(selectedPoll.startDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  <div>
                    <span>Ends: </span>
                    <span className="font-medium">
                      {new Date(selectedPoll.endDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
                
                {/* Results Chart */}
                <div className="mb-8">
                  <ResultsChart options={selectedPoll.options} />
                </div>
                
                {/* Results Table */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Voting Results</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Option
                          </th>
                          <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Votes
                          </th>
                          <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Percentage
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {selectedPoll.options.map((option) => {
                          const totalVotes = selectedPoll.options.reduce((sum, opt) => sum + opt.votes, 0);
                          const percentage = totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0;
                          
                          return (
                            <tr key={option.id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {option.text}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                                {option.votes}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                                {percentage}%
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white shadow-md rounded-lg p-8 text-center">
              <p className="text-gray-500">Select a poll to view results</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}