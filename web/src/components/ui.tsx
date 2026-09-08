"use client";

/** UI-примитивы «Стоя» (docs/06-ui-design.md): спокойный минимализм, крупные тап-таргеты */

import React from "react";

export function Card({
  className = "",
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-lg border border-line bg-surface p-4 shadow-card ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function Button({
  variant = "primary",
  className = "",
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "text" | "danger";
}) {
  const styles = {
    primary: "bg-accent text-accentInk hover:opacity-90",
    ghost: "border-[1.5px] border-line text-ink hover:bg-surface2",
    text: "text-accent hover:opacity-80",
    danger: "text-clay hover:bg-clayBg",
  }[variant];
  return (
    <button
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-5 text-[15px] font-semibold transition-all active:scale-[.98] disabled:opacity-50 ${styles} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function Field({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="mb-1.5 block text-sm font-semibold">{label}</label>
      {children}
    </div>
  );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  const { className = "", ...rest } = props;
  return (
    <input
      className={`w-full rounded-md border border-line bg-surface2 px-3.5 py-3 text-base outline-none transition-colors focus:border-accent ${className}`}
      {...rest}
    />
  );
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const { className = "", ...rest } = props;
  return (
    <textarea
      className={`w-full resize-y rounded-md border border-line bg-surface2 px-3.5 py-3 text-base leading-relaxed outline-none transition-colors focus:border-accent ${className}`}
      {...rest}
    />
  );
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  const { className = "", ...rest } = props;
  return (
    <select
      className={`rounded-md border border-line bg-surface2 px-3 py-3 text-base outline-none focus:border-accent ${className}`}
      {...rest}
    />
  );
}

export function Chip({
  active = false,
  onClick,
  children,
}: {
  active?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex min-h-9 items-center gap-1.5 rounded-full border px-3.5 text-[13px] font-medium transition-colors ${
        active
          ? "border-accent bg-surface2 text-accent"
          : "border-line text-soft hover:bg-surface2"
      }`}
    >
      {children}
    </button>
  );
}

export function Badge({
  tone = "neutral",
  children,
}: {
  tone?: "neutral" | "sage" | "clay" | "accent";
  children: React.ReactNode;
}) {
  const styles = {
    neutral: "bg-surface2 text-soft",
    sage: "bg-sageBg text-sage",
    clay: "bg-clayBg text-clay",
    accent: "bg-accent/10 text-accent",
  }[tone];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${styles}`}>
      {children}
    </span>
  );
}

export function SectionLabel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`mb-2.5 mt-6 text-xs font-semibold uppercase tracking-[.1em] text-soft ${className}`}>
      {children}
    </div>
  );
}

export function MoodPicker({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const faces = ["😞", "😐", "🙂", "😄", "🤩"];
  return (
    <div className="flex gap-2" role="radiogroup" aria-label="mood">
      {faces.map((f, i) => (
        <button
          key={i}
          type="button"
          role="radio"
          aria-checked={value === i + 1}
          onClick={() => onChange(i + 1)}
          className={`flex h-12 w-12 items-center justify-center rounded-full border-2 text-[22px] transition-all ${
            value === i + 1 ? "scale-110 border-accent bg-surface2" : "border-line"
          }`}
        >
          {f}
        </button>
      ))}
    </div>
  );
}

export function Toast({ message }: { message: string | null }) {
  return (
    <div
      aria-live="polite"
      className={`fixed bottom-24 left-1/2 z-50 max-w-[86vw] -translate-x-1/2 rounded-md bg-ink px-5 py-3 text-center text-sm text-bg shadow-lift transition-all duration-300 md:bottom-8 ${
        message ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      {message}
    </div>
  );
}
