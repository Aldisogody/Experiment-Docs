export type PlaygroundStatus =
  | 'idle'
  | 'booting'
  | 'installing'
  | 'building'
  | 'starting'
  | 'ready'
  | 'error';

export type SeedArtifact = {
  source: {
    sampleRoot: string;
    frameworkRoot: string;
    tarballName: string;
  };
  files: Record<string, string>;
  binaryFiles?: Record<string, string>;
};

export type OpenFile = {
  path: string;
  contents: string;
};

export type TerminalLineSource = 'system' | 'install' | 'dev' | 'build';

export type TerminalLine = {
  id: number;
  source: TerminalLineSource;
  text: string;
};
