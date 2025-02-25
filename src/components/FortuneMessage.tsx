// src/components/FortuneMessage.tsx
import React from "react";

interface FortuneMessageProps {
  message: string;
}

export default function FortuneMessage({ message }: FortuneMessageProps) {
  return (
    <div className="p-4 bg-white shadow rounded text-center max-w-sm">
      <p className="text-lg font-medium">{message}</p>
    </div>
  );
}
