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
    config.contract,
    escrowABI,
    signer
  );

const gasEstimate = await (contract.estimateGas["checker"]as any)("0x23316A7AF939a09c0Ee9A57Dece71ba7f2A0F996");
console.log("Gas estimate:", gasEstimate.toString());


const { taskId } = await automate.createTask({
  name: "Subscription Auto-Payment 1",
  execAddress: contract.address,
  execSelector: contract.interface.getSighash("checker"),
  execData: contract.interface.encodeFunctionData("checker", ["0x23316A7AF939a09c0Ee9A57Dece71ba7f2A0F996"]), // Using subscription ID 1 as example

  // Use time-based trigger instead of resolver
  trigger: {
    type: TriggerType.TIME,
    interval: 20, // every 20 seconds
  },

  // Required fields
  dedicatedMsgSender: true
});
    console.log("Task created:", taskId);
}

main().catch(console.error);