type Props = { onResume: () => void; onAbort: () => void };

export default function ResumeModal({ onResume, onAbort }: Props) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 max-w-sm w-full space-y-4">
        <h3 className="text-xl font-bold">비행을 이어갈까요?</h3>
        <p className="text-slate-600 text-sm">진행 중이던 비행이 있어요. 계속 진행할지 삭제할지 선택하세요.</p>
        <div className="flex gap-3 justify-end">
          <button onClick={onAbort} className="px-4 py-2 text-slate-500">삭제</button>
          <button onClick={onResume} className="bg-orange-500 text-white px-6 py-2 rounded-lg">이어가기</button>
        </div>
      </div>
    </div>
  );
}
