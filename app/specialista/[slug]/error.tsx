'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-8">
      <h2 className="text-2xl font-bold mb-4">Něco se pokazilo</h2>
      <p className="text-gray-600 mb-6">
        {error.message || 'Profil specialisty se nepodařilo načíst.'}
      </p>
      <button
        onClick={() => reset()}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Zkusit znovu
      </button>
    </div>
  );
}
