// 배포 후 GitHub Pages 스모크 (2026-08-13 운영안 ⓒ)
// 역할: deploy-pages 완료 직후 실제 배포 URL을 Chromium으로 열어
//   ① 버전 배지가 이번 빌드 버전과 일치할 때까지 대기(CDN 전파 — 고정 sleep 금지, 바운디드 재시도)
//   ② 홈 + Button/Input/Modal 데모 페이지 렌더 확인
//   ③ 콘솔 에러 0 · 리소스 로드 실패 0
// 사용: node scripts/pages-smoke.mjs <배포URL>  (URL 미지정 시 기본 Pages 주소)
// 주의: playwright는 CI 스모크 잡에서만 --no-save 설치(런타임 의존성 아님 — package.json에 넣지 않는다)
import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const { version } = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));
const BASE_URL = (process.argv[2] || 'https://love9320-glitch.github.io/enterprise-design-system/').replace(/\/?$/, '/');

const MAX_TRIES = 12; // 12회 × 15초 = 최대 3분 대기(전파 실패 시 잡 실패)
const RETRY_MS = 15_000;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

const consoleErrors = [];
const failedResources = [];
page.on('console', (msg) => {
  if (msg.type() === 'error') consoleErrors.push(msg.text());
});
page.on('requestfailed', (req) => {
  // 방문 종료로 인한 취소(aborted)는 실패로 치지 않는다
  const err = req.failure()?.errorText ?? '';
  if (!err.includes('ERR_ABORTED')) failedResources.push(`${req.url()} — ${err}`);
});
page.on('response', (res) => {
  if (res.status() >= 400) failedResources.push(`${res.url()} — HTTP ${res.status()}`);
});

let ok = true;
const fail = (msg) => {
  ok = false;
  console.error(`✗ ${msg}`);
};

// ① 버전 배지 대기 — 새 배포가 CDN에 퍼질 때까지 바운디드 재시도
let deployed = false;
for (let i = 1; i <= MAX_TRIES; i++) {
  try {
    await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 30_000 });
    const badge = page.getByText(`v${version}`, { exact: true }).first();
    if (await badge.isVisible({ timeout: 5_000 }).catch(() => false)) {
      console.log(`✓ 버전 배지 v${version} 확인 (${i}번째 시도)`);
      deployed = true;
      break;
    }
    console.log(`… v${version} 아직 미반영 (${i}/${MAX_TRIES}) — ${RETRY_MS / 1000}s 후 재시도`);
  } catch (e) {
    console.log(`… 페이지 로드 실패 (${i}/${MAX_TRIES}): ${e.message.split('\n')[0]}`);
  }
  if (i < MAX_TRIES) await sleep(RETRY_MS);
}
if (!deployed) fail(`버전 배지 v${version}가 ${MAX_TRIES}회 재시도 안에 나타나지 않음 (${BASE_URL})`);

// 전파 대기 중 쌓인 이전 버전 소음 제거 — 검사 대상은 확정 배포본부터
consoleErrors.length = 0;
failedResources.length = 0;

// ② 핵심 데모 페이지 렌더 확인 (해시 라우팅)
if (deployed) {
  const targets = [
    { hash: '#button', expect: 'Button' },
    { hash: '#input', expect: 'Input' },
    { hash: '#modal', expect: 'Modal' },
  ];
  for (const t of targets) {
    await page.goto(`${BASE_URL}${t.hash}`, { waitUntil: 'networkidle', timeout: 30_000 });
    const heading = page.getByRole('heading', { name: t.expect }).first();
    if (await heading.isVisible({ timeout: 10_000 }).catch(() => false)) {
      console.log(`✓ ${t.hash} 페이지 렌더 확인`);
    } else {
      fail(`${t.hash} 페이지에서 "${t.expect}" 헤딩을 찾지 못함`);
    }
  }
}

// ③ 콘솔 에러 · 리소스 실패 집계
if (consoleErrors.length) fail(`콘솔 에러 ${consoleErrors.length}건:\n  ${consoleErrors.join('\n  ')}`);
else console.log('✓ 콘솔 에러 0건');
if (failedResources.length) fail(`리소스 로드 실패 ${failedResources.length}건:\n  ${failedResources.join('\n  ')}`);
else console.log('✓ 리소스 로드 실패 0건');

await browser.close();
if (!ok) process.exit(1);
console.log('\n배포 스모크 통과 ✅');
