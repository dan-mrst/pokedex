interface LoadingProps {
  message?: string;
}

export function Loading({ message = "読み込み中..." }: LoadingProps) {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="flex flex-col items-center gap-4">
        <div
          className="animate-spin rounded-full h-8 w-8 bg-conic  to-secondary-200 from-secondary-500"
          style={{
            mask: "radial-gradient(farthest-side, #0000 calc(100% - 4px), #000 0)",
            clipPath:
              "polygon(0 0,30% 0,50% 50%, 80% 0,100% 0,100% 100%,0 100%)",
          }}
        ></div>
        <p className="text-sm text-gray-400">{message}</p>
      </div>
    </div>
  );
}
