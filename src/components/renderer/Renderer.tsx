"use client";

import { PageSpec } from "@/page-spec/schema";
import { ComponentRegistry } from "./ComponentRegistry";

export function Renderer({ spec }: { spec: PageSpec }) {
  const { page } = spec;

  // Apply theme to the wrapper
  const themeStyles = {
    "--primary-color": page.theme.primaryColor,
    "--secondary-color": page.theme.secondaryColor,
    fontFamily: page.theme.fontFamily,
    borderRadius: page.theme.borderRadius,
  } as React.CSSProperties;

  return (
    <div style={themeStyles} className="bg-zinc-950 text-white min-h-screen overflow-x-hidden selection:bg-emerald-500/30">
      {/* Noise Overlay Global (Regra Estrita do Preset) */}
      <div 
        className="pointer-events-none fixed inset-0 z-50 h-full w-full opacity-[0.04]"
        style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')" }}
      />
      
      {page.sections.filter(s => s.visible).map((section) => {
        const Component = ComponentRegistry[section.type];
        if (!Component) return <div key={section.id} className="p-8 text-red-500">Component {section.type} not found</div>;
        
        return <Component key={section.id} {...section.props} />;
      })}
    </div>
  );
}
