"use client";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 text-white p-4">
      <h2 className="text-2xl font-bold text-red-500 mb-4">Algo deu errado!</h2>
      <p className="text-zinc-400 mb-8">{error.message || "Erro desconhecido."}</p>
      <button
        onClick={() => reset()}
        className="px-6 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
      >
        Tentar novamente
      </button>
    </div>
  );
}
