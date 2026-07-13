import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import type { ClauseItem } from "@/types/analysis";
import { checkRateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const maxDuration = 120;

const GROQ_API_KEY = process.env.GROQ_API_KEY;

export type NegotiateFormData = {
  name: string;
  company: string;
  email: string;
  recipientName: string;
  recipientCompany: string;
  contractRef: string;
  contractType: string;
};

function buildUserPrompt(
  formData: NegotiateFormData,
  selectedClauses: ClauseItem[]
): string {
  const clauseLines = selectedClauses
    .map((c, i) => `${i + 1}. ${c.name}: ${c.explanation}`)
    .join("\n");

  return `You are a professional legal letter writer. Write a formal Without Prejudice negotiation letter.

Use EXACTLY this format with these exact markers:

SUBJECT: [subject line here]

OPENING: [opening paragraph here]

CLAUSE_1_TITLE: [first clause title]
CLAUSE_1_BODY: [first clause negotiation text]

CLAUSE_2_TITLE: [second clause title]
CLAUSE_2_BODY: [second clause negotiation text]

(continue for all clauses)

CLOSING: [closing paragraph here]

Sender: ${formData.name}, ${formData.company}
Recipient: ${formData.recipientName}, ${formData.recipientCompany}
Contract type: ${formData.contractType}
Contract reference: ${formData.contractRef}

Clauses to negotiate:
${clauseLines}

Write in formal British legal English. Propose specific reasonable amendments for each clause.`;
}

function parsePlainTextLetter(raw: string) {
  const subject = raw.match(/SUBJECT:\s*(.+)/)?.[1]?.trim() ?? "";
  const opening =
    raw.match(/OPENING:\s*([\s\S]+?)(?=CLAUSE_1_TITLE)/)?.[1]?.trim() ?? "";
  const closing = raw.match(/CLOSING:\s*([\s\S]+?)$/)?.[1]?.trim() ?? "";

  const clauses: { number: number; title: string; body: string }[] = [];
  let i = 1;
  while (true) {
    const title = raw
      .match(new RegExp(`CLAUSE_${i}_TITLE:\\s*(.+)`))?.[1]
      ?.trim();
    const body = raw
      .match(
        new RegExp(
          `CLAUSE_${i}_BODY:\\s*([\\s\\S]+?)(?=CLAUSE_${i + 1}_TITLE|CLOSING)`
        )
      )?.[1]
      ?.trim();
    if (!title) break;
    clauses.push({ number: i, title, body: body ?? "" });
    i++;
  }

  return {
    subject,
    opening,
    clauses,
    closing,
    valediction: "Yours sincerely",
  };
}

export async function POST(request: Request) {
  console.log("=== NEGOTIATE ROUTE CALLED ===");

  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    const ip = request.headers.get("x-forwarded-for") || "unknown";
    if (!checkRateLimit(ip, 5, 60000)) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Try again in a minute." },
        { status: 429 }
      );
    }

    if (!GROQ_API_KEY) {
      return NextResponse.json(
        { error: "GROQ_API_KEY is not configured on the server." },
        { status: 500 }
      );
    }

    const body = (await request.json()) as {
      formData?: NegotiateFormData;
      selectedClauses?: ClauseItem[];
    };

    const { formData, selectedClauses } = body;

    console.log("Form data:", JSON.stringify(formData));
    console.log("Selected clauses count:", selectedClauses?.length);

    if (!formData || !selectedClauses || !Array.isArray(selectedClauses)) {
      return NextResponse.json(
        { error: "Missing formData or selectedClauses." },
        { status: 400 }
      );
    }

    const required: (keyof NegotiateFormData)[] = [
      "name",
      "company",
      "email",
      "recipientName",
      "recipientCompany",
      "contractRef",
      "contractType",
    ];
    for (const key of required) {
      const val = formData[key];
      if (typeof val !== "string" || !val.trim()) {
        return NextResponse.json(
          { error: `Missing or invalid field: ${key}` },
          { status: 400 }
        );
      }
    }

    if (selectedClauses.length === 0) {
      return NextResponse.json(
        { error: "Select at least one clause to include in the letter." },
        { status: 400 }
      );
    }

    const userContent = buildUserPrompt(formData, selectedClauses);

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "system",
              content:
                "You are a professional legal letter writer. Follow the user's format exactly using the specified SUBJECT, OPENING, CLAUSE_N_TITLE, CLAUSE_N_BODY, and CLOSING markers. Do not use JSON or markdown.",
            },
            {
              role: "user",
              content: userContent,
            },
          ],
          temperature: 0,
          max_tokens: 6000,
        }),
      }
    );

    if (!response.ok) {
      const err = await response.text();
      return NextResponse.json(
        {
          error: `Groq request failed (${response.status}): ${err.slice(0, 500)}`,
        },
        { status: 502 }
      );
    }

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string | null } }>;
    };
    const raw = data?.choices?.[0]?.message?.content ?? "";

    console.log("=== RAW AI RESPONSE ===");
    console.log(raw);
    console.log("=== END RAW RESPONSE ===");

    if (!raw.trim()) {
      return NextResponse.json(
        { error: "Invalid response from AI model" },
        { status: 502 }
      );
    }

    const parsed = parsePlainTextLetter(raw);

    if (!parsed.subject || !parsed.opening || parsed.clauses.length === 0) {
      return NextResponse.json(
        { error: "Could not parse letter from AI response." },
        { status: 502 }
      );
    }

    console.log("=== PARSED SUCCESSFULLY ===");

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("=== NEGOTIATE ERROR ===", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
