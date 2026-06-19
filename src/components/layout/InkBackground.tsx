export default function InkBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none -z-10" aria-hidden="true">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 20% 50%, rgba(176,141,87,0.06) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(139,90,43,0.04) 0%, transparent 50%), radial-gradient(ellipse at 50% 80%, rgba(44,44,44,0.03) 0%, transparent 50%)",
        }}
      />
    </div>
  );
}
