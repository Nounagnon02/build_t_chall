export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ivory">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-6 border-2 border-champagne border-t-transparent rounded-full animate-spin" />
        <p className="font-elegant text-xl italic text-charbon/50">Chargement...</p>
      </div>
    </div>
  );
}
