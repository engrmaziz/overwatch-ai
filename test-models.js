const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const dotenv = require('dotenv');
const envConfig = dotenv.parse(fs.readFileSync('.env.local'))
for (const k in envConfig) { process.env[k] = envConfig[k] }

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function run() {
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models?key=' + process.env.GEMINI_API_KEY);
    const data = await response.json();
    console.log(JSON.stringify(data.models.map(m => m.name), null, 2));
}

run();
