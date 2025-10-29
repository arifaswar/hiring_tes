export const FloatingCTA: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <div className="fixed right-6 top-24 z-40 rounded-xl bg-black/70 shadow-xl p-4">
    <h3 className="text-sm text-white">
      Recruit the best candidates
    </h3>
    <p className="text-xs text-white mt-1">
      Create jobs, invite, and hire with ease.
    </p>
    <button
      onClick={onClick}
      className="mt-3 w-full h-8 rounded-lg bg-[#01959f] text-white hover:brightness-95 transition"
    >
      Create a new job
    </button>
  </div>
);