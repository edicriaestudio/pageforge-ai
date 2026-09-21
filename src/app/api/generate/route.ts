import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { z } from 'zod';

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const { prompt, base64Image } = await req.json();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const messages: any[] = [];

    if (base64Image) {
      // Quando temos uma imagem (Visão)
      messages.push({
        role: 'user',
        content: [
          { type: 'text', text: prompt || "Extraia a copy, a estrutura e a intenção de design desta imagem e crie uma landing page seguindo estritamente o esquema JSON." },
          { type: 'image', image: base64Image }
        ]
      });
    } else {
      // Quando é apenas texto
      messages.push({
        role: 'user',
        content: prompt
      });
    }

    const { object } = await generateObject({
      model: google('gemini-2.5-flash'),
      system: `Você é o PageForge AI, um Diretor de Arte Sênior e Copywriter Mestre. 
      Sua missão é gerar Landing Pages cinematográficas e de altíssima conversão.
      Gere EXATAMENTE um objeto JSON seguindo o schema. 
      Use copy real, agressiva (se necessário), focada em luxo, escassez ou autoridade, dependendo do nicho.
      NUNCA use "Lorem Ipsum" ou "Insira texto aqui". Crie o texto definitivo.
      Para a 'image' do hero, retorne uma URL do Unsplash relacionada ao tema (ex: https://images.unsplash.com/photo-XXX?auto=format&fit=crop&q=80).`,
      schema: z.object({
        name: z.string().describe("O nome do projeto ou empresa"),
        preset: z.enum(["Organic Research", "Deep Space Tech", "Modern Editorial"]).describe("O estilo visual que melhor combina com o nicho"),
        hero: z.object({
          headline: z.string().describe("Título principal com promessa forte, máximo 6 palavras"),
          subheadline: z.string().describe("Subtítulo que explica o benefício principal"),
          cta: z.string().describe("Texto do botão, ex: Quero Começar"),
          image: z.string().describe("URL do Unsplash em alta resolução")
        }),
        features: z.array(z.object({
          title: z.string(),
          description: z.string()
        })).length(3).describe("Exatamente 3 features/benefícios principais"),
        philosophy: z.object({
          statement1: z.string().describe("Frase de contraste parte 1, ex: A maioria das agências foca em:"),
          statement2: z.string().describe("O que os concorrentes fazem de ruim"),
          statement3: z.string().describe("Frase de contraste parte 2, ex: Nós focamos em:"),
          statement4: z.string().describe("O seu diferencial absoluto")
        }),
        protocol: z.array(z.object({
          title: z.string().describe("Passo do método, ex: 1. Diagnóstico"),
          description: z.string()
        })).length(3).describe("Exatamente 3 passos de como o serviço funciona"),
        membership: z.object({
          tier1_name: z.string(),
          tier1_price: z.string(),
          tier1_benefits: z.array(z.string()).length(3),
          tier2_name: z.string(),
          tier2_price: z.string(),
          tier2_benefits: z.array(z.string()).length(3),
          tier3_name: z.string(),
          tier3_price: z.string(),
          tier3_benefits: z.array(z.string()).length(3)
        }).describe("Os 3 planos ou ofertas do serviço (Básico, Intermediário/Recomendado, Avançado)"),
        footer: z.object({
          text: z.string()
        })
      }),
      messages,
    });

    return Response.json(object);
  } catch (error: unknown) {
    console.error("AI Generation Error:", error);
    return Response.json({ error: (error as Error).message || "Falha na geração" }, { status: 500 });
  }
}



