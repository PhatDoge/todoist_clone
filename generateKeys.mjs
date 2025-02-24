import { exportJWK, exportPKCS8, generateKeyPair } from "jose";

// Generate an extractable key pair
const keys = await generateKeyPair("RS256", { extractable: true });

const privateKey = await exportPKCS8(keys.privateKey);
const publicKey = await exportJWK(keys.publicKey);
const jwks = JSON.stringify({ keys: [{ use: "sig", ...publicKey }] });

// Ensure the output is properly formatted
process.stdout.write(
  `CONVEX_AUTH_PRIVATE_KEY="${privateKey.replace(/\n/g, "\\n")}"\n\n`
);
process.stdout.write(`JWKS=${jwks}\n`);
