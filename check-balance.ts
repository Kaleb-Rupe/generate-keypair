import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { getDomainKeySync, NameRegistryState } from "@bonfida/spl-name-service";

const suppliedPublicKey = process.argv[2];

const SOLANA_CONNECTION = new Connection(
  "https://api.mainnet.solana.com",
  "confirmed"
);

let publicKey;

try {
  // Check if a public key is provided
  if (!suppliedPublicKey) {
    throw new Error("Provide a public key to check the balance of!");
  }

  // Check if the provided key is of the correct length
  if (suppliedPublicKey.length === 44) {
    publicKey = new PublicKey(suppliedPublicKey);
  } else {
    // Assume it's a custom representation and convert it
    // You need to define your own logic for this conversion
    publicKey = getPublicKeyFromSolDomain();
  }

  try {
    const balanceInLamports = await SOLANA_CONNECTION.getBalance(publicKey);
    const balanceInSOL = balanceInLamports / LAMPORTS_PER_SOL;

    console.log(
      `💰 Finished! The balance for the wallet at address ${publicKey} is ${balanceInSOL}!`
    );
  } catch (asyncError) {
    console.error("Failed to retrieve balance: ", asyncError.message);
  }
} catch (err) {
  console.error("Error", err.message);
}

async function getPublicKeyFromSolDomain() {
  const { pubkey } = getDomainKeySync(suppliedPublicKey);
  const owner = (
    await NameRegistryState.retrieve(SOLANA_CONNECTION, pubkey)
  ).registry.owner.toBase58();
  console.log(`The owner of SNS Domain: ${suppliedPublicKey} is: `, owner);
  return owner;
}
