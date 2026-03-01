import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const type = formData.get('type') as 'audio' | 'image' | 'text';
        const content = formData.get('content');

        if (!type || !content) {
            return NextResponse.json({ error: 'Missing type or content' }, { status: 400 });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        let systemPrompt = `You are OVERWATCH, an elite AI scam detection system. Analyze the provided content and return ONLY a valid JSON object with no markdown, no code blocks, no extra text. Just the raw JSON.

JSON schema:
{
  "authenticityScore": number, // 0-100. 100=definitely human/legit, 0=AI-generated/scam
  "threatLevel": "HIGH" | "MEDIUM" | "LOW",
  "manipulationTactics": string[], // e.g. ["Urgency", "Fear induction", "Authority spoofing"]
  "aiGenerated": number, // 0-10 risk score
  "manipulationLanguage": number, // 0-10 risk score  
  "sourceCredibility": number, // 0-10 (10=credible, 0=not credible)
  "verdict": string, // One plain-English sentence verdict
  "fullAnalysis": string // 3-4 sentence detailed analysis
}`;

        if (type === 'audio') {
            systemPrompt += `\n\nAUDIO-SPECIFIC addition: This is an audio file. Analyze for: AI voice synthesis artifacts (unnatural cadence, looped background noise, breath pattern irregularities, robotic formants), classic scam scripts (fake arrest, grandparent emergency, fake kidnapping, bank fraud), and psychological manipulation in the spoken language.`;
        } else if (type === 'image') {
            systemPrompt += `\n\nIMAGE-SPECIFIC addition: This is a screenshot. Analyze for: phishing indicators in any visible URLs (misspelled domains, suspicious TLDs), spoofed sender names or logos, urgency/threat language, requests for personal information, gift card or wire transfer requests, and social engineering patterns.`;
        } else if (type === 'text') {
            systemPrompt += `\n\nTEXT-SPECIFIC addition: This is text or a URL. Analyze for: phishing URL patterns, social engineering language, impersonation of banks/government/family, urgency tactics, requests for money via untraceable methods (gift cards, crypto, wire transfer), and known scam script patterns.`;
        }

        let parts: any[] = [{ text: systemPrompt }];

        if (type === 'text') {
            parts.push({ text: `Content to scan:\n${content as string}` });
        } else {
            const file = content as File;
            const arrayBuffer = await file.arrayBuffer();
            const base64Data = Buffer.from(arrayBuffer).toString('base64');

            parts.push({
                inlineData: {
                    data: base64Data,
                    mimeType: file.type,
                }
            });
        }

        const result = await model.generateContent(parts);
        const responseText = result.response.text();

        const cleanJson = responseText.replace(/```(?:json)?\s*/i, '').replace(/```\s*$/, '').trim();
        const parsedData = JSON.parse(cleanJson);

        return NextResponse.json(parsedData);

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({
            authenticityScore: 50,
            threatLevel: 'MEDIUM',
            manipulationTactics: ['Analysis incomplete'],
            aiGenerated: 5,
            manipulationLanguage: 5,
            sourceCredibility: 5,
            verdict: 'Unable to complete full analysis. Exercise caution.',
            fullAnalysis: 'The scan encountered an issue processing this file. When in doubt, do not comply with any requests in this content.'
        });
    }
}
