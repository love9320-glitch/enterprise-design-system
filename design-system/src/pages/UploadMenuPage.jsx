import { useState } from 'react';
import { FileUploadMenu } from '../components/FileUploadMenu';
import { ImageUploadMenu } from '../components/ImageUploadMenu';
import { FileUploadButton } from '../components/FileUploadButton';
import { ImageUploadButton } from '../components/ImageUploadButton';
import { UsageExample } from '../components/UsageExample';
import { Divider } from '../components/Divider';

const USAGE = `import { FileUploadButton } from '../components/FileUploadButton';
import { ImageUploadButton } from '../components/ImageUploadButton';
// 패널만 단독으로 쓰려면: FileUploadMenu / ImageUploadMenu

// ── 버튼 트리거 (권장) — 버튼을 누르면 업로드 팝오버가 열린다 ──
const [files, setFiles] = useState([]);
<FileUploadButton
  files={files}                       // 파일 있으면 라벨에 "(N개 등록됨)" 표시
  maxCount={5}
  accept=".pdf,.doc,.xlsx"
  guide={'최대 5개까지 등록 가능, 파일 최대 100mb.\\n지원: .pdf, .doc, .excel'}
  buttonProps={{ variant: 'fill' }}   // 모든 Button 스타일 통과(variant/size/leftIcon 등)
  onAdd={(list) => setFiles((f) => [...f, ...[...list].map((x) => ({ name: x.name, size: Math.round(x.size / 1e6) }))])}
  onDelete={(_, i) => setFiles((f) => f.filter((_, idx) => idx !== i))}
/>

const [image, setImage] = useState(null);
<ImageUploadButton
  image={image}
  accept=".jpeg,.png,.webp"
  guide={'이미지 320x260, 1024KB.\\n지원: .jpeg, .png, .webp'}
  buttonProps={{ variant: 'line' }}
  onSelect={(file) => setImage(URL.createObjectURL(file))}
  onRemove={() => setImage(null)}
/>

// ── 패널 단독 (트리거 없이 그대로 배치) ──
<FileUploadMenu files={files} maxCount={5} guide="…" onAdd={…} onDelete={…} />
<ImageUploadMenu image={image} guide="…" onSelect={…} onRemove={…} />`;

const FILE_PROPS = [
  { name: 'files', type: '{name,size?,id?}[]', default: '[]', desc: '업로드된 파일(컨트롤드). size 숫자=MB 표기' },
  { name: 'guide', type: 'string', default: '—', desc: '상단 안내 문구(여러 줄 \\n)' },
  { name: 'maxCount', type: 'number', default: '5', desc: '최대 개수 — 도달 시 푸터 비활성+안내' },
  { name: 'accept', type: 'string', default: '—', desc: '<input accept>' },
  { name: 'onAdd', type: '(FileList)=>void', default: '—', desc: "'파일 찾기' 선택 콜백" },
  { name: 'onDelete', type: '(file,index)=>void', default: '—', desc: '행 삭제 콜백' },
  { name: 'findText / maxText', type: 'string', default: "'파일 찾기' / 자동", desc: '버튼·최대 안내 문구' },
  { name: 'width', type: 'number|string', default: '420', desc: '팝오버 너비' },
];

const IMAGE_PROPS = [
  { name: 'image', type: 'string', default: '—', desc: '미리보기 URL(없으면 empty 상태)' },
  { name: 'guide', type: 'string', default: '—', desc: '상단 안내 문구(여러 줄 \\n)' },
  { name: 'accept', type: 'string', default: '—', desc: '<input accept>' },
  { name: 'onSelect', type: '(File)=>void', default: '—', desc: "'파일 찾기' 선택 콜백" },
  { name: 'onRemove', type: '()=>void', default: '—', desc: "'파일 삭제' 콜백" },
  { name: 'findText / removeText', type: 'string', default: "'파일 찾기' / '파일 삭제'", desc: '버튼 문구' },
  { name: 'width', type: 'number|string', default: '320', desc: '팝오버 너비' },
];

// 버튼 트리거(FileUploadButton/ImageUploadButton) 전용 props — 위 메뉴 props에 더해 사용
const TRIGGER_PROPS = [
  { name: '[트리거] triggerText', type: 'string', default: "'파일 업로드' / '이미지 등록'", desc: '버튼 기본 라벨' },
  { name: '[트리거] buttonProps', type: 'object', default: '{}', desc: '모든 Button 스타일 통과(variant/size/leftIcon 등). 기본 line+아이콘' },
  { name: '[트리거] showCount / countSuffix', type: 'bool / string', default: "true / '개 등록됨'", desc: '파일 개수 라벨 표시(File 전용)' },
  { name: '[트리거] placement / menuWidth', type: 'string / number', default: "'bottom-left' / 420·320", desc: '팝오버 위치·너비' },
];

const FILE_GUIDE = '최대 5개까지 등록이 가능하며, 파일 최대 용량은 100mb입니다.\n지원하는 파일 확장자는 .pdf, .doc, .excel 입니다.';
const IMAGE_GUIDE = '이미지 사이즈 320x260, 용량제한 1024KB\n지원하는 파일 확장자는 .jpeg, .png, .webp 입니다.';

export function UploadMenuPage() {
  const [files, setFiles] = useState([
    { name: 'upload file name1.pdf', size: 48 },
    { name: 'upload file name2.pdf', size: 48 },
  ]);
  const [image, setImage] = useState(null);

  const addFiles = (list) =>
    setFiles((prev) => [
      ...prev,
      ...[...list].map((x) => ({ name: x.name, size: Math.max(1, Math.round(x.size / 1e6)) })),
    ].slice(0, 5));
  const delFile = (_, i) => setFiles((prev) => prev.filter((_, idx) => idx !== i));

  return (
    <section className="mx-auto max-w-5xl px-spacing-7 py-spacing-10 text-left">
      <h2 className="mb-spacing-3 text-20 font-semibold text-font-icon-5">Upload Menu</h2>
      <p className="mb-spacing-8 text-14 text-font-icon-4">
        팝오버 업로드 위젯 2종. PopoverMenu를 조립한 프레젠테이셔널 컴포넌트 —
        파일/이미지 상태는 호출부가 소유하고 선택·삭제는 콜백으로 받습니다.
        <span className="text-font-icon-5"> '파일 찾기'를 누르면 실제 파일 선택창이 열립니다.</span>
      </p>
      <p className="mb-spacing-8 rounded-round-4 bg-text-field-default-bg px-spacing-6 py-spacing-5 text-12 text-font-icon-4">
        ⚠️ <span className="text-font-icon-5">주의</span> — <code className="text-font-icon-5">guide</code>(화면 안내 문구)와{' '}
        <code className="text-font-icon-5">accept</code>(실제 파일 선택창 필터)는 <span className="text-font-icon-5">별개 prop이라 자동 연동되지 않습니다.</span>{' '}
        표시 확장자와 실제 허용 확장자가 어긋나지 않도록 둘을 직접 일치시켜 주세요 (예:{' '}
        <code className="text-font-icon-5">guide</code> "… .pdf, .doc, .xlsx …" ↔{' '}
        <code className="text-font-icon-5">accept=".pdf,.doc,.xlsx"</code>).
      </p>

      <UsageExample code={USAGE} props={[...TRIGGER_PROPS, ...FILE_PROPS, ...IMAGE_PROPS]} />

      {/* 버튼 트리거 — Button을 트리거로 팝오버. 모든 버튼 스타일 사용 가능 + 파일 개수 표시 */}
      <div>
        <h3 className="mb-spacing-3 text-15 font-semibold text-font-icon-5">버튼 트리거</h3>
        <p className="mb-spacing-7 text-12 text-font-icon-4">
          <code className="text-font-icon-5">FileUploadButton</code>/
          <code className="text-font-icon-5">ImageUploadButton</code> — 버튼을 누르면 업로드 팝오버가 열립니다.
          <code className="text-font-icon-5"> buttonProps</code>로 모든 버튼 스타일(variant·size·아이콘 등)을 쓸 수 있고,
          파일 업로드 버튼은 <span className="text-font-icon-5">등록된 개수</span>를 라벨에 표시합니다.
        </p>
        <div className="flex flex-wrap items-start gap-spacing-7">
          <FileUploadButton
            files={files}
            maxCount={5}
            accept=".pdf,.doc,.xlsx"
            guide={FILE_GUIDE}
            onAdd={addFiles}
            onDelete={delFile}
          />
          <FileUploadButton
            files={files}
            maxCount={5}
            accept=".pdf,.doc,.xlsx"
            guide={FILE_GUIDE}
            onAdd={addFiles}
            onDelete={delFile}
            buttonProps={{ variant: 'fill' }}
          />
          <ImageUploadButton
            image={image}
            accept=".jpeg,.png,.webp"
            guide={IMAGE_GUIDE}
            onSelect={(file) => setImage(URL.createObjectURL(file))}
            onRemove={() => setImage(null)}
            buttonProps={{ variant: 'ghost' }}
          />
        </div>
        <p className="mt-spacing-5 text-12 text-font-icon-3">
          왼쪽 두 버튼은 같은 files 상태를 공유 — 한쪽에서 추가/삭제하면 양쪽 개수 라벨이 같이 갱신됩니다.
        </p>
      </div>

      {/* 팝오버 패널(메뉴) 단독 형태 — 파일 업로드 */}
      <Divider className="mt-spacing-9 mb-spacing-8" />
      <div className="flex flex-wrap items-start gap-spacing-9">
        <div>
          <h3 className="mb-spacing-5 text-15 font-semibold text-font-icon-5">파일 업로드 메뉴 (단독)</h3>
          <FileUploadMenu
            files={files}
            maxCount={5}
            accept=".pdf,.doc,.xlsx"
            guide={FILE_GUIDE}
            onAdd={addFiles}
            onDelete={delFile}
          />
        </div>
        <div>
          <h3 className="mb-spacing-5 text-15 font-semibold text-font-icon-5">파일 업로드 (empty)</h3>
          <FileUploadMenu files={[]} guide={FILE_GUIDE} accept=".pdf,.doc,.xlsx" onAdd={addFiles} />
        </div>
      </div>

      {/* 이미지 업로드 — 인터랙티브 */}
      <Divider className="mt-spacing-9 mb-spacing-8" />
      <div className="flex flex-wrap items-start gap-spacing-9">
        <div>
          <h3 className="mb-spacing-5 text-15 font-semibold text-font-icon-5">이미지 업로드</h3>
          <ImageUploadMenu
            image={image}
            accept=".jpeg,.png,.webp"
            guide={IMAGE_GUIDE}
            onSelect={(file) => setImage(URL.createObjectURL(file))}
            onRemove={() => setImage(null)}
          />
          <p className="mt-spacing-5 text-12 text-font-icon-3">
            이미지 선택 전 = empty(찾기만), 선택 후 = 미리보기 + 삭제/찾기.
          </p>
        </div>
      </div>
    </section>
  );
}
