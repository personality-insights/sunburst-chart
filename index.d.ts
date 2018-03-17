export = PersonalitySunburstChart;

declare type Version = 'v2' | 'v3';
declare type D3Version = 'v3' | 'v4';

declare class PersonalitySunburstChart {
  constructor(options?: { selector?: string, element?: any, version?: Version, d3version?: D3Version });

  defaultOptions(): {
    version: Version,
    d3version: D3Version
  };

  show(profile: any, imageUrl: string): void;
}
