"use client";

import { useState } from "react";
import Link from "next/link";
import { useAccount } from "wagmi";

export default function Home() {
  // const [activeTab, setActiveTab] = useState('overview');
  const { isConnected } = useAccount();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to DeVote</h1>
        <p className="text-xl text-gray-600 mb-8">
          A decentralized voting platform powered by blockchain technology
        </p>

        {!isConnected && (
          <div
            className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative mb-8"
            role="alert"
          >
            <span className="block sm:inline">
              Please connect your wallet to participate in voting and
              governance.
            </span>
          </div>
        )}

        {/* <div className="flex justify-center space-x-4 mb-12">
          <Link href="/voting" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors">
            Start Voting
          </Link>
          <Link href="/governance" className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors">
            Governance
          </Link>
        </div> */}
      </div>

      {/* <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'overview' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('features')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'features' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            Features
          </button>
          <button
            onClick={() => setActiveTab('governance')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'governance' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            Governance
          </button>
        </nav>
      </div> */}

      {/* {activeTab === 'overview' && ( */}
      <div className="prose lg:prose-xl mx-auto">
        {/* <h2 className="text-3xl font-semibold mb-2 mt-4">
          Decentralized Voting Platform
        </h2> */}
        <p>
          DeVote is a cutting-edge platform that enables secure, transparent,
          and tamper-proof voting using blockchain technology. Our platform
          leverages the power of Ethereum to create a system where votes are
          immutably recorded and easily verifiable.
        </p>
        <p>
          Whether for organizational decisions, community governance, or public
          polls, DeVote provides a reliable infrastructure for democratic
          decision-making in the digital age.
        </p>
        {/* <div className="mt-8">
            <img src="/voting-illustration.svg" alt="Voting Illustration" className="mx-auto rounded-lg shadow-lg" />
          </div> */}
      </div>
      {/* )} */}

      {/* {activeTab === 'features' && ( */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="bg-blue-100 text-blue-600 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">Secure Voting</h3>
          <p className="text-gray-600">
            All votes are secured by blockchain cryptography, making the system
            resistant to tampering and fraud.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="bg-green-100 text-green-600 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">Transparent Process</h3>
          <p className="text-gray-600">
            The entire voting process is transparent and verifiable, with
            results available on the blockchain.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="bg-purple-100 text-purple-600 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">Delegated Voting</h3>
          <p className="text-gray-600">
            Users can delegate their voting power to trusted representatives
            without transferring ownership of their tokens.
          </p>
        </div>
      </div>
      {/* )} */}

      {/* {activeTab === 'governance' && ( */}
      <div className="prose lg:prose-xl mx-auto mt-12">
        {/* <h2 className="text-3xl font-semibold mb-2 mt-4">
          On-Chain Governance
        </h2> */}
        <p>
          Our platform now features a full on-chain governance system powered by
          OpenZeppelin 5.x governance contracts. This system allows token
          holders to propose, vote on, and execute changes to the protocol
          directly through smart contracts.
        </p>
        <h5 className="text-xl font-medium mb-2 mt-4">Key Components</h5>
        <ul>
          <li>
            <strong>Governance Token</strong> - Used for voting rights and
            proposal creation
          </li>
          <li>
            <strong>Governor Contract</strong> - Manages the governance process
          </li>
          <li>
            <strong>Timelock Controller</strong> - Adds a delay period between
            approval and execution
          </li>
        </ul>
        <p>
          Visit the{" "}
          <Link href="/governance" className="text-blue-600 hover:underline">
            Governance page
          </Link>{" "}
          to see active proposals, create new proposals, and participate in the
          decision-making process.
        </p>
        <div className="mt-6 bg-gray-100 p-4 rounded-lg">
          <h4 className="text-lg font-semibold">Governance Process</h4>
          <ol className="list-decimal pl-5">
            <li>Token holders propose changes</li>
            <li>Community votes on proposals</li>
            <li>Approved proposals are queued in the timelock</li>
            <li>After the timelock period, proposals can be executed</li>
          </ol>
        </div>
      </div>
      {/* )} */}
    </div>
  );
}
