"use client";

import { useCallback, useRef, useState } from "react";

const MAX_BYTES = 20 * 1024 * 1024;
const ACCEPT = ".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document";

type Props = {
  label: string;
  file: File | null;
  onFile: (file: File | null) => void;
  onError: (message: string) => void;
  disabled?: boolean;
};

export function UploadZone({
  label,
  file,
  onFile,
  onError,
  disabled,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const validateAndSet = useCallback(
    (f: File) => {
      const lower = f.name.toLowerCase();
      const okExt = lower.endsWith(".pdf") || lower.endsWith(".docx");
      if (!okExt) {
        onError("Please upload a PDF or DOCX file.");
        return;
      }
      if (f.size > MAX_BYTES) {
        onError("File is larger than 20MB.");
        return;
      }
      onFile(f);
    },
    [onError, onFile]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      if (disabled) return;
      const f = e.dataTransfer.files?.[0];
      if (f) validateAndSet(f);
    },
    [disabled, validateAndSet]
  );

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-semibold text-navy">{label}</p>
        {file && (
          <button
            type="button"
            onClick={() => onFile(null)}
            className="text-xs font-medium text-slate-500 hover:text-accent"
            disabled={disabled}
          >
            Clear
          </button>
        )}
      </div>
      <div
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragEnter={() => setDragOver(true)}
        onDragLeave={() => setDragOver(false)}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDrop={onDrop}
        onClick={() => !disabled && inputRef.current?.click()}
        className={`group relative flex min-h-[160px] cursor-pointer flex-col items-center justify-center rounded-card border border-dashed px-4 py-8 text-center transition ${
          dragOver
            ? "border-accent bg-accent/5 shadow-card"
            : "border-slate-300 bg-slate-50/60 hover:border-accent/50 hover:bg-white"
        } ${disabled ? "pointer-events-none opacity-60" : ""}`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT}
          className="hidden"
          disabled={disabled}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) validateAndSet(f);
            e.target.value = "";
          }}
        />
        <div className="mb-3 grid h-12 w-12 place-items-center rounded-full bg-white shadow-card ring-1 ring-line">
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            className="text-accent"
            aria-hidden
          >
            <path
              d="M12 16V4m0 0l4 4m-4-4L8 8M4 20h16"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <p className="text-sm font-semibold text-navy">
          {file ? file.name : "Drag & drop your contract"}
        </p>
        <p className="mt-1 max-w-sm text-xs text-slate-500">
          PDF or DOCX · max 20MB
          {file ? (
            <span className="mt-1 block text-slate-400">
              {(file.size / (1024 * 1024)).toFixed(2)} MB
            </span>
          ) : null}
        </p>
        <span className="mt-4 inline-flex items-center rounded-lg bg-accent px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition group-hover:bg-accent/90">
          Browse files
        </span>
      </div>
    </div>
  );
}
