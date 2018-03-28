export = PersonalitySunburstChart;

declare type Locale = 'ar' | 'de' | 'en' | 'es' | 'fr' | 'it' | 'ja' | 'ko' | 'pt-br' | 'zh-tw' | 'zh';
declare type Version = 'v2' | 'v3';
declare type D3Version = 'v3' | 'v4';
declare type SunburstChartOptions = {
  selector?: string,
  element?: any,
  version?: Version,
  d3version?: D3Version,
  locale?: Locale,
  scale?: number,
  colors?: SunburstChartColors
};
declare type SunburstChartColors = {
  traits_dark: string,
  traits_light: string,
  facet: string,
  needs_dark: string,
  needs_light: string,
  need: string,
  values_dark: string,
  values_light: string,
  value: string
};

declare class PersonalitySunburstChart {
  constructor(options?: SunburstChartOptions);

  defaultOptions(): {
    locale: Locale,
    version: Version,
    d3version: D3Version,
    scale: number,
    colors: SunburstChartColors
  };

  setLocale(locale: Locale, render?: boolean): void;

  setImage(url: string, render?: boolean): void;

  setProfile(profile: any, render?: boolean): void;

  setColors(colors: SunburstChartColors, render?: boolean);

  render(): void;

  show(profile: any, imageUrl?: string): void;
}
