import { ethers } from "ethers";
import { AutomateSDK } from "@gelatonetwork/automate-sdk";
import { config } from "../config";
import { TriggerType } from "@gelatonetwork/automate-sdk";
import escrowABI from "../contracts/escrowABI.json"

async function main() {
    const provider = new ethers.providers.JsonRpcProvider(config.rpc);
    const signer = new ethers.Wallet(config.pk, provider);

   const automate = await AutomateSDK.create(config.chainId, signer);

   const contract = new ethers.Contract(
    process.env.CONTRACT_ADDRESS!,
    escrowABI,
    signer
  );

const { taskId } = await automate.createTask({
  name: "Escrow Auto Payment",
  execAddress: contract.address,
  execSelector: contract.interface.getSighash("processSubscriptionPayment"),

  // Resolver logic
  resolverAddress: contract.address,
  resolverData: contract.interface.encodeFunctionData("checker"),

  // Required fields
  dedicatedMsgSender: true,
  trigger: {
  type: TriggerType.TIME,
  interval: 60, // every 60 seconds
}

});
    console.log("Task created:", taskId);
}

main().catch(console.error);