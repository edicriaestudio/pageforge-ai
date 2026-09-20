"use client";

import { useEffect, useState } from "react";
import { Renderer } from "@/components/renderer/Renderer";
import { PageSpec, PageSpecSchema } from "@/page-spec/schema";

const fallbackSpec: PageSpec = {
  schemaVersion: 1,
  page: {
    id: "mock-uuid-1234",
    title: "Cinematic Test Page",
    slug: "cinematic-test",
    language: "pt-BR",
    theme: {
      primaryColor: "#10b981", // Emerald 500
      secondaryColor: "#000000",
      fontFamily: "Inter, sans-serif",
      borderRadius: "24px",
    },
    sections: [
      {
        id: "nav-1",
        type: "navbar",
        visible: true,
        props: {
          logoText: "PAGEFORGE.",
          links: [
            { label: "Manifesto", url: "#" },
            { label: "Tecnologia", url: "#" },
            { label: "Preços", url: "#" }
          ],
          ctaText: "COMEÇAR AGORA"
        }
      },
      {
        id: "hero-1",
        type: "hero",
        visible: true,
        props: {
          headlinePrefix: "THE FUTURE OF",
          headlineMain: "Digital Art.",
          subheadline: "Automação brutalista desenhada para conversão massiva em nichos high-ticket.",
          ctaText: "INICIAR PROTOCOLO",
        },
      },
      {
        id: "phil-1",
        type: "philosophy",
        visible: true,
        props: {
          commonFocus: "Templates genéricos, código inchado e design amador.",
          ourDifferential: "Experiências viscerais construídas com precisão algorítmica."
        }
      },
      {
        id: "features-1",
        type: "features",
        visible: true,
        props: {
          sectionTitle: "Artefatos Funcionais",
          items: [
            { id: "f1", title: "Diagnostic Shuffler", description: "Análise profunda de métricas com resposta em tempo real.", type: "diagnostic" },
            { id: "f2", title: "Telemetry Typewriter", description: "Feed de dados contínuo sincronizado via WebSockets.", type: "telemetry" },
            { id: "f3", title: "Protocol Scheduler", description: "Agendamento avançado com heurística preditiva.", type: "scheduler" },
          ],
        },
      },
      {
        id: "proto-1",
        type: "protocol",
        visible: true,
        props: {
          sectionTitle: "Protocolo de Empilhamento",
          steps: [
            { id: "p1", number: "01", title: "Injeção de Blueprint", description: "A IA escaneia seu nicho e gera um arquivo JSON estruturado contendo a planta baixa da sua comunicação." },
            { id: "p2", number: "02", title: "Renderização Cinematográfica", description: "O motor transforma os dados crus em animações fluidas 60fps usando algoritmos limpos." },
            { id: "p3", number: "03", title: "Deploy em Edge", description: "Disponibilizamos o artefato na nossa rede edge global com TTFB (Time to First Byte) inferior a 50ms." }
          ]
        }
      },
      {
        id: "mem-1",
        type: "membership",
        visible: true,
        props: {
          sectionTitle: "Acesso ao Sistema",
          tiers: [
            { id: "t1", name: "Essencial", price: "R$497", period: "/mês", features: ["1 Projeto ativo", "Design System Base", "Suporte Padrão"], isPopular: false, ctaText: "ASSINAR ESSENCIAL" },
            { id: "t2", name: "Performance", price: "R$997", period: "/mês", features: ["Projetos Ilimitados", "Renderização Cinematográfica", "IA Desbloqueada", "Suporte Prioritário"], isPopular: true, ctaText: "ACESSAR PERFORMANCE" },
            { id: "t3", name: "Enterprise", price: "R$2.5k", period: "/mês", features: ["White Label", "API Dedicada", "Setup Híbrido"], isPopular: false, ctaText: "FALAR COM VENDAS" }
          ]
        }
      },
      {
        id: "foot-1",
        type: "footer",
        visible: true,
        props: {
          copyrightText: "© 2026 PAGEFORGE INC.",
          links: [
            { label: "Termos", url: "#" },
            { label: "Privacidade", url: "#" }
          ]
        }
      }
    ]
  }
};

export default function PreviewPage() {
  const [spec, setSpec] = useState<PageSpec>(fallbackSpec);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === "UPDATE_SPEC") {
        try {
          const validSpec = PageSpecSchema.parse(event.data.payload);
          setSpec(validSpec);
        } catch (e) {
          console.error("Payload recebido no preview não obedece ao PageSpec v1", e);
        }
      }
    };

    window.addEventListener("message", handleMessage);
    
    if (window.parent !== window) {
      window.parent.postMessage({ type: "PREVIEW_READY" }, "*");
    }

    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return <Renderer spec={spec} />;
}
