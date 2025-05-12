'use client';

import Link from 'next/link';

export default function About() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">About DeVote</h1>
        
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-4">Our Mission</h2>
          <p className="mb-4">
            DeVote is a decentralized voting platform built on blockchain technology, designed to provide transparent, 
            secure, and tamper-proof voting solutions for organizations, communities, and governance systems.
          </p>
          <p className="mb-4">
            Our mission is to revolutionize democratic processes by leveraging the power of blockchain to ensure 
            that every vote is counted fairly, transparently, and without the possibility of manipulation or fraud.
          </p>
        </section>
        
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-4">The Technology</h2>
          <p className="mb-4">
            Built on Ethereum, DeVote uses smart contracts to create a trustless voting environment where:
          </p>
          <ul className="list-disc pl-5 mb-4 space-y-2">
            <li>Every vote is permanently recorded on the blockchain</li>
            <li>Results are calculated automatically and can be independently verified by anyone</li>
            <li>Votes cannot be altered once cast</li>
            <li>The entire process is transparent and auditable</li>
            <li>No central authority controls the outcome</li>
          </ul>
          <p>
            We utilize ERC20 governance tokens for on-chain voting weight, allowing for flexible governance models 
            including quadratic voting, delegation, and time-weighted voting power.
          </p>
        </section>
        
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-4">Our Team</h2>
          <p className="mb-4">
            DeVote was created by a passionate team of blockchain developers, cryptographers, and governance 
            enthusiasts who believe in the potential of decentralized systems to create more fair and 
            transparent decision-making processes.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="bg-white rounded-lg shadow-md p-4 text-center">
              <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg">Alice Johnson</h3>
              <p className="text-gray-600 text-sm">Blockchain Developer</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4 text-center">
              <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg">Bob Smith</h3>
              <p className="text-gray-600 text-sm">Cryptography Specialist</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4 text-center">
              <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg">Carol Williams</h3>
              <p className="text-gray-600 text-sm">Governance Expert</p>
            </div>
          </div>
        </section>
        
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-4">Roadmap</h2>
          <div className="relative border-l-2 border-blue-500 pl-6 ml-4 py-2">
            <div className="mb-8 relative">
              <div className="absolute -left-8 top-1 w-4 h-4 bg-blue-500 rounded-full"></div>
              <h3 className="font-semibold">Q2 2025</h3>
              <p className="text-gray-600">Initial platform launch with basic voting features</p>
            </div>
            <div className="mb-8 relative">
              <div className="absolute -left-8 top-1 w-4 h-4 bg-blue-500 rounded-full"></div>
              <h3 className="font-semibold">Q3 2025</h3>
              <p className="text-gray-600">Governance token staking and delegation features</p>
            </div>
            <div className="mb-8 relative">
              <div className="absolute -left-8 top-1 w-4 h-4 bg-blue-500 rounded-full"></div>
              <h3 className="font-semibold">Q4 2025</h3>
              <p className="text-gray-600">Multi-chain support and integration with popular DAOs</p>
            </div>
            <div className="mb-8 relative">
              <div className="absolute -left-8 top-1 w-4 h-4 bg-blue-300 rounded-full"></div>
              <h3 className="font-semibold">Q1 2026</h3>
              <p className="text-gray-600">Advanced governance models and customizable voting parameters</p>
            </div>
            <div className="relative">
              <div className="absolute -left-8 top-1 w-4 h-4 bg-blue-300 rounded-full"></div>
              <h3 className="font-semibold">Q2 2026</h3>
              <p className="text-gray-600">Web3 identity integration and reputation-based voting</p>
            </div>
          </div>
        </section>
        
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Get Involved</h2>
          <p className="mb-4">
            DeVote is built with community involvement in mind. We welcome contributions, feedback, and participation 
            from developers, governance enthusiasts, and anyone interested in building decentralized voting systems.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              href="/how-it-works" 
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-center"
            >
              Learn How It Works
            </Link>
            <Link 
              href="/voting" 
              className="px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50 text-center"
            >
              Explore Active Polls
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}