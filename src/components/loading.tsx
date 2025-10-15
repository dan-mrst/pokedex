interface LoadingProps {
  message?: string;
}

export function Loading({ message = "読み込み中..." }: LoadingProps) {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="text-sm text-gray-600">{message}</p>
      </div>
    </div>
  );
}
