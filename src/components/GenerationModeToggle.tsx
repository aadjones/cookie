import React from 'react';
import { MessageGenerationMode } from '../utils/types';

interface GenerationModeToggleProps {
  mode: MessageGenerationMode;
  onChange: (mode: MessageGenerationMode) => void;
  disabled?: boolean;
}

export default function GenerationModeToggle({ mode, onChange, disabled = false }: GenerationModeToggleProps) {
  return (
    <div className="flex items-center space-x-2" data-testid="generation-mode-toggle">
      <span
        className={`text-sm ${mode === MessageGenerationMode.PRE_WRITTEN ? 'font-bold text-white bg-indigo-600 px-2 py-0.5 rounded' : 'text-gray-800'}`}
      >
        Classic
      </span>
      <button
        disabled={disabled}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
          mode === MessageGenerationMode.AI_GENERATED
            ? 'bg-indigo-600 focus:ring-indigo-500'
            : 'bg-gray-400 focus:ring-gray-400'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        onClick={() =>
          onChange(
            mode === MessageGenerationMode.PRE_WRITTEN
              ? MessageGenerationMode.AI_GENERATED
              : MessageGenerationMode.PRE_WRITTEN
          )
        }
        aria-label={`Switch to ${mode === MessageGenerationMode.PRE_WRITTEN ? 'AI-generated' : 'pre-written'} fortunes`}
        data-testid="generation-mode-switch"
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
            mode === MessageGenerationMode.AI_GENERATED ? 'translate-x-5' : 'translate-x-0.5'
          }`}
        />
      </button>
      <span
        className={`text-sm ${mode === MessageGenerationMode.AI_GENERATED ? 'font-bold text-white bg-indigo-600 px-2 py-0.5 rounded' : 'text-gray-800'}`}
      >
        AI-Generated
      </span>
      {disabled && (
        <span className="text-xs text-gray-700 ml-2" data-testid="toggle-disabled-message">
          (Loading...)
        </span>
      )}
    </div>
  );
}
