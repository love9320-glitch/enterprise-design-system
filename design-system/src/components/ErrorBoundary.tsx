import { Component } from 'react';
import { Button } from './Button';

interface ErrorBoundaryProps {
  children?: React.ReactNode;
  resetKey?: unknown;
  title?: string;
  description?: string;
  fallback?: (args: { error: Error; reset: () => void }) => React.ReactNode;
  onError?: (error: Error, info: React.ErrorInfo) => void;
}

interface ErrorBoundaryState {
  error: Error | null;
  prevResetKey?: unknown;
}

// ErrorBoundary — 자식(페이지) 렌더 중 던져진 에러를 잡아, 앱 전체(레이아웃·좌측 메뉴)가
// 언마운트되는 것을 막는다. 에러가 난 자리에만 안내를 표시하고, 나머지 셸은 그대로 유지된다.
// React에서 getDerivedStateFromError/componentDidCatch는 클래스 컴포넌트에서만 동작하므로 클래스로 둔다.
//
//   - resetKey: 이 값이 바뀌면(=다른 페이지로 이동) 에러를 자동 해제해 새 자식을 정상 렌더한다.
//   - title:    에러 화면 제목.
//   - description: 제목 아래 보조 안내 문구.
//   - fallback: ({ error, reset }) => node — 기본 UI 대신 직접 렌더하고 싶을 때.
//   - onError:  (error, info) => void — 에러 발생 시 콜백(로깅 등).
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { error: null, prevResetKey: props.resetKey };
    this.reset = this.reset.bind(this);
  }

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  // resetKey가 바뀌면(페이지 전환 등) 에러 상태를 비워 새 자식이 다시 렌더되게 한다.
  static getDerivedStateFromProps(props: ErrorBoundaryProps, state: ErrorBoundaryState) {
    if (props.resetKey !== state.prevResetKey) {
      return { error: null, prevResetKey: props.resetKey };
    }
    return null;
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // 원본 스택을 콘솔에 남겨 디버깅을 돕는다.
    console.error('[ErrorBoundary]', error, info);
    this.props.onError?.(error, info);
  }

  reset() {
    this.setState({ error: null });
  }

  render() {
    const { error } = this.state;
    const {
      children,
      title = '페이지를 표시할 수 없습니다.',
      description = '이 페이지를 렌더하는 중 오류가 발생했습니다. 다른 메뉴는 정상적으로 이용할 수 있습니다.',
      fallback,
    } = this.props;

    if (!error) return children;
    if (fallback) return fallback({ error, reset: this.reset });

    return (
      <div className="px-spacing-7 py-spacing-10 text-left">
        <h2 className="text-16 font-semibold text-font-icon-5">{title}</h2>
        <p className="mt-spacing-3 text-14 text-font-icon-3">{description}</p>
        <pre className="mt-spacing-6 overflow-auto whitespace-pre-wrap rounded-round-4 border border-gray-200 bg-gray-50 px-spacing-6 py-spacing-5 font-mono text-12 text-font-icon-4">
          {String(error?.message || error)}
        </pre>
        <div className="mt-spacing-6">
          <Button variant="line" size="32" onClick={this.reset}>
            다시 시도
          </Button>
        </div>
      </div>
    );
  }
}
