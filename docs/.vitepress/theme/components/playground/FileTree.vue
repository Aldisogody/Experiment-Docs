<script setup lang="ts">
import { computed, ref, watch } from 'vue';

type FileTreeNode = {
  type: 'directory' | 'file';
  name: string;
  path: string;
  children: FileTreeNode[];
};

type FileTreeRow = {
  node: FileTreeNode;
  depth: number;
};

const props = defineProps<{
  files: string[];
  activePath: string;
}>();

const emit = defineEmits<{
  select: [path: string];
}>();

const rootPath = '';
const rootName = 'framework-playground';
const expandedFolders = ref(new Set<string>(activeFolderPaths(props.activePath)));

const fileTree = computed(() => buildFileTree(props.files));
const visibleRows = computed(() => {
  const rows: FileTreeRow[] = [];
  collectVisibleRows(fileTree.value, 0, rows);
  return rows;
});

watch(
  () => props.activePath,
  (path) => {
    const next = new Set(expandedFolders.value);
    for (const folderPath of activeFolderPaths(path)) {
      next.add(folderPath);
    }
    expandedFolders.value = next;
  },
);

function buildFileTree(files: string[]) {
  const root: FileTreeNode = {
    type: 'directory',
    name: rootName,
    path: rootPath,
    children: [],
  };
  const directories = new Map<string, FileTreeNode>([[rootPath, root]]);

  for (const file of [...files].sort((a, b) => a.localeCompare(b))) {
    const parts = file.split('/');
    let parent = root;
    let currentPath = '';

    parts.forEach((part, index) => {
      const isFile = index === parts.length - 1;
      currentPath = currentPath ? `${currentPath}/${part}` : part;

      if (isFile) {
        parent.children.push({
          type: 'file',
          name: part,
          path: file,
          children: [],
        });
        return;
      }

      let directory = directories.get(currentPath);
      if (!directory) {
        directory = {
          type: 'directory',
          name: part,
          path: currentPath,
          children: [],
        };
        directories.set(currentPath, directory);
        parent.children.push(directory);
      }
      parent = directory;
    });
  }

  sortTree(root);
  return root;
}

function sortTree(node: FileTreeNode) {
  node.children.sort((a, b) => {
    if (a.type !== b.type) return a.type === 'directory' ? -1 : 1;
    return a.name.localeCompare(b.name);
  });

  for (const child of node.children) {
    sortTree(child);
  }
}

function collectVisibleRows(node: FileTreeNode, depth: number, rows: FileTreeRow[]) {
  rows.push({ node, depth });

  if (node.type !== 'directory') return;
  if (!isExpanded(node.path)) return;

  for (const child of node.children) {
    collectVisibleRows(child, depth + 1, rows);
  }
}

function activeFolderPaths(path: string) {
  const folders = [rootPath];
  const parts = path.split('/').slice(0, -1);

  for (let index = 0; index < parts.length; index += 1) {
    folders.push(parts.slice(0, index + 1).join('/'));
  }

  return folders;
}

function toggleFolder(path: string) {
  const next = new Set(expandedFolders.value);
  if (next.has(path)) {
    next.delete(path);
  } else {
    next.add(path);
  }
  expandedFolders.value = next;
}

function isExpanded(path: string) {
  return expandedFolders.value.has(path);
}

function fileKindClass(path: string) {
  const basename = path.split('/').pop() ?? path;
  const extension = basename.includes('.') ? basename.split('.').pop() : '';

  if (basename === 'package.json') return 'is-package-json';
  if (basename === 'README.md') return 'is-markdown';

  switch (extension) {
    case 'js':
    case 'jsx':
      return 'is-javascript';
    case 'json':
      return 'is-json';
    case 'md':
      return 'is-markdown';
    case 'scss':
    case 'css':
      return 'is-stylesheet';
    case 'html':
      return 'is-html';
    default:
      return 'is-file';
  }
}

function rowKey(row: FileTreeRow) {
  return `${row.node.type}:${row.node.path || rootName}`;
}

</script>

<template>
  <nav class="playground-file-tree" aria-label="Playground files">
    <div class="playground-explorer-title">Explorer</div>

    <div class="playground-file-list">
      <template v-for="row in visibleRows" :key="rowKey(row)">
        <button
          v-if="row.node.type === 'directory'"
          class="playground-folder"
          :class="{ 'is-root': row.depth === 0 }"
          :style="{ '--tree-depth': row.depth }"
          :aria-expanded="isExpanded(row.node.path)"
          type="button"
          @click="toggleFolder(row.node.path)"
        >
          <span class="playground-folder-chevron" aria-hidden="true" />
          <span class="playground-folder-icon" aria-hidden="true" />
          <span class="playground-folder-name">{{ row.node.name }}</span>
        </button>

        <button
          v-else
          class="playground-file"
          :class="[{ 'is-active': row.node.path === activePath }, fileKindClass(row.node.path)]"
          :style="{ '--tree-depth': row.depth }"
          :aria-current="row.node.path === activePath ? 'true' : undefined"
          type="button"
          @click="emit('select', row.node.path)"
        >
          <span class="playground-file-icon" aria-hidden="true" />
          <span class="playground-file-name">{{ row.node.name }}</span>
        </button>
      </template>
    </div>
  </nav>
</template>
