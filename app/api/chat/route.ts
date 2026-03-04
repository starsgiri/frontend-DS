import { NextRequest, NextResponse } from "next/server";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

/* ── System prompts per disability mode ── */
const SYSTEM_PROMPTS: Record<string, string> = {
  blind: `You are AccessiCare's voice assistant for visually impaired users.
You help them navigate medical records, read prescriptions aloud, manage appointments, and understand health data.
Be concise, warm, and speak naturally — your responses will be read aloud via text-to-speech.
Keep paragraphs short (2-3 sentences max). Avoid visual references, markdown, bullet symbols, or special characters.
You can: read medical records & prescriptions, explain diagnoses simply, manage appointments, navigate the platform, answer health questions.`,

  deaf: `You are AccessiCare's text assistant for deaf users.
Respond with clear, structured written text using short paragraphs.
Use numbered lists for steps. Avoid references to audio or sounds.
Help with medical records, prescriptions, appointments, and health data.
Prioritise visual clarity — use simple language and logical structure.`,

  mute: `You are AccessiCare's text assistant for mute users who can type but cannot speak.
Help them prepare for doctor visits, share medical history, create symptom descriptions, and navigate the platform.
Provide concise, copy-paste-friendly responses they can show to healthcare providers.
Include pre-built phrases they can use during consultations.`,

  physical: `You are AccessiCare's assistant for physically challenged users.
Help them navigate the platform with minimal interaction, track mobility scores, manage medications, and access emergency contacts.
Keep responses short and actionable. Suggest keyboard shortcuts and simplified navigation paths.`,
};

export async function POST(req: NextRequest) {
  if (!OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "OpenAI API key not configured. Add OPENAI_API_KEY to .env.local" },
      { status: 500 },
    );
  }

  try {
    const { messages, disabilityKey } = await req.json();
    const systemPrompt = SYSTEM_PROMPTS[disabilityKey] || SYSTEM_PROMPTS.blind;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        max_tokens: 600,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: err.error?.message || `OpenAI error (${response.status})` },
        { status: response.status },
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content ?? "Sorry, I couldn't generate a response.";
    return NextResponse.json({ message: content });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
