"use client";

import { createContext, useContext, ReactNode, useMemo } from 'react';

type Messages = Record<string, string>;

type I18nContextValue = {
  locale: 'en' | 'ar';
  dir: 'ltr' | 'rtl';
  t: (key: string, vars?: Record<string, string | number>) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({
  locale,
  dir,
  messages,
  children,
}: {
  locale: 'en' | 'ar';
  dir: 'ltr' | 'rtl';
  messages: Messages;
  children: ReactNode;
}) {
  const value = useMemo<I18nContextValue>(() => ({
    locale,
    dir,
    t: (key, vars) => {
      const template = messages[key] ?? key;
      if (!vars) return template;
      return Object.keys(vars).reduce((acc, k) => acc.replaceAll(`{${k}}`, String(vars[k]!)), template);
    },
  }), [dir, locale, messages]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}


