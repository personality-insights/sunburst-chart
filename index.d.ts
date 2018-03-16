export = PersonalitySunburstChart;

declare type Version = 'v2' | 'v3';

declare class PersonalitySunburstChart {
  constructor(options?: { selector?: string, version?: Version, element?: any });

  defaultOptions(): {
    version: Version
  };

  show(profile: any, imageUrl: string): void;
}
