import type { FileSystemTree, WebContainer, WebContainerProcess } from '@webcontainer/api';

export function toFileSystemTree(files: Record<string, string>): FileSystemTree {
  const root: FileSystemTree = {};

  for (const [path, contents] of Object.entries(files)) {
    const parts = path.split('/');
    let cursor = root;

    for (const [index, part] of parts.entries()) {
      if (index === parts.length - 1) {
        cursor[part] = { file: { contents } };
      } else {
        const existing = cursor[part];
        if (!existing || !('directory' in existing)) {
          cursor[part] = { directory: {} };
        }
        cursor = (cursor[part] as { directory: FileSystemTree }).directory;
      }
    }
  }

  return root;
}

export async function writeProjectFile(webcontainer: WebContainer, path: string, contents: string) {
  await webcontainer.fs.writeFile(path, contents);
}

export async function stopProcess(process: WebContainerProcess | null) {
  if (!process) return;
  process.kill();
  await process.exit;
}
