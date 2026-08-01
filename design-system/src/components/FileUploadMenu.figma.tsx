// 업로드 메뉴 Code Connect 매핑(2026-08-01) — file upload menu SET(7957:5287) +
// image upload menu SET(7959:5598).
//   - file: state(목록/empty/max — 'Variant5'는 미정리 이름이라 기본 예시 폴백) ×
//     up and down(Upload/Up and down — 후자는 onTemplateDownload 푸터).
//   - image: Property 1(Upload image/empty) → image 유무.
// 발행: main 머지 시 자동(.github/workflows/figma-code-connect.yml)
// 파서 제약 — URL·props는 리터럴만(변수·스프레드·as const 금지).
import figma from '@figma/code-connect';
import { FileUploadMenu } from './FileUploadMenu';
import { ImageUploadMenu } from './ImageUploadMenu';

// file upload menu — 기본(파일 목록)
figma.connect(
  FileUploadMenu,
  'https://www.figma.com/design/h9jZFkEHfcHUGok1TZjjlP/?node-id=7957-5287',
  {
    example: () => (
      <FileUploadMenu
        guide={'10MB 이하 파일만 업로드할 수 있습니다.\n(.pdf, .doc, .xlsx)'}
        accept=".pdf,.doc,.xlsx"
        maxCount={3}
        files={[
          { name: '이력서.pdf', size: 2.4 },
          { name: '포트폴리오.pdf', size: 8.1 },
        ]}
        onAdd={() => {}}
        onDelete={() => {}}
      />
    ),
  },
);

// file upload menu — 빈 상태
figma.connect(
  FileUploadMenu,
  'https://www.figma.com/design/h9jZFkEHfcHUGok1TZjjlP/?node-id=7957-5287',
  {
    variant: { state: 'Upload file list empty' },
    example: () => (
      <FileUploadMenu
        guide={'10MB 이하 파일만 업로드할 수 있습니다.\n(.pdf, .doc, .xlsx)'}
        accept=".pdf,.doc,.xlsx"
        maxCount={3}
        files={[]}
        onAdd={() => {}}
      />
    ),
  },
);

// file upload menu — 최대 개수 도달
figma.connect(
  FileUploadMenu,
  'https://www.figma.com/design/h9jZFkEHfcHUGok1TZjjlP/?node-id=7957-5287',
  {
    variant: { state: 'Upload file list max' },
    example: () => (
      <FileUploadMenu
        guide={'10MB 이하 파일만 업로드할 수 있습니다.\n(.pdf, .doc, .xlsx)'}
        accept=".pdf,.doc,.xlsx"
        maxCount={3}
        files={[
          { name: '이력서.pdf', size: 2.4 },
          { name: '포트폴리오.pdf', size: 8.1 },
          { name: '경력기술서.doc', size: 1.2 },
        ]}
        onDelete={() => {}}
      />
    ),
  },
);

// file upload menu — 양식 다운로드형(up and down)
figma.connect(
  FileUploadMenu,
  'https://www.figma.com/design/h9jZFkEHfcHUGok1TZjjlP/?node-id=7957-5287',
  {
    variant: { 'up and down': 'Up and down' },
    example: () => (
      <FileUploadMenu
        guide={'양식을 내려받아 작성한 뒤 업로드하세요. (.xlsx)'}
        accept=".xlsx"
        files={[]}
        onAdd={() => {}}
        onTemplateDownload={() => {}}
      />
    ),
  },
);

// image upload menu — 미리보기 있음
figma.connect(
  ImageUploadMenu,
  'https://www.figma.com/design/h9jZFkEHfcHUGok1TZjjlP/?node-id=7959-5598',
  {
    variant: { 'Property 1': 'Upload image' },
    example: () => (
      <ImageUploadMenu
        image="/photo.jpg"
        guide={'5MB 이하 이미지만 업로드할 수 있습니다.\n(.jpeg, .png, .webp)'}
        accept=".jpeg,.png,.webp"
        onSelect={() => {}}
        onRemove={() => {}}
      />
    ),
  },
);

// image upload menu — 빈 상태
figma.connect(
  ImageUploadMenu,
  'https://www.figma.com/design/h9jZFkEHfcHUGok1TZjjlP/?node-id=7959-5598',
  {
    variant: { 'Property 1': 'Upload image empty' },
    example: () => (
      <ImageUploadMenu
        guide={'5MB 이하 이미지만 업로드할 수 있습니다.\n(.jpeg, .png, .webp)'}
        accept=".jpeg,.png,.webp"
        onSelect={() => {}}
      />
    ),
  },
);
