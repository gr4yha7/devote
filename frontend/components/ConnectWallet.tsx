"use client";

// components/ConnectWallet.tsx
import { userHasWallet, AuthStatus } from "@civic/auth-web3";
import { UserButton, useUser } from "@civic/auth-web3/react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { LogOutIcon, Unplug, UserIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
// import { useAutoConnect } from "@civic/auth-web3/wagmi";

export default function ConnectWallet() {
  // useAutoConnect();
  const userContext = useUser();
  const { address, isConnected } = useAccount();
  const { connect, connectAsync, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  // A function to connect an existing civic embedded wallet
  const connectExistingWallet = async () => {
    connectAsync({
      connector: connectors?.[0],
    });
  };

  const connectWallet = async () => {
    try {
      if (userContext.user && !userHasWallet(userContext)) {
        await userContext.createWallet();
        await connectExistingWallet();
      } else if (userContext.user && userHasWallet(userContext)) {
        await connectExistingWallet();
      } else {
        console.error("Error connecting wallet:");
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

  return (
    <div className="flex justify-center">
      {userContext.authStatus !== AuthStatus.AUTHENTICATED &&
        !userContext.user && <UserButton />}
      {userHasWallet(userContext) && isConnected && (
        <div className="flex flex-row justify-evenly space-x-2">
          <div className="space-x-4">
            <Link href="/governance">
              <button className="bg-blue-600 text-white px-5 py-2 rounded font-semibold">
                Dashboard
              </button>
            </Link>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="bg-white border-2 border-blue-600 text-blue-600 p-1 px-2 rounded-md flex items-center space-x-2">
                {/* Placeholder for gear icon */}
                <UserIcon className="w-4 h-4" />
                <p className="font-normal">
                  {address?.substring(0, 6)}...
                  {address?.substring(address.length - 4)}
                </p>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48">
              <DropdownMenuItem onClick={() => disconnect()}>
                <Unplug className="w-6 h-6 mr-2" />
                Disconnect
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOutIcon className="w-6 h-6 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
  );
}
