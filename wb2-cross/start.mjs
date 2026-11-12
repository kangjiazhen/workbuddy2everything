#!/usr/bin/env node
/**
 * 跨平台一键自检：确保 bridge 在跑，然后跑 doctor。
 */
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const run = (args) => spawnSync(process.execPath, [path.join(HERE, 'src', 'cli.mjs'), ...args], { stdio: 'inherit' });

run(['install', '--no-codex', '--no-claude']);
const r = run(['doctor']);
process.exit(r.status ?? 0);
