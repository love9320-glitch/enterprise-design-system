// 소비자 스모크 (2026-08-12) — npm pack 산출물(실제 배포 형태)을 consumer-smoke/ 앱에
// 설치해 tsc + vite build. 저장소 경로 alias가 아닌 tarball이라서
// files 필드 누락·배럴 미등록(1.2.1 판례)·메인 엔트리 tiptap 오염(0.1.0 판례)을 배포 전에 잡는다.
// 사용: npm run check:consumer  (build:package 포함 — 항상 최신 소스 기준)
import { execSync } from 'node:child_process';
import { readdirSync, rmSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const SMOKE = join(ROOT, 'consumer-smoke');
const run = (cmd, cwd) => execSync(cmd, { cwd, stdio: 'inherit' });
const step = (msg) => console.log(`\n▶ ${msg}`);

step('1/4 라이브러리 산출물 빌드 (build:package)');
run('npm run build:package', ROOT);

step('2/4 npm pack — 배포와 동일한 tarball 생성');
for (const f of readdirSync(ROOT).filter((f) => f.endsWith('.tgz'))) rmSync(join(ROOT, f));
run('npm pack', ROOT);
const tarball = readdirSync(ROOT).find((f) => f.endsWith('.tgz'));
if (!tarball) throw new Error('npm pack 산출물(.tgz)을 찾지 못함');

step(`3/4 소비자 앱에 설치 — ${tarball}`);
if (!existsSync(join(SMOKE, 'node_modules'))) run('npm install', SMOKE);
run(`npm install --no-save "${join(ROOT, tarball)}"`, SMOKE);

step('4/4 소비자 앱 타입체크 + 프로덕션 빌드');
run('npm run check', SMOKE);

rmSync(join(ROOT, tarball));
console.log('\n✅ 소비자 스모크 통과 — tarball 설치·타입·빌드 전 항목 정상');
