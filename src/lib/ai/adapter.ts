export interface AIProviderConfig {
  apiKey: string;
  baseURL?: string;
  model: string;
}

export async function callAI(
  prompt: string,
  systemInstruction: string,
  config: AIProviderConfig
): Promise<string> {
  const url = config.baseURL || "https://api.openai.com/v1/chat/completions";
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 45000); // 45s timeout

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${config.apiKey}`,
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: config.model,
        response_format: { type: "json_object" }, // Ensures JSON output if supported
        messages: [
          { role: "system", content: systemInstruction },
          { role: "user", content: prompt }
        ],
        temperature: 0.2,
      }),
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error("Rate limit excedido (429).");
      }
      throw new Error(`Erro no provedor de IA: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error: unknown) {
    clearTimeout(timeoutId);
    if ((error as Error).name === "AbortError") {
      throw new Error("Timeout: A IA demorou muito para responder.");
    }
    throw error as Error;
  }
}

