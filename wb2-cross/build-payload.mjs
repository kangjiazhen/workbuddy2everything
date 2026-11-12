#!/usr/bin/env node
/**
 * 从 DSH 的 prompt-inject.md 生成本包的 src/payload.md。
 * 只在你想换载荷时用；仓库里已经带了一份生成好的 payload.md。
 *
 *   node build-payload.mjs                  # 默认读 ~/.dsh/prompt-inject.md
 *   node build-payload.mjs path/to/file.md  # 指定源
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const src = process.argv[2] || process.env.WBXC_PAYLOAD_SRC || path.join(os.homedir(), '.dsh', 'prompt-inject.md');

if (!fs.existsSync(src)) {
  console.error(`源文件不存在: ${src}`);
  console.error('用法: node build-payload.mjs [源文件路径]');
  process.exit(1);
}

let s = fs.readFileSync(src, 'utf8').replace(/^\uFEFF/, '');
// 去掉 <|im_start|>system / <project_instructions> 包裹，只留正文
s = s.replace(/^[\s\S]*?<project_instructions>\s*/i, '');
s = s.replace(/<\/project_instructions>[\s\S]*$/i, '');
s = s.replace(/<\|im_start\|>system:?/gi, '').replace(/<\|im_end\|>/gi, '');
s = s.trim();

const out = path.join(HERE, 'src', 'payload.md');
fs.writeFileSync(out, s + '\n', 'utf8');
console.log(`payload.md ${s.length} 字符 -> ${out}`);
console.log('首行:', s.split('\n')[0]);
