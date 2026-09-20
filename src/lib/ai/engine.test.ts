import { describe, it, expect, vi } from "vitest";
import { generatePageSpec } from "./engine";

const mockConfig = { apiKey: "test", model: "test" };

describe("AI Engine", () => {
  it("Deve parsear com sucesso um JSON válido vindo da IA", async () => {
    const validResponse = {
      choices: [{
        message: {
          content: JSON.stringify({
            schemaVersion: 1,
            page: {
              id: "123e4567-e89b-12d3-a456-426614174000",
              title: "Test",
              slug: "test",
              language: "pt-BR",
              theme: {
                primaryColor: "#ff0000",
                secondaryColor: "#000000",
                fontFamily: "Inter",
                borderRadius: "md"
              },
              sections: []
            }
          })
        }
      }]
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => validResponse
    });

    const spec = await generatePageSpec("Crie uma página de teste", mockConfig);
    expect(spec.schemaVersion).toBe(1);
    expect(spec.page.title).toBe("Test");
  });

  it("Deve tentar novamente se o JSON for inválido/fugir do Zod", async () => {
    // 1st time returns bad json, 2nd time returns good json
    let calls = 0;
    global.fetch = vi.fn().mockImplementation(async () => {
      calls++;
      if (calls === 1) {
        return {
          ok: true,
          json: async () => ({ choices: [{ message: { content: "{ bad_json: true }" } }] })
        };
      }
      return {
        ok: true,
        json: async () => ({
          choices: [{
            message: {
              content: JSON.stringify({
                schemaVersion: 1,
                page: {
                  id: "123e4567-e89b-12d3-a456-426614174000",
                  title: "Recovery",
                  slug: "recovery",
                  language: "pt-BR",
                  theme: { primaryColor: "#000000", secondaryColor: "#ffffff", fontFamily: "Inter", borderRadius: "0px" },
                  sections: []
                }
              })
            }
          }]
        })
      };
    });

    const spec = await generatePageSpec("Recupera aí", mockConfig);
    expect(calls).toBe(2);
    expect(spec.page.title).toBe("Recovery");
  });
});
