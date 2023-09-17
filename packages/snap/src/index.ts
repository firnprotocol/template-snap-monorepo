import { OnRpcRequestHandler } from '@metamask/snaps-types';
import { panel, text } from '@metamask/snaps-ui';
import { createPublicClient, custom, getContract } from 'viem';
import { mainnet } from 'viem/chains';

import { wagmiAbi } from './abi';

/**
 * Handle incoming JSON-RPC requests, sent through `wallet_invokeSnap`.
 *
 * @param args - The request handler args as object.
 * @param args.origin - The origin of the request, e.g., the website that
 * invoked the snap.
 * @param args.request - A validated JSON-RPC request object.
 * @returns The result of `snap_dialog`.
 * @throws If the request method is not valid for this snap.
 */
export const onRpcRequest: OnRpcRequestHandler = async ({ origin, request }) => {
  switch (request.method) {
    case 'hello': {
      const publicClient = createPublicClient({
        chain: mainnet, // ???
        transport: custom(ethereum),
      });
      const contract = getContract({
        address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2',
        abi: wagmiAbi,
        publicClient,
      });

      // <<< THE BELOW HANGS AND TIMES OUT >>>>>
      const data = await contract.read.totalSupply();

      // <<<< THE BELOW DOESN'T HANG, BUT FAILS >>>>>
      // const data = await publicClient.multicall({
      //   contracts: [
      //     {
      //       address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2',
      //       abi: wagmiAbi,
      //       functionName: 'totalSupply',
      //     },
      //     {
      //       address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2',
      //       abi: wagmiAbi,
      //       functionName: 'balanceOf',
      //       args: ['0xa5cc3c03994DB5b0d9A5eEdD10CabaB0813678AC'],
      //     },
      //   ],
      // });

      return snap.request({
        method: 'snap_dialog',
        params: {
          type: 'confirmation',
          content: panel([
            text(`Hello, **${origin}**!`),
            text('This custom confirmation is just for display purposes.'),
            text(`Result of call: ${JSON.stringify(data)}`),
          ]),
        },
      });
    }
    default:
      throw new Error('Method not found.');
  }
};
