import * as dotenv from "dotenv";
dotenv.config();

export const config = {
  pk: process.env.PRIVATE_KEY!,
  rpc: process.env.RPC_URL!,
  escrow: process.env.ESCROW_ADDRESS!,
  chainId: Number(process.env.CHAIN_ID!),
};
