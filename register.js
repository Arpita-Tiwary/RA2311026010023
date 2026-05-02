import fs from 'fs';

async function registerAndAuth() {
  const registerBody = {
    email: "at5316@srmist.edu.in",
    name: "Arpita tiwary",
    mobileNo: "7488859052",
    githubUsername: "Arpita-Tiwary",
    rollNo: "RA2311026010023",
    accessCode: "QkbpxH"
  };

  try {
    console.log("Registering...");
    const regRes = await fetch("http://20.207.122.201/evaluation-service/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(registerBody)
    });
    const regData = await regRes.json();
    console.log("Registration Response:", regData);

    if (!regData.clientID) {
      console.error("Failed to get clientID. Maybe already registered?");
    }

    const authBody = {
      ...registerBody,
      clientID: regData.clientID || "PASTE_CLIENT_ID_HERE_IF_ALREADY_REGISTERED",
      clientSecret: regData.clientSecret || "PASTE_CLIENT_SECRET_HERE_IF_ALREADY_REGISTERED"
    };

    console.log("\nAuthenticating...");
    const authRes = await fetch("http://20.207.122.201/evaluation-service/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(authBody)
    });
    const authData = await authRes.json();
    console.log("Auth Response:", authData);

    fs.writeFileSync('.env', `AUTH_TOKEN=${authData.access_token || authData.token || "YOUR_TOKEN_HERE"}\n`, { flag: 'a' });
    console.log("Token saved to .env (verify the token key in response)");

  } catch (e) {
    console.error("Error:", e);
  }
}

registerAndAuth();
