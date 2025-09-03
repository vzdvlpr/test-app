import { useEffect } from 'react';
import { createPortal } from 'react-dom';

export interface ContextMenuProps<RowT> {
  open: boolean;
  x: number;
  y: number;
  row: RowT | null;
  onClose: () => void;
  children?: (ctx: { row: RowT | null; close: () => void }) => JSX.Element;
}

function ContextMenu<RowT>({ open, x, y, row, onClose, children }: ContextMenuProps<RowT>) {
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  const menu = (
    <div
      style={{
        position: 'fixed',
        left: x,
        top: y,
        zIndex: 10000,
        background: '#fff',
        border: '1px solid #ddd',
        borderRadius: 6,
        boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
        padding: 8,
        minWidth: 160
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {children ? children({ row, close: onClose }) : null}
    </div>
  );

  return createPortal(
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'transparent'
      }}
    >
      {menu}
    </div>,
    document.body
  );
}

export default ContextMenu;
