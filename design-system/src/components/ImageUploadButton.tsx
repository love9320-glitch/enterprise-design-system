// ImageUploadButton — 버튼 트리거 + 이미지 업로드 팝오버 (Figma butto+ image upload)
//
// Button을 트리거로 Popover에 ImageUploadMenu를 붙인다(규칙 4 조립).
//  - 모든 Button 스타일 사용 가능: buttonProps로 variant/size/leftIcon 등 그대로 통과.
// 이미지 상태는 호출부가 소유(컨트롤드) — ImageUploadMenu props(image/onSelect/onRemove 등)를 그대로 받는다.
import { Image as ImageIcon } from 'lucide-react';
import { Button } from './Button';
import { Popover } from './Popover';
import { ImageUploadMenu } from './ImageUploadMenu';

export function ImageUploadButton({
  // ── 트리거 버튼 ──
  triggerText = '이미지 등록',
  buttonProps = {},            // 모든 Button 스타일 props 통과. 기본 variant=line·leftIcon=Image
  // ── 팝오버 ──
  placement = 'bottom-left',
  menuWidth = 320,             // 팝오버(=ImageUploadMenu) 너비
  open,
  onOpenChange,
  disabled = false,
  className = '',
  // ── 나머지는 ImageUploadMenu props(image/guide/accept/onSelect/onRemove/...) ──
  ...menuProps
}: any) {
  const { leftIcon = ImageIcon, variant = 'line', ...restButton } = buttonProps;

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
          {triggerText}
        </Button>
      }
    >
      <ImageUploadMenu width="100%" {...menuProps} />
    </Popover>
  );
}
