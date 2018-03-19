export = PersonalitySunburstChart;

declare type Locale = 'ar' | 'de' | 'en' | 'es' | 'fr' | 'it' | 'ja' | 'ko' | 'pt-br' | 'zh-tw' | 'zh';
declare type Version = 'v2' | 'v3';
declare type D3Version = 'v3' | 'v4';

declare class PersonalitySunburstChart {
  constructor(options?: { selector?: string, element?: any, version?: Version, d3version?: D3Version, locale?: Locale });

  defaultOptions(): {
    locale: Locale,
    version: Version,
    d3version: D3Version
  };

  setLocale(locale: Locale): void;

  show(profile: any, imageUrl?: string): void;
}
