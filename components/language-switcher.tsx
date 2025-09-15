"use client";

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/components/i18n-provider';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from '@/components/ui/sheet';

const SUPPORTED = ['en', 'ar'] as const;
type Locale = (typeof SUPPORTED)[number];

function replaceFirstSegment(pathname: string, next: Locale): string {
  const parts = pathname.split('/');
  const first = parts[1];
  if (SUPPORTED.includes(first as Locale)) {
    parts[1] = next;
  } else {
    parts.splice(1, 0, next);
  }
  return parts.join('/') || '/';
}

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { t } = useI18n();

  const current: Locale = useMemo(() => {
    const first = (pathname || '').split('/')[1] as Locale | undefined;
    if (first && (SUPPORTED as readonly string[]).includes(first)) return first as Locale;
    if (typeof document !== 'undefined') {
      const m = document.cookie.match(/NEXT_LOCALE=(en|ar)/);
      if (m) return m[1] as Locale;
    }
    return 'en';
  }, [pathname]);

  const buildUrl = useCallback((locale: Locale) => {
    const nextPath = replaceFirstSegment(pathname || '/', locale);
    const query = searchParams?.toString();
    const hash = typeof window !== 'undefined' ? window.location.hash : '';
    return (query ? `${nextPath}?${query}` : nextPath) + hash;
  }, [pathname, searchParams]);

  const onSwitch = useCallback((locale: Locale) => {
    const url = buildUrl(locale);
    document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=${60 * 60 * 24 * 365}`;
    router.replace(url);
  }, [buildUrl, router]);

  // Prefetch alternative locale routes for instant switch
  useEffect(() => {
    const other: Locale = current === 'ar' ? 'en' : 'ar';
    const url = buildUrl(other);
    try {
      const r = router as unknown as { prefetch?: (href: string) => void };
      r.prefetch?.(url);
    } catch {}
  }, [buildUrl, current, router]);

  const currentFlag = current === 'ar'
    ? 'https://cdn.jsdelivr.net/npm/circle-flags/flags/sa.svg'
    : 'https://cdn.jsdelivr.net/npm/circle-flags/flags/gb.svg';

  return (
    <>
      {/* Desktop: dropdown menu */}
      <div className="hidden md:block">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" aria-label={t('common.changeLanguage')}>
              <img src={currentFlag} alt={current === 'ar' ? t('common.langArabic') : t('common.langEnglish')} width={20} height={20} style={{ borderRadius: '9999px', display: 'block' }} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" sideOffset={6} className="w-32">
            <DropdownMenuItem onSelect={() => onSwitch('en')} className="gap-2">
              <img src="https://cdn.jsdelivr.net/npm/circle-flags/flags/gb.svg" alt={t('common.langEnglish')} width={20} height={20} style={{ borderRadius: '9999px', display: 'block' }} />
              EN
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => onSwitch('ar')} className="gap-2">
              <img src="https://cdn.jsdelivr.net/npm/circle-flags/flags/sa.svg" alt={t('common.langArabic')} width={20} height={20} style={{ borderRadius: '9999px', display: 'block' }} />
              AR
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Mobile: iOS-like bottom sheet */}
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" aria-label={t('common.changeLanguage')}>
              <img src={currentFlag} alt={current === 'ar' ? t('common.langArabic') : t('common.langEnglish')} width={20} height={20} style={{ borderRadius: '9999px', display: 'block' }} />
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="rounded-t-2xl pb-6 pt-2 px-0 max-h-[60vh]">
            <div className="mx-auto mt-2 mb-2 h-1.5 w-12 rounded-full bg-muted-foreground/30" />
            <SheetHeader>
              <SheetTitle>{t('common.changeLanguage')}</SheetTitle>
            </SheetHeader>
            <div className="p-4 space-y-3">
              <SheetClose asChild>
                <button type="button" onClick={() => onSwitch('en')} className="w-full flex items-center gap-3 p-3 rounded-xl border hover:bg-muted/40">
                  <img src="https://cdn.jsdelivr.net/npm/circle-flags/flags/gb.svg" alt={t('common.langEnglish')} width={24} height={24} style={{ borderRadius: '9999px', display: 'block' }} />
                  <span className="text-base font-medium">English</span>
                </button>
              </SheetClose>
              <SheetClose asChild>
                <button type="button" onClick={() => onSwitch('ar')} className="w-full flex items-center gap-3 p-3 rounded-xl border hover:bg-muted/40">
                  <img src="https://cdn.jsdelivr.net/npm/circle-flags/flags/sa.svg" alt={t('common.langArabic')} width={24} height={24} style={{ borderRadius: '9999px', display: 'block' }} />
                  <span className="text-base font-medium">العربية</span>
                </button>
              </SheetClose>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}


