"use client";

// components/ConnectWallet.tsx
import { userHasWallet, AuthStatus } from "@civic/auth-web3";
import { UserButton, useUser } from "@civic/auth-web3/react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
// import { useAutoConnect } from "@civic/auth-web3/wagmi";

export default function ConnectWallet() {
  // useAutoConnect();
  const userContext = useUser();
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  // A function to connect an existing civic embedded wallet
  const connectExistingWallet = () => {
    return connect({
      connector: connectors?.[0],
    });
  };
  const connectWallet = () => {
    if (userContext.user && !userHasWallet(userContext)) {
      return userContext.createWallet().then(connectExistingWallet);
    }
  };

  return (
    <div className="flex justify-center">
      <UserButton />
      {userHasWallet(userContext) && isConnected ? (
        <div className="flex flex-col items-center space-y-2">
          <div className="bg-blue-50 p-2 px-4 rounded-lg">
            <p className="text-sm text-gray-600">Connected as</p>
            <p className="font-mono font-medium">
              {address?.substring(0, 6)}...
              {address?.substring(address.length - 4)}
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
        userContext.authStatus === AuthStatus.AUTHENTICATED && (
          <button
            onClick={connectWallet}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-md transition-colors"
          >
            {}
            Connect Wallet
          </button>
        )
      )}
    </div>
  );
}
