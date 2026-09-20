import { callAI, AIProviderConfig } from "./adapter";
import { SYSTEM_PROMPT } from "./prompt";
import { PageSpecSchema, PageSpec } from "@/page-spec/schema";

export async function generatePageSpec(
  userIntent: string, 
  config: AIProviderConfig
): Promise<PageSpec> {
  let attempts = 0;
  const maxAttempts = 2;

  while (attempts < maxAttempts) {
    try {
      const rawJsonString = await callAI(userIntent, SYSTEM_PROMPT, config);
      
      // Limpeza de marcações markdown (ex: ```json ... ```) se houver
      const cleanedString = rawJsonString.replace(/^```json\s*/, '').replace(/\s*```$/, '').trim();
      
      const parsedData = JSON.parse(cleanedString);
      
      // Validação estrita contra alucinação
      const validatedSpec = PageSpecSchema.parse(parsedData);
      
      return validatedSpec;
    } catch (error: unknown) {
      attempts++;
      console.error(`Tentativa ${attempts} falhou:`, (error as Error).message);
      
      if (attempts >= maxAttempts) {
        throw new Error(`Falha ao gerar página após ${maxAttempts} tentativas. Último erro: ${(error as Error).message}`);
      }
    }
  }
  
  throw new Error("Erro desconhecido na engine de IA.");
}

