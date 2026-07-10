const GROQ_API_KEY = process.env.GROQ_API_KEY;

export async function analyzeContractText(contractText: string, pagesHint?: number) {
  const truncated = contractText.slice(0, 120000);

  const prompt = `You are a legal risk analyst. Analyze this contract and return ONLY a raw JSON object. No markdown, no backticks, no explanation. Start with { and end with }.

{
  "riskScore": <number 0-100>,
  "riskLevel": "low" or "medium" or "high",
  "pagesScanned": <number>,
  "clausesFlagged": <number>,
  "hiddenPenalties": <count only clauses with money/fees/penalties/damages>,
  "summary": "<3 sentence plain English summary>",
  "eli18Summary": "<explain like person is 18, casual, 3-4 sentences>",
  "clauses": [
    {
      "name": "<clause name>",
      "riskLevel": "low" or "medium" or "high",
      "explanation": "<plain English explanation>",
      "eli18Explanation": "<casual explanation for 18 year old>",
      "originalQuote": "<exact short quote max 30 words>"
    }
  ],
  "negotiationTips": ["<tip 1>", "<tip 2>", "<tip 3>"]
}

CONTRACT TEXT:
${truncated}

CRITICAL: Return ONLY the JSON object. Start with { and end with }. Nothing else.`;

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${GROQ_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: "You are a legal risk analyst. Always respond with ONLY a valid JSON object. No markdown, no backticks, no explanation. Start with { and end with }."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0,
      max_tokens: 6000
    })
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Groq request failed (${response.status}): ${err}`);
  }

  const data = await response.json();
  const raw = data?.choices?.[0]?.message?.content ?? "";

  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");

  if (start === -1 || end === -1) {
    throw new Error("Invalid response from AI model");
  }

  const parsed = JSON.parse(raw.slice(start, end + 1));

  if (parsed.riskScore === undefined || !parsed.clauses) {
    throw new Error("Invalid response from AI model");
  }

  parsed.clausesFlagged = parsed.clauses?.length ?? 0;
  parsed.hiddenPenalties = parsed.clauses?.filter((c: { riskLevel?: string; name?: string }) =>
    c.riskLevel === "high" &&
    (c.name ?? "").toLowerCase().match(/payment|penalty|fee|damages|liability|termination/)
  ).length ?? 0;

  if (pagesHint) parsed.pagesScanned = pagesHint;

  return parsed;
}
