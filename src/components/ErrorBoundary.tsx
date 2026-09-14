import React, { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends (React.Component as unknown as {
  new (props: Props): {
    props: Props;
    state: State;
    setState: (updater: Partial<State> | ((prevState: State) => Partial<State>)) => void;
    render(): ReactNode;
  };
}) {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: any) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
  }

  public render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback !== undefined) {
        return this.props.fallback;
      }
      return (
        <div className="w-full p-4 my-2 rounded-xl bg-slate-900/95 border border-rose-500/40 text-rose-200 text-xs flex flex-col items-center justify-center gap-2 select-none">
          <span className="font-bold text-sm text-rose-300">⚠️ حدث خطأ غير متوقع</span>
          <p className="text-[11px] text-slate-400 text-center max-w-xs">
            {this.state.error?.message || 'تعذر تحميل العنصر المطلوب مؤقتاً'}
          </p>
          <button
            type="button"
            onClick={() => this.setState({ hasError: false, error: null })}
            className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded-lg font-bold text-xs cursor-pointer active:scale-95 transition-all"
          >
            إعادة المحاولة
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
