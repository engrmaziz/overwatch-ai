const fs = require('fs');
const envContent = fs.readFileSync('.env.local', 'utf8');
const apiKeyMatch = envContent.match(/GEMINI_API_KEY=(.*)/);
if (!apiKeyMatch) {
    console.log('No API key found in .env.local');
    process.exit(1);
}
const apiKey = apiKeyMatch[1].trim();

async function run() {
    const url = 'https://generativelanguage.googleapis.com/v1beta/models?key=' + apiKey;
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.error) {
            console.log("API ERROR:", data.error);
            return;
        }
        console.log("VALID MODELS:", data.models.map(m => m.name).filter(n => n.includes("gemini")));
    } catch (err) {
        console.log("FETCH ERROR:", err);
    }
}
run();
