import React, { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
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
      const isChunkError =
        this.state.error?.message?.includes('dynamically imported module') ||
        this.state.error?.message?.includes('Failed to fetch') ||
        this.state.error?.name === 'ChunkLoadError';

      return (
        <div className="w-full p-4 my-2 rounded-xl bg-slate-900/95 border border-amber-500/40 text-amber-200 text-xs flex flex-col items-center justify-center gap-2 select-none">
          <span className="font-bold text-sm text-amber-300">
            {isChunkError ? '🔄 تحديث المكونات الصوتية' : '⚠️ حدث خطأ غير متوقع'}
          </span>
          <p className="text-[11px] text-slate-300 text-center max-w-xs">
            {isChunkError
              ? 'تم تحديث خوادم الصوت اللحظي، يرجى إعادة المحاولة للاتصال الفوري'
              : this.state.error?.message || 'تعذر تحميل العنصر المطلوب مؤقتاً'}
          </p>
          <button
            type="button"
            onClick={() => {
              if (isChunkError && typeof window !== 'undefined') {
                window.location.reload();
              } else {
                this.setState({ hasError: false, error: null });
              }
            }}
            className="px-4 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-lg text-xs cursor-pointer active:scale-95 transition-all shadow-md shadow-amber-500/20"
          >
            {isChunkError ? 'تحديث والاتصال الآن' : 'إعادة المحاولة'}
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
