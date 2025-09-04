import {
  type ReactElement,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

export enum Position {
  LEFT = 'left',
  RIGHT = 'right',
  TOP_CENTER = 'top-center',
  TOP_LEFT = 'top-left',
  TOP_RIGHT = 'top-right',
  BOTTOM_CENTER = 'bottom-center',
  BOTTOM_LEFT = 'bottom-left',
  BOTTOM_RIGHT = 'bottom-right',
}

export interface ContextMenuProps<DataT> {
  isOpen: boolean;
  x: number;
  y: number;
  data?: DataT | null;
  onClose: () => void;
  position?: Position;
  children?: (ctx: { data?: DataT | null; close: () => void }) => ReactElement;
}

function ContextMenu<DataT>({
  isOpen,
  x,
  y,
  data,
  onClose,
  position = Position.BOTTOM_LEFT,
  children,
}: ContextMenuProps<DataT>) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [menuSize, setMenuSize] = useState({ width: 160, height: 100 }); // defaults

  useLayoutEffect(() => {
    if (isOpen && wrapperRef.current) {
      setMenuSize({
        width: wrapperRef.current.offsetWidth,
        height: wrapperRef.current.offsetHeight,
      });
    }
  }, [isOpen]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        event.target instanceof Node &&
        !wrapperRef.current.contains(event.target)
      ) {
        onClose();
      }
    }

    document.addEventListener('mousedown', handleClickOutside, false);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside, false);
    };
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onClose();
      }
    }
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  // Calculate position based on actual size
  const getPositionStyles = () => {
    const { width: menuWidth, height: menuHeight } = menuSize;

    switch (position) {
      case Position.LEFT:
        return { left: x - menuWidth, top: y };
      case Position.RIGHT:
        return { left: x, top: y };
      case Position.TOP_CENTER:
        return { left: x - menuWidth / 2, top: y - menuHeight };
      case Position.TOP_LEFT:
        return { left: x - menuWidth, top: y - menuHeight };
      case Position.TOP_RIGHT:
        return { left: x, top: y - menuHeight };
      case Position.BOTTOM_CENTER:
        return { left: x - menuWidth / 2, top: y };
      case Position.BOTTOM_LEFT:
        return { left: x - menuWidth, top: y };
      case Position.BOTTOM_RIGHT:
      default:
        return { left: x, top: y };
    }
  };

  const positionStyles = getPositionStyles();

  const menu = (
    <div
      ref={wrapperRef}
      style={{
        position: 'fixed',
        left: positionStyles.left,
        top: positionStyles.top,
        zIndex: 10000,
        background: '#fff',
        border: '1px solid #ddd',
        borderRadius: 6,
        boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
        padding: 8,
        minWidth: 160,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {children ? children({ data, close: onClose }) : null}
    </div>
  );

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'transparent',
      }}
    >
      {menu}
    </div>
  );
}

export default ContextMenu;
