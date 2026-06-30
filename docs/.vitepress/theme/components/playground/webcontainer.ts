import type { FileSystemTree, WebContainer, WebContainerProcess } from '@webcontainer/api';

function base64ToBytes(contents: string) {
  const binary = globalThis.atob(contents);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index++) {
    bytes[index] = binary.charCodeAt(index);
  }

  return bytes;
}

function addFile(tree: FileSystemTree, path: string, contents: string | Uint8Array) {
  const parts = path.split('/');
  let cursor = tree;

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

export function toFileSystemTree(
  files: Record<string, string>,
  binaryFiles: Record<string, string> = {},
): FileSystemTree {
  const root: FileSystemTree = {};

  for (const [path, contents] of Object.entries(files)) {
    addFile(root, path, contents);
  }

  for (const [path, contents] of Object.entries(binaryFiles)) {
    addFile(root, path, base64ToBytes(contents));
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
