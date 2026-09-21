import React from 'react';

export const HtmlBlock: React.FC<{ htmlCode?: string }> = ({ htmlCode }) => {
  if (!htmlCode) {
    return (
      <div className="py-24 text-center border border-dashed border-neutral-700/50 bg-neutral-900/10">
        <p className="text-neutral-500 font-mono text-sm">HTML Block [Vazio]</p>
      </div>
    );
  }

  // Executar scripts internos se existirem (para suportar interações JS no código colado)
  const renderContainerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!renderContainerRef.current) return;
    const scripts = renderContainerRef.current.querySelectorAll('script');
    scripts.forEach(oldScript => {
      const newScript = document.createElement('script');
      if (oldScript.type) newScript.type = oldScript.type;
      if (oldScript.src) newScript.src = oldScript.src;
      newScript.text = oldScript.text;
      oldScript.parentNode?.replaceChild(newScript, oldScript);
    });
  }, [htmlCode]);

  return (
    <div 
      ref={renderContainerRef}
      className="w-full"
      dangerouslySetInnerHTML={{ __html: htmlCode }} 
    />
  );
};
