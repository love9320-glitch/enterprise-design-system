// FileUploadButton — 버튼 트리거 + 파일 업로드 팝오버 (Figma butto+ file upload)
//
// Button을 트리거로 Popover에 FileUploadMenu를 붙인다(규칙 4 조립).
//  - 모든 Button 스타일 사용 가능: buttonProps로 variant/size/leftIcon/rightIcon/width 등 그대로 통과.
//  - 파일이 있으면 트리거 라벨에 개수 표시: `파일 업로드 (N개 등록됨)`.
// 파일 상태는 호출부가 소유(컨트롤드) — FileUploadMenu와 동일한 props(files/onAdd/onDelete 등)를 그대로 받는다.
import { Upload } from 'lucide-react';
import { Button } from './Button';
import { Popover } from './Popover';
import { FileUploadMenu } from './FileUploadMenu';

export function FileUploadButton({
  files = [],
  // ── 트리거 버튼 ──
  triggerText = '파일 업로드',
  countSuffix = '개 등록됨',   // 파일 N개 시 라벨 = `${triggerText} (N${countSuffix})`
  showCount = true,
  buttonProps = {},            // 모든 Button 스타일 props 통과(variant/size/leftIcon/...). 기본 variant=line·leftIcon=Upload
  // ── 팝오버 ──
  placement = 'bottom-left',
  menuWidth = 420,             // 팝오버(=FileUploadMenu) 너비
  open,
  onOpenChange,
  disabled = false,
  className = '',
  // ── 나머지는 FileUploadMenu props(guide/maxCount/accept/onAdd/onDelete/...) ──
  ...menuProps
}: any) {
  const count = files.length;
  const label = showCount && count > 0 ? `${triggerText} (${count}${countSuffix})` : triggerText;
  const { leftIcon = Upload, variant = 'line', ...restButton } = buttonProps;

  return (
    <Popover
      placement={placement}
      menuWidth={menuWidth}
      open={open}
      onOpenChange={onOpenChange}
      disabled={disabled}
      className={className}
      trigger={
        <Button variant={variant} leftIcon={leftIcon} disabled={disabled} {...restButton}>
          {label}
        </Button>
      }
    >
      <FileUploadMenu files={files} width="100%" {...menuProps} />
    </Popover>
  );
}
