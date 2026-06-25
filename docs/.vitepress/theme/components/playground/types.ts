export type PlaygroundStatus =
  | 'idle'
  | 'booting'
  | 'installing'
  | 'starting'
  | 'ready'
  | 'error';

export type SeedArtifact = {
  generatedAt: string;
  source: {
    frameworkRoot: string;
    projectName: string;
    boilerplateType: string;
    variationCount: number;
  };
  files: Record<string, string>;
};

export type OpenFile = {
  path: string;
  contents: string;
};

export type TerminalLine = {
  id: number;
  source: 'system' | 'install' | 'dev' | 'preview';
  text: string;
};
