import React from 'react';
import { MessageGenerationMode } from '../utils/types';

interface GenerationModeToggleProps {
  mode: MessageGenerationMode;
  onChange: (mode: MessageGenerationMode) => void;
  disabled?: boolean;
  showLabel?: boolean;
}

export default function GenerationModeToggle({
  mode,
  onChange,
  disabled = false,
  showLabel = false,
}: GenerationModeToggleProps) {
  return (
    <div className="flex flex-col" data-testid="generation-mode-toggle">
      {showLabel && <label className="text-sm font-semibold text-gray-700 mb-2">Messages</label>}
      <div className="flex items-center justify-between w-full">
        <span
          className={`text-sm transition-all duration-200 ${
            mode === MessageGenerationMode.PRE_WRITTEN ? 'font-medium text-indigo-600' : 'text-gray-500'
          }`}
        >
          Classic
        </span>
        <button
          disabled={disabled}
          className={`relative mx-3 inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 ${
            mode === MessageGenerationMode.AI_GENERATED
              ? 'bg-indigo-600 focus:ring-indigo-500'
              : 'bg-gray-300 focus:ring-gray-400'
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
            className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-200 ease-in-out ${
              mode === MessageGenerationMode.AI_GENERATED ? 'translate-x-5' : 'translate-x-0.5'
            }`}
          />
        </button>
        <span
          className={`text-sm transition-all duration-200 ${
            mode === MessageGenerationMode.AI_GENERATED ? 'font-medium text-indigo-600' : 'text-gray-500'
          }`}
        >
          AI-Generated
        </span>
      </div>
      {disabled && (
        <div className="mt-1 flex items-center justify-center">
          <span className="text-xs text-gray-500 flex items-center" data-testid="toggle-disabled-message">
            <svg
              className="animate-spin -ml-1 mr-2 h-3 w-3 text-indigo-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Loading...
          </span>
        </div>
      )}
    </div>
  );
}
