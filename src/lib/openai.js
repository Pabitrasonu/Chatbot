const BASE_URL =
  import.meta.env.VITE_OPENAI_BASE_URL?.replace(/\/$/, "") ||
  "https://api.openai.com";
const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

if (!API_KEY) {
  console.warn("[openai] Missing VITE_OPENAI_API_KEY. Set it in .env");
}

/**
 * sendChat(messages): calls OpenAI Responses API with a chat transcript array
 * messages: [{ role: 'system'|'user'|'assistant', content: string }]
 */
export async function sendChat(
  messages,
  { model = "gpt-4o-mini", temperature = 0.7, max_output_tokens = 512 } = {}
) {
  const res = await fetch(`${BASE_URL}/v1/responses`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model,
      input: messages,
      temperature,
      max_output_tokens,
    }),
  });

  if (!res.ok) {
    const err = await res.text().catch(() => "");
    throw new Error(`OpenAI error ${res.status}: ${err}`);
  }

  const data = await res.json();
  // Responses API returns output in various shapes; normalize to a string
  const text =
    data?.output?.[0]?.content?.[0]?.text ??
    data?.output_text ??
    JSON.stringify(data);

  return text;
}
