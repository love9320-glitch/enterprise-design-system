// ImageUploadMenu — 이미지 업로드 팝오버 (Figma popover menu / type=upload image)
//
// PopoverMenu 컨테이너를 조립한다(규칙 4): 안내 박스 + 이미지 미리보기 + 푸터.
// 프레젠테이셔널(controlled) — image(미리보기 URL)는 호출부가 소유.
//   - image 있음: 미리보기 + 푸터 [파일 삭제(line) · 파일 찾기(fill)]
//   - image 없음(empty): 미리보기·삭제 없이 전체폭 '파일 찾기'만
//
// ⚠️ 주의: guide(화면 안내 문구)와 accept(실제 파일 선택창 필터)는 **별개 prop**이라
//    자동 연동되지 않는다. 표시 확장자와 실제 허용 확장자가 어긋나지 않도록 **둘을 직접 일치**시킬 것.
//    (예: guide '… .jpeg, .png, .webp …' ↔ accept '.jpeg,.png,.webp')
import { useRef } from 'react';
import { PopoverMenu } from './PopoverMenu';

export function ImageUploadMenu({
  image,                   // 미리보기 이미지 URL (없으면 empty)
  guide,                   // 안내 문구(여러 줄은 \n)
  accept,                  // <input accept> 실제 필터 (예: '.jpeg,.png,.webp'). ⚠️ guide 표시와 직접 일치시킬 것
  onSelect,                // (File) => void — '파일 찾기'로 선택
  onRemove,                // () => void — '파일 삭제'
  findText = '파일 찾기',
  removeText = '파일 삭제',
  imageAlt = '업로드 이미지 미리보기',
  width = 320,
  className = '',
  ...props
}: any) {
  const inputRef = useRef(null);

  const openPicker = () => inputRef.current?.click();
  const handleChange = (e) => {
    if (e.target.files?.[0]) onSelect?.(e.target.files[0]);
    e.target.value = '';
  };

  return (
    <PopoverMenu
      width={width}
      className={className}
      footer
      footerButtonsFill
      showCancel={!!image}
      cancelText={removeText}
      onCancel={onRemove}
      confirmText={findText}
      onConfirm={openPicker}
      {...props}
    >
      {guide != null && (
        <div className="bg-list-group-bg px-spacing-6 py-spacing-5">
          <p className="whitespace-pre-line text-14 text-list-default-text">{guide}</p>
        </div>
      )}

      {image && (
        <div className="bg-list-group-bg p-spacing-5">
          {/* 높이 360px 초과 시 360에서 잘라 보여준다(clip, 가운데 기준 — 위·아래 균등 크롭) */}
          <div className="flex max-h-[360px] w-full items-center overflow-hidden rounded-round-4">
            <img src={image} alt={imageAlt} className="block w-full shrink-0" />
          </div>
        </div>
      )}

      <input ref={inputRef} type="file" accept={accept} hidden onChange={handleChange} />
    </PopoverMenu>
  );
}
