// 채용 코드 생성 모달 — SideNavigationTemplate 조립(좌 코드 카테고리 내비 + 우 코드 입력/목록).
// ModalTestPage에서 추출한 데모 조립(공용) — JobPositionTemplate의 '채용 분야 코드 등록' 버튼에서도 연다.
// 코드명 입력 후 추가(또는 Enter) → 하단 코드 목록 테이블에 추가. 내비는 개별 카테고리만('전체' 없음),
// 상단 '카테고리 추가'(+)로 카테고리를 실제로 추가할 수 있다(추가 즉시 선택 이동).
import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Modal } from '../components/Modal';
import { Button } from '../components/Button';
import { SideNavigationTemplate } from '../components/SideNavigationTemplate';
import { Field } from '../components/Field';
import { Input } from '../components/Input';
import { Table } from '../components/Table';

const CODE_CATS_INIT = {
  지역: ['경기', '서울', '부산'],
  직책: ['사원', '대리', '과장', '차장'],
  직무: ['개발자', '기획자', '디자이너', '마케터', '영업', '인사', '재무', '회계', '총무', '법무', '홍보', '데이터 분석가', '퍼블리셔', 'QA', 'PM', 'PO', '연구원', '구매', '물류', '고객지원'],
  경력: ['신입', '경력'],
};

export function CodeCreateModal({ open, onClose }) {
  const [cats, setCats] = useState(CODE_CATS_INIT);
  const [current, setCurrent] = useState('지역');
  const [draft, setDraft] = useState('');
  const [catSeq, setCatSeq] = useState(1);

  const menus = Object.entries(cats).map(([name, codes]) => ({ id: name, label: name, count: codes.length }));
  const rows = (cats[current] ?? []).map((name, i) => ({ id: `${current}-${i}`, no: i + 1, name }));
  const columns = [
    { key: 'no', label: '순서', width: 60 }, // 기본 셀 텍스트 = font-icon-5
    { key: 'name', label: '채용 코드명' },
  ];

  const addCode = () => {
    const name = draft.trim();
    if (!name) return;
    setCats((prev) => ({ ...prev, [current]: [...(prev[current] ?? []), name] }));
    setDraft('');
  };
  const addCategory = () => {
    const name = `새 카테고리 ${catSeq}`;
    setCatSeq((n) => n + 1);
    setCats((prev) => ({ ...prev, [name]: [] }));
    setCurrent(name);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="채용 코드 생성"
      size="lg"
      placement="top"
      cancelText="취소"
      confirmText="확인"
      onConfirm={onClose}
      footerStart={
        <Button variant="line" leftIcon={Plus} onClick={addCategory}>
          카테고리 추가
        </Button>
      }
      footerStartType="button"
    >
      <SideNavigationTemplate
        menus={menus}
        selectedId={current}
        onSelect={setCurrent}
        showAdd={false}
        height="fill"
      >
        <Field label="채용 코드명">
          <div className="flex items-center gap-spacing-5">
            <div className="min-w-0 flex-1">
              <Input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="채용 코드명을 입력하세요"
                width="100%"
                inputProps={{
                  onKeyDown: (e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addCode();
                    }
                  },
                }}
              />
            </div>
            <Button variant="line" leftIcon={Plus} onClick={addCode}>
              추가
            </Button>
          </div>
        </Field>
        <Table columns={columns} rows={rows} bordered minWidth={0} maxHeight="fill" className="min-h-0" emptyMessage="아직 코드가 없습니다. 위에서 추가해 보세요." />
      </SideNavigationTemplate>
    </Modal>
  );
}
