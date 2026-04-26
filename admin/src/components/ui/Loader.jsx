export default function Loader({ text = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4 animate-fade-in">
      <div className="w-10 h-10 border-3 border-gray-border border-t-primary rounded-full animate-spin" />
      <p className="text-sm text-gray-warm">{text}</p>
    </div>
  );
}
