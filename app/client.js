const anchor = require("@project-serum/anchor");

const provider = anchor.Provider.env();
anchor.setProvider(provider);

const CHAINLINK_PROGRAM_ID = "CaH12fwNTKJAG8PxEvo9R96Zc2j8qNHZaFj8ZW49yZNT";
const DIVISOR = 100000000;
const CHAINLINK_FEED = "EdWr4ww1Dq82vPe8GFjjcVPo2Qno3Nhn6baCgM3dCy28";

async function main() {
    const idl = JSON.parse(
      require("fs").readFileSync("../target/idl/solana_chainlink.json", "utf8")
    );
   
    const programId = new anchor.web3.PublicKey("UfEzgTJzxjpGD7xou27ZvjrPxazeF1m4BVHMmMWdvmK");
   
    const program = new anchor.Program(idl, programId);
   
    const priceFeedAccount = anchor.web3.Keypair.generate();

    await program.rpc.execute({
      accounts: {
        decimal: priceFeedAccount.publicKey,
        user: provider.wallet.publicKey,
        chainlinkFeed: CHAINLINK_FEED,
        chainlinkProgram: CHAINLINK_PROGRAM_ID,
        systemProgram: anchor.web3.SystemProgram.programId
      },
      options: { commitment: "confirmed" },
      signers: [priceFeedAccount],
    });
   
    const latestPrice = await program.account.decimal.fetch(priceFeedAccount.publicKey);
    console.log(`Price SOL/USD is: ${latestPrice.value / DIVISOR}`);
   
}
   
console.log("Running client...");
main().then(() => console.log("Finish"));
