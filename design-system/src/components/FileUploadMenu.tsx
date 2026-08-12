// FileUploadMenu — 파일 업로드 팝오버 (Figma popover menu / type=upload file list)
//
// PopoverMenu 컨테이너를 조립한다(규칙 4): 안내 박스 + 파일 목록(List 행, 우측 삭제) + 전체폭 '파일 찾기'.
// 양식 다운로드 타입(2026-07-27, Figma 7957:5287 up and down 변형): onTemplateDownload를 주면
// 푸터가 [line ↓ 양식 다운로드 | fill ↑ 엑셀 업로드] 반반 버튼으로 바뀐다(양식 받아 수정 후 업로드 플로우).
// 프레젠테이셔널(controlled) — 파일 상태는 호출부가 소유하고, 선택/삭제는 콜백으로 받는다.
//   - files: [{ name, size? , id? }] (size: 숫자=MB 표기 / 문자열=그대로)
//   - 최대 개수 도달(max) 시 푸터 버튼이 비활성 + 안내 문구로 바뀐다.
//
// ⚠️ 주의: guide(화면 안내 문구)와 accept(실제 파일 선택창 필터)는 **별개 prop**이라
//    자동 연동되지 않는다. 표시 확장자와 실제 허용 확장자가 어긋나지 않도록 **둘을 직접 일치**시킬 것.
//    (예: guide '… .pdf, .doc, .xlsx …' ↔ accept '.pdf,.doc,.xlsx')
import { useRef } from 'react';
import type { ChangeEvent } from 'react';
import { Download, Trash2, Upload } from 'lucide-react';
import { PopoverMenu } from './PopoverMenu';
import type { PopoverMenuProps } from './PopoverMenu';
import { ListGroup } from './ListGroup';
import { List } from './List';

// 업로드 파일 항목 — size: 숫자=MB 표기 / 문자열=그대로
export interface UploadFileItem {
  name: string;
  size?: number | string;
  id?: string | number;
}

export interface FileUploadMenuProps extends PopoverMenuProps {
  /** [{ name, size?, id? }] */
  files?: UploadFileItem[];
  /** 안내 문구(여러 줄은 \n) */
  guide?: string;
  maxCount?: number;
  /** <input accept> 실제 필터 (예: '.pdf,.doc,.xlsx'). ⚠️ guide 표시와 직접 일치시킬 것 */
  accept?: string;
  multiple?: boolean;
  /** (FileList) => void — '파일 찾기'로 선택 */
  onAdd?: (files: FileList) => void;
  /** (file, index) => void — 행 삭제 */
  onDelete?: (file: UploadFileItem, index: number) => void;
  findText?: string;
  /** 기본 `최대 ${maxCount}개까지 업로드할 수 있습니다` */
  maxText?: string;
  // ── 양식 다운로드 타입(Figma up and down 변형, 2026-07-27) ──
  // onTemplateDownload를 주면 푸터가 [line ↓ 양식 다운로드 | fill ↑ 엑셀 업로드] 반반 구성으로 바뀐다.
  onTemplateDownload?: () => void;
  templateDownloadText?: string;
  /** 양식 다운로드 타입의 업로드 버튼 문구 */
  uploadText?: string;
}

export function FileUploadMenu({
  files = [],
  guide,
  maxCount = 5,
  accept,
  multiple = true,
  onAdd,
  onDelete,
  findText = '파일 찾기',
  maxText,
  onTemplateDownload,
  templateDownloadText = '양식 다운로드',
  uploadText = '엑셀 업로드',
  width = 420,
  className = '',
  ...props
}: FileUploadMenuProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const isMax = files.length >= maxCount;

  const openPicker = () => inputRef.current?.click();
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) onAdd?.(e.target.files);
    e.target.value = ''; // 같은 파일 재선택 허용
  };
  const prefix = (size?: number | string) =>
    typeof size === 'number' ? `${size}MB - ` : size ? `${size} - ` : '';

  return (
    <PopoverMenu
      width={width}
      className={className}
      footer
      footerButtonsFill
      // 양식 다운로드 타입 — 취소 슬롯을 '양식 다운로드'(line·Download)로, 확인은 '엑셀 업로드'(fill·Upload)
      showCancel={!!onTemplateDownload}
      cancelText={templateDownloadText}
      cancelIcon={onTemplateDownload ? Download : null}
      onCancel={onTemplateDownload}
      confirmText={
        isMax
          ? (maxText ?? (onTemplateDownload ? '업로드 완료' : `최대 ${maxCount}개까지 업로드할 수 있습니다`))
          : onTemplateDownload
            ? uploadText
            : findText
      }
      confirmIcon={onTemplateDownload && !isMax ? Upload : null}
      confirmDisabled={isMax}
      onConfirm={openPicker}
      {...props}
    >
      {guide != null && (
        <div className="bg-list-group-bg px-spacing-6 py-spacing-5">
          <p className="whitespace-pre-line text-14 text-list-default-text">{guide}</p>
        </div>
      )}

      {/* 파일 행은 선택 옵션이 아니라 액션 있는 목록 — list/listitem(중첩 버튼 허용, ARIA) */}
      {files.length > 0 && (
        <ListGroup role="list">
          {files.map((f, i) => (
            <List
              role="listitem"
              key={f.id ?? `${f.name}-${i}`}
              title={`${prefix(f.size)}${f.name}`}
              rightButton
              rightButtonIcon={Trash2}
              rightButtonAriaLabel="삭제"
              onButtonClick={() => onDelete?.(f, i)}
            />
          ))}
        </ListGroup>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        hidden
        onChange={handleChange}
      />
    </PopoverMenu>
  );
}
