import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";

//** This will be used for mainnet to lookup .sol domains */
// import { getDomainKeySync, NameRegistryState } from "@bonfida/spl-name-service";

const suppliedPublicKey = process.argv[2];

const SOLANA_CONNECTION = new Connection(
  "https://api.devnet.solana.com",
  "confirmed"
);

//** This is for when you want to store the public key globally */

// let publicKey;

try {
  // Check if a public key is provided
  if (!suppliedPublicKey) {
    throw new Error("Provide a public key to check the balance!");
  }

  // Check if the provided key is of the correct length
  if (suppliedPublicKey.length !== 44) {
    throw new Error(`${suppliedPublicKey} is not a valid address!`);
  }

  //**Noted out for now when in devnet as this feature must be connected to mainnet */
  //   else {
  //     // Assume it's a custom representation and convert it
  //     // You need to define your own logic for this conversion
  //     publicKey = getPublicKeyFromSolDomain();
  //   }

  const publicKey = new PublicKey(suppliedPublicKey);
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

//**This is here for when connected to mainnet and you want to look up somes .sol domain and find out how much SOL they are holding. */

// async function getPublicKeyFromSolDomain() {
//   const { pubkey } = getDomainKeySync(suppliedPublicKey);
//   const owner = (
//     await NameRegistryState.retrieve(SOLANA_CONNECTION, pubkey)
//   ).registry.owner.toBase58();
//   console.log(`The owner of SNS Domain: ${suppliedPublicKey} is: `, owner);
//   return owner;
// }
