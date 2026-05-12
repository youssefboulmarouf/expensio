export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-950 p-8">
      <div className="w-full max-w-sm">
        <p className="mb-8 text-center text-2xl font-bold text-white">Expensio</p>
        {children}
      </div>
    </div>
  );
}
