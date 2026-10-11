import "server-only";
import { getContent } from "@/content";

/**
 * "Ma photo, ma question": Zahra sends a photo (a quiz screenshot, a sign,
 * a junction) plus her own guess, and Claude answers in calm French,
 * pointing her back to the lessons that cover it.
 *
 * TODO: verify the rule summary below against loi 52-05.
 */

export type PhotoVerdict = "juste" | "presque" | "pas-juste" | "sans-idee";

export type PhotoAnswer = {
  verdict: PhotoVerdict;
  answer: string;
  why: string;
  lessonIds: string[];
};

/** Claude if its key is set, otherwise Gemini (free tier works fine for a few photos a day). */
export function isPhotoAskConfigured(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY || process.env.GEMINI_API_KEY);
}

function systemPrompt(): string {
  const c = getContent();
  const lessons = [...c.lessons.values()].map((l) => `- ${l.id} : ${l.title}`).join("\n");
  const rules = c.rules.map((r) => `- ${r.title}`).join("\n");

  return `Tu es le tuteur de Bchwiya, une application calme qui aide Zahra à réussir l'examen théorique du permis B au Maroc (NARSA, code de la route marocain, loi 52-05).

Zahra t'envoie une photo : souvent une capture d'un quiz (Instagram, Perminou), parfois un panneau ou un carrefour qu'elle a vu en scooter. Elle écrit aussi ce qu'elle pense, avant de connaître la réponse.

Règles marocaines à garder en tête :
- On roule à droite. Sans signalisation, la priorité à droite s'applique.
- Giratoire AVEC panneau « cédez le passage » à l'entrée : ceux qui sont déjà dans l'anneau ont la priorité.
- Giratoire SANS ce panneau : priorité à droite, donc ceux qui entrent ont la priorité.
- STOP : arrêt complet obligatoire, puis on cède le passage.
- Les questions d'examen peuvent avoir plusieurs bonnes réponses.

Ce que l'application lui apprend (les règles suivies) :
${rules}

Les leçons de l'application (id : titre) :
${lessons}

Comment répondre :
- En français simple, phrases courtes, ton doux et neutre. Jamais de reproche, jamais de « faux ! ».
- Commence par la réponse, puis explique le pourquoi en 2 à 4 phrases, en t'appuyant sur ce qu'on voit sur la photo (panneaux, position des voitures).
- Compare avec son idée : dis ce qui était juste dans son raisonnement.
- Si la photo est floue ou ne concerne pas la route, dis-le gentiment.
- Si tu n'es pas sûr d'une règle marocaine précise, dis-le plutôt que d'inventer.
- Choisis 1 à 3 leçons de la liste qui couvrent le sujet (ids exacts uniquement).

Réponds UNIQUEMENT avec un objet JSON, sans texte autour :
{"verdict": "juste" | "presque" | "pas-juste" | "sans-idee", "answer": "la réponse en une ou deux phrases", "why": "l'explication", "lessonIds": ["..."]}
"verdict" juge son idée : "sans-idee" si elle n'a rien proposé.`;
}

const VERDICTS: PhotoVerdict[] = ["juste", "presque", "pas-juste", "sans-idee"];

function parse(text: string): PhotoAnswer {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  const lessons = getContent().lessons;
  try {
    const raw = JSON.parse(text.slice(start, end + 1)) as Partial<
      Record<keyof PhotoAnswer, unknown>
    >;
    const verdict = VERDICTS.includes(raw.verdict as PhotoVerdict)
      ? (raw.verdict as PhotoVerdict)
      : "sans-idee";
    const lessonIds = Array.isArray(raw.lessonIds)
      ? raw.lessonIds
          .filter((id): id is string => typeof id === "string" && lessons.has(id))
          .slice(0, 3)
      : [];
    return {
      verdict,
      answer: String(raw.answer ?? "").trim(),
      why: String(raw.why ?? "").trim(),
      lessonIds,
    };
  } catch {
    // Not JSON after all: show the text as it came.
    return { verdict: "sans-idee", answer: text.trim(), why: "", lessonIds: [] };
  }
}

export async function askAboutPhoto(input: {
  imageBase64: string;
  mediaType: "image/jpeg" | "image/png" | "image/webp";
  question: string;
  guess: string;
}): Promise<PhotoAnswer> {
  const userText = [
    input.question
      ? `Ma question : ${input.question}`
      : "Ma question : quelle est la bonne réponse ?",
    input.guess ? `Ce que je pense : ${input.guess}` : "Je n'ai pas d'idée.",
  ].join("\n");

  if (process.env.ANTHROPIC_API_KEY) return parse(await viaClaude(input, userText));
  if (process.env.GEMINI_API_KEY) return parse(await viaGemini(input, userText));
  throw new Error("No ANTHROPIC_API_KEY or GEMINI_API_KEY");
}

type Img = { imageBase64: string; mediaType: string };

async function viaClaude(input: Img, userText: string): Promise<string> {
  const res = await fetch(
    `${process.env.ANTHROPIC_BASE_URL || "https://api.anthropic.com"}/v1/messages`,
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY!,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: process.env.ANTHROPIC_MODEL || "claude-sonnet-5-5",
        max_tokens: 900,
        system: systemPrompt(),
        messages: [
          {
            role: "user",
            content: [
              {
                type: "image",
                source: { type: "base64", media_type: input.mediaType, data: input.imageBase64 },
              },
              { type: "text", text: userText },
            ],
          },
        ],
      }),
    },
  );
  if (!res.ok) throw new Error(`Anthropic ${res.status}: ${(await res.text()).slice(0, 300)}`);
  const data = (await res.json()) as { content?: { type: string; text?: string }[] };
  return (data.content ?? [])
    .filter((b) => b.type === "text")
    .map((b) => b.text ?? "")
    .join("");
}

async function viaGemini(input: Img, userText: string): Promise<string> {
  const model = process.env.GEMINI_MODEL || "gemini-flash-latest";
  const base = process.env.GEMINI_BASE_URL || "https://generativelanguage.googleapis.com";
  const res = await fetch(`${base}/v1beta/models/${model}:generateContent`, {
    method: "POST",
    headers: { "content-type": "application/json", "x-goog-api-key": process.env.GEMINI_API_KEY! },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: systemPrompt() }] },
      contents: [
        {
          role: "user",
          parts: [
            { inlineData: { mimeType: input.mediaType, data: input.imageBase64 } },
            { text: userText },
          ],
        },
      ],
      generationConfig: { responseMimeType: "application/json", maxOutputTokens: 2048 },
    }),
  });
  if (!res.ok) throw new Error(`Gemini ${res.status}: ${(await res.text()).slice(0, 300)}`);
  const data = (await res.json()) as {
    candidates?: { content?: { parts?: { text?: string }[] } }[];
  };
  return (data.candidates?.[0]?.content?.parts ?? []).map((p) => p.text ?? "").join("");
}
