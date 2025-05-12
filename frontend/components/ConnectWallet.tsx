'use client';

// components/ConnectWallet.tsx
import { useAccount, useConnect, useDisconnect } from 'wagmi';

export default function ConnectWallet() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  return (
    <div className="flex justify-center">
      {isConnected ? (
        <div className="flex flex-col items-center space-y-2">
          <div className="bg-blue-50 p-2 px-4 rounded-lg">
            <p className="text-sm text-gray-600">Connected as</p>
            <p className="font-mono font-medium">
              {address?.substring(0, 6)}...{address?.substring(address.length - 4)}
            </p>
          </div>
          <button
            onClick={() => disconnect()}
            className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            Disconnect Wallet
          </button>
        </div>
      ) : (
          <button
            onClick={() => connect({ connector: connectors[0] })}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-md transition-colors"
          >
            Connect Wallet
          </button>
      )}
    </div>
  );
}