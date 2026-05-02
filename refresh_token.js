import fs from 'fs';

async function refreshToken() {
  const authBody = {
    email: "at5316@srmist.edu.in",
    name: "Arpita tiwary",
    rollNo: "RA2311026010023",
    accessCode: "QkbpxH",
    clientID: "3c8c365d-99de-4c92-8e4a-c15d403a22bd",
    clientSecret: "wJaBhTaPqyYqdDwh"
  };

  try {
    console.log("Authenticating to get a new 15-minute token...");
    const authRes = await fetch("http://20.207.122.201/evaluation-service/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(authBody)
    });
    
    const authData = await authRes.json();
    
    if (authData.access_token) {
        const tokenStr = `VITE_AUTH_TOKEN=${authData.access_token}\n`;
        fs.writeFileSync('Question2/.env', tokenStr, 'utf8');
        fs.writeFileSync('.env', `AUTH_TOKEN=${authData.access_token}\n`, 'utf8');
        console.log("Successfully generated a new token and updated all .env files!");
    } else {
        console.log("Failed to get token:", authData);
    }
  } catch (e) {
    console.error("Error fetching token:", e);
  }
}

refreshToken();
