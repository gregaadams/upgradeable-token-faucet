const fs = require("fs");
const path = require("path");

function save(networkName, data) {
  const dir = path.join(__dirname, "..", "deployments");
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);

  const file = path.join(dir, `${networkName}.json`);

  let existing = {};
  if (fs.existsSync(file)) existing = JSON.parse(fs.readFileSync(file, "utf8"));

  const merged = {
    ...existing,
    ...data,
    updatedAt: new Date().toISOString(),
  };

  fs.writeFileSync(file, JSON.stringify(merged, null, 2));
  console.log("Saved deployment:", file);
}

module.exports = { save };
