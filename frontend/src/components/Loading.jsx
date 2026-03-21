export function Loading() {
  return (
    <div
      aria-label="Đang tải"
      className="flex min-h-screen flex-col items-center justify-center bg-background"
      role="status"
    >
      <div className="relative">
        <div className="h-20 w-20 animate-spin rounded-full border-4 border-transparent border-t-blue-400" />
        <div className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 animate-spin rounded-full border-4 border-transparent border-t-red-400" />
      </div>
    </div>
  );
}
