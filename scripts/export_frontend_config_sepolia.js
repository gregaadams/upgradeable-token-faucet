const fs = require("fs");
const path = require("path");

function main() {
  const deployed = require("../deployed_sepolia.json");

  const tokenArtifact =
    require("../artifacts/contracts/MyToken.sol/MyToken.json");

  const faucetArtifact =
    require("../artifacts/contracts/TokenFaucet.sol/TokenFaucet.json");

  const config = {
    network: "sepolia",
    chainId: 11155111,
    contracts: {
      MyToken: {
        address: deployed.MyToken,
        abi: tokenArtifact.abi,
      },
      TokenFaucet: {
        address: deployed.TokenFaucet,
        abi: faucetArtifact.abi,
      },
    },
  };

  const outPath = path.join(
    __dirname,
    "..",
    "frontend",
    "config.sepolia.json"
  );

  fs.writeFileSync(outPath, JSON.stringify(config, null, 2));

  console.log("Frontend config written to:");
  console.log(outPath);
}

main();
