'use client';

import Link from 'next/link';

export default function HowItWorks() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">How DeVote Works</h1>
        
        <div className="mb-10">
          <p className="mb-4">
            DeVote leverages blockchain technology to create a transparent, secure, and tamper-proof voting system.
            Here's a detailed explanation of how our platform works and how you can participate.
          </p>
        </div>
        
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">The Voting Process</h2>
          
          <div className="space-y-12">
            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className="bg-blue-100 text-blue-800 rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0 font-bold text-xl">
                1
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Connect Your Wallet</h3>
                <p className="text-gray-600 mb-4">
                  Start by connecting your Ethereum wallet (MetaMask, WalletConnect, or any other supported provider).
                  Your wallet serves as your identity on the platform and is used to sign your votes.
                </p>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <strong className="text-gray-700 block mb-1">Why it matters:</strong>
                  <p className="text-sm text-gray-600">
                    Using blockchain wallets eliminates the need for traditional user registration and authentication,
                    making the process more secure and resistant to identity theft or voter impersonation.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className="bg-blue-100 text-blue-800 rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0 font-bold text-xl">
                2
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Browse Active Polls</h3>
                <p className="text-gray-600 mb-4">
                  Explore the list of active polls. Each poll includes a title, description, voting options, and important
                  details like start and end dates. You can view current results in real-time.
                </p>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <strong className="text-gray-700 block mb-1">Behind the scenes:</strong>
                  <p className="text-sm text-gray-600">
                    All polls are stored as smart contracts on the Ethereum blockchain, ensuring that the rules and parameters
                    of each vote cannot be changed once the poll is created.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className="bg-blue-100 text-blue-800 rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0 font-bold text-xl">
                3
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Cast Your Vote</h3>
                <p className="text-gray-600 mb-4">
                  Select your preferred option and submit your vote. Your wallet will prompt you to sign the transaction,
                  which includes a small gas fee. Once confirmed, your vote is permanently recorded on the blockchain.
                </p>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <strong className="text-gray-700 block mb-1">Technical details:</strong>
                  <p className="text-sm text-gray-600">
                    Each vote is a transaction that calls the <code>castVote()</code> function on the voting contract.
                    The contract verifies your eligibility, records your vote, and updates the tally. Your vote is weighted
                    based on your governance token holdings or delegated voting power.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className="bg-blue-100 text-blue-800 rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0 font-bold text-xl">
                4
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Verify Results</h3>
                <p className="text-gray-600 mb-4">
                  Once the voting period ends, the final results are tallied automatically. You can verify the results
                  at any time by checking the blockchain directly or using our interface.
                </p>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <strong className="text-gray-700 block mb-1">Why it's trustworthy:</strong>
                  <p className="text-sm text-gray-600">
                    Because all votes are recorded on a public blockchain, anyone can independently verify the results.
                    This creates a level of transparency impossible with traditional voting systems. Our platform
                    also provides tools to analyze voting patterns (while preserving voter privacy).
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Governance Tokens</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-3">What are Governance Tokens?</h3>
              <p className="text-gray-600">
                Governance tokens are special ERC20 tokens that represent voting power in the system. The more tokens
                you hold or have staked, the more influence you have in the voting process.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-3">How to Get Tokens</h3>
              <p className="text-gray-600">
                Governance tokens can be acquired through various means, including participation in the community,
                contribution to projects, or direct purchase from exchanges that list the token.
              </p>
            </div>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-3">Advanced Governance Features</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium">Delegation</h4>
                <p className="text-sm text-gray-600">
                  If you don't want to vote on every proposal, you can delegate your voting power to another address
                  that will vote on your behalf. You can reclaim your voting power at any time.
                </p>
              </div>
              <div>
                <h4 className="font-medium">Time-Weighted Voting</h4>
                <p className="text-sm text-gray-600">
                  Some polls may use time-weighted voting, where tokens that have been held longer have more voting power.
                  This rewards long-term community members and reduces the impact of short-term token acquisitions.
                </p>
              </div>
              <div>
                <h4 className="font-medium">Quadratic Voting</h4>
                <p className="text-sm text-gray-600">
                  In some special polls, we implement quadratic voting, where voting power scales with the square root of tokens held.
                  This prevents large token holders from having disproportionate influence.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Technical Architecture</h2>
          
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-lg font-semibold mb-3">Smart Contracts</h3>
            <p className="text-gray-600 mb-4">
              DeVote is built on several key smart contracts:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-gray-600">
              <li><strong>GovernanceToken</strong>: An ERC20 token with additional voting power functionality</li>
              <li><strong>DAOVoting</strong>: The core contract that manages proposals and votes</li>
              <li><strong>VotingFactory</strong>: Creates and deploys new voting contracts for specific polls</li>
              <li><strong>TimelockController</strong>: Implements delays between vote completion and execution</li>
            </ul>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-3">Frontend Integration</h3>
            <p className="text-gray-600 mb-4">
              Our user interface interacts with these contracts through:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-gray-600">
              <li><strong>Web3 Provider</strong>: Connects your wallet to our application</li>
              <li><strong>Contract ABIs</strong>: Defines how to interact with the smart contracts</li>
              <li><strong>Event Listeners</strong>: Updates the UI in real-time when blockchain events occur</li>
              <li><strong>IPFS Storage</strong>: Stores additional metadata and content too large for on-chain storage</li>
            </ul>
          </div>
        </section>
        
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-6">Security Measures</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-blue-500 mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Audited Contracts</h3>
              <p className="text-sm text-gray-600">
                All our smart contracts undergo rigorous security audits by reputable firms before deployment.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-blue-500 mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Sybil Resistance</h3>
              <p className="text-sm text-gray-600">
                Our system includes measures to prevent Sybil attacks, ensuring one entity cannot gain undue influence.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-blue-500 mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Transaction Privacy</h3>
              <p className="text-sm text-gray-600">
                While votes are recorded on-chain, we implement measures to protect the privacy of individual voters.
              </p>
            </div>
          </div>
        </section>
        
        <div className="bg-blue-600 text-white rounded-lg p-6 mb-10">
          <h2 className="text-xl font-semibold mb-3">Ready to Start Voting?</h2>
          <p className="mb-4">
            Now that you understand how DeVote works, it's time to participate in our decentralized governance system.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              href="/voting" 
              className="px-4 py-2 bg-white text-blue-600 rounded hover:bg-gray-100 text-center"
            >
              Browse Active Polls
            </Link>
            <Link 
              href="/about" 
              className="px-4 py-2 border border-white text-white rounded hover:bg-blue-700 text-center"
            >
              Learn About DeVote
            </Link>
          </div>
        </div>
        
        <section>
          <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
          
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className="font-semibold mb-2">Do I need to pay for voting?</h3>
              <p className="text-gray-600">
                Voting requires a small amount of ETH to cover the gas fees for the transaction. The actual cost 
                depends on current network conditions, but we've optimized our contracts to minimize gas usage.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className="font-semibold mb-2">Can I change my vote after submitting?</h3>
              <p className="text-gray-600">
                No, votes are immutable once recorded on the blockchain. This ensures the integrity of the voting process, 
                but it also means you should carefully consider your choice before voting.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className="font-semibold mb-2">What happens if I acquire more tokens during a vote?</h3>
              <p className="text-gray-600">
                Your voting power is determined at the moment you cast your vote, based on your token balance 
                or staked amount at that time. Acquiring more tokens after voting won't increase the weight of your existing vote.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className="font-semibold mb-2">Can I create my own poll?</h3>
              <p className="text-gray-600">
                Yes! Users who hold a minimum threshold of governance tokens can create new proposals. The specific 
                threshold varies depending on the total token supply and governance parameters.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}