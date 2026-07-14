"use client";

import { useCallback, useRef, useState } from "react";

const MAX_BYTES = 20 * 1024 * 1024;
const ACCEPT =
  ".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document";

type Props = {
  label: string;
  file: File | null;
  onFile: (file: File | null) => void;
  onError: (message: string) => void;
  disabled?: boolean;
  /** Larger centered dropzone used on analyze upload */
  size?: "default" | "hero";
  description?: string;
  secondaryLabel?: string;
};

export function UploadZone({
  label,
  file,
  onFile,
  onError,
  disabled,
  size = "default",
  description,
  secondaryLabel,
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

  const hero = size === "hero";

  return (
    <div className="flex w-full flex-col gap-2">
      {!hero && (
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-medium text-foreground">{label}</p>
          {file && (
            <button
              type="button"
              onClick={() => onFile(null)}
              className="text-xs font-medium text-muted-foreground hover:text-primary"
              disabled={disabled}
            >
              Clear
            </button>
          )}
        </div>
      )}
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
        className={`group relative flex w-full cursor-pointer flex-col items-center justify-center border-2 border-dashed text-center transition-colors ${
          hero
            ? "rounded-3xl px-6 py-14"
            : "rounded-2xl px-6 py-10"
        } ${
          dragOver || file
            ? "border-primary bg-primary/5"
            : "border-border bg-card hover:border-primary hover:bg-primary/5"
        } ${disabled ? "pointer-events-none opacity-60" : ""}`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT}
          className="sr-only"
          disabled={disabled}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) validateAndSet(f);
            e.target.value = "";
          }}
        />
        <span
          className={`flex items-center justify-center text-primary ${
            hero
              ? "size-16 rounded-2xl bg-primary/10"
              : "size-12 rounded-xl bg-secondary text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
          }`}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className={hero ? "size-8" : "size-6"}
            aria-hidden
          >
            <path
              d="M12 13v8M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242M8 17l4-4 4 4"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        {hero ? (
          <>
            <h2 className="mt-5 text-xl font-semibold text-foreground">
              {file ? file.name : label}
            </h2>
            <p className="mt-2 max-w-sm text-pretty leading-relaxed text-muted-foreground">
              {file
                ? `${(file.size / (1024 * 1024)).toFixed(2)} MB · Click to replace`
                : description ||
                  "Drag and drop a PDF here, or browse your files. Your document is analyzed securely and never shared."}
            </p>
            {file && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onFile(null);
                }}
                className="mt-3 text-sm font-semibold text-muted-foreground underline-offset-4 hover:underline"
              >
                Clear file
              </button>
            )}
            <button
              type="button"
              className="mt-6 inline-flex h-11 items-center justify-center rounded-full border border-border bg-background px-5 text-sm font-semibold text-foreground shadow-sm transition-colors hover:bg-secondary"
            >
              Browse files
            </button>
          </>
        ) : (
          <>
            <p className="mt-3 font-medium text-foreground">
              {file ? file.name : label}
            </p>
            <p className="text-sm text-muted-foreground">
              {file
                ? `${(file.size / (1024 * 1024)).toFixed(2)} MB`
                : secondaryLabel || "PDF or DOCX · max 20MB"}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
