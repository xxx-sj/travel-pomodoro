import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTodoStore } from '../store/todoStore';

type Props = { onClose: () => void };

/**
 * Draggable in-flight TODO list. Uses Framer Motion drag on the wrapper.
 * Interactive controls (input, buttons) call `stopPropagation` on pointer
 * events so they don't initiate a drag when the user clicks them.
 */
export default function TodoPanel({ onClose }: Props) {
  const todos = useTodoStore((s) => s.todos);
  const addTodo = useTodoStore((s) => s.addTodo);
  const toggleTodo = useTodoStore((s) => s.toggleTodo);
  const removeTodo = useTodoStore((s) => s.removeTodo);
  const clearDone = useTodoStore((s) => s.clearDone);
  const [input, setInput] = useState('');

  const remaining = todos.filter((t) => !t.done).length;
  const hasDone = todos.some((t) => t.done);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    addTodo(input);
    setInput('');
  }

  return (
    <motion.div
      drag
      dragMomentum={false}
      dragElastic={0.05}
      initial={{ y: '-50%' }}
      style={{
        position: 'fixed',
        top: '50%',
        right: 16,
        width: 300,
        maxHeight: 480,
        background: 'rgba(0,0,0,0.85)',
        backdropFilter: 'blur(8px)',
        borderRadius: 12,
        border: '1px solid rgba(255,255,255,0.2)',
        boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
        zIndex: 60,
        cursor: 'grab',
        touchAction: 'none',
        display: 'flex',
        flexDirection: 'column',
        color: 'white',
      }}
      whileDrag={{ cursor: 'grabbing' }}
    >
      {/* Header — drag handle */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-white/10 select-none">
        <div className="text-xs text-white/80">⠿ 할 일 {remaining > 0 && `(${remaining})`}</div>
        <button
          onClick={onClose}
          onPointerDown={(e) => e.stopPropagation()}
          className="text-white/50 hover:text-white text-xs leading-none"
          aria-label="닫기"
        >
          ✕
        </button>
      </div>

      {/* Add new */}
      <form
        onSubmit={submit}
        className="px-3 py-2 border-b border-white/10 flex gap-1"
        onPointerDown={(e) => e.stopPropagation()}
        style={{ cursor: 'default' }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="할 일 추가..."
          className="flex-1 px-2 py-1 text-xs bg-white/10 border border-white/20 rounded text-white placeholder:text-white/40 outline-none focus:border-orange-400"
        />
        <button type="submit" className="px-2.5 py-1 text-xs bg-orange-500/80 hover:bg-orange-500 rounded">
          추가
        </button>
      </form>

      {/* List */}
      <div
        className="overflow-y-auto flex-1 px-2 py-1"
        onPointerDown={(e) => e.stopPropagation()}
        style={{ cursor: 'default', maxHeight: 320 }}
      >
        {todos.length === 0 ? (
          <div className="text-xs text-white/40 text-center py-6">목록이 비어있어요</div>
        ) : (
          todos.map((t) => (
            <div key={t.id} className="flex items-center gap-2 py-1.5 group">
              {/* Circle check button */}
              <button
                onClick={() => toggleTodo(t.id)}
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                  t.done
                    ? 'bg-emerald-500 border-emerald-500'
                    : 'border-white/40 hover:border-white/80'
                }`}
                aria-label={t.done ? '완료 취소' : '완료 표시'}
              >
                {t.done && <span className="text-white text-[10px] leading-none">✓</span>}
              </button>
              <span
                className={`text-xs flex-1 break-words ${
                  t.done ? 'line-through text-white/40' : 'text-white/90'
                }`}
              >
                {t.text}
              </span>
              <button
                onClick={() => removeTodo(t.id)}
                className="text-white/30 hover:text-red-400 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="삭제"
              >
                ✕
              </button>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      {hasDone && (
        <div
          className="px-3 py-2 border-t border-white/10 text-right"
          onPointerDown={(e) => e.stopPropagation()}
          style={{ cursor: 'default' }}
        >
          <button
            onClick={clearDone}
            className="text-[10px] text-white/50 hover:text-white"
          >
            완료된 항목 삭제
          </button>
        </div>
      )}
    </motion.div>
  );
}
