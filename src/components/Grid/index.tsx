import type React from 'react';
import { useCallback, useMemo, useState } from 'react';
import DataGrid, { type Column } from 'react-data-grid';
import rowsData from './mock.json';
import 'react-data-grid/lib/styles.css';
import ContextMenu from '../ContextMenu';
import DisableSensorButton from '../DisableSensorButton';

interface Row {
  id: number;
  sensor: string;
  kilometer: number;
  pressure: number;
  plannedPressure: number;
  deviation: string;
  head: number;
  density: number;
  height: number;
  correction: number;
}

const columns: Column<Row>[] = [
  { key: 'sensor', name: 'Датчик' },
  { key: 'kilometer', name: 'Километр' },
  { key: 'pressure', name: 'Давление' },
  { key: 'plannedPressure', name: 'Плановое давление' },
  { key: 'deviation', name: 'Отклонение' },
  { key: 'head', name: 'Напор' },
  { key: 'density', name: 'Плотность' },
  { key: 'height', name: 'Высота' },
  { key: 'correction', name: 'Коррекция' },
];

const rows: Row[] = rowsData as Row[];

const Grid: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPos, setMenuPos] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [menuRow, setMenuRow] = useState<Row | null>(null);

  const onCellContextMenu = useCallback(
    (args: { row: Row }, event: React.MouseEvent) => {
      event.preventDefault();
      setMenuRow(args.row);
      setMenuPos({ x: event.clientX, y: event.clientY });
      setMenuOpen(true);
    },
    [],
  );

  const columnsWithHeaderMenu = useMemo(() => {
    return columns.map((c) => ({
      ...c,
      renderHeaderCell: (p: any) => (
        <div
          onContextMenu={(e) => {
            e.preventDefault();
            setMenuRow(null);
            setMenuPos({ x: e.clientX, y: e.clientY });
            setMenuOpen(true);
          }}
          style={{ cursor: 'context-menu' }}
        >
          {String(p.column.name ?? p.column.key)}
        </div>
      ),
    }));
  }, []);

  return (
    <>
      <DataGrid
        className="rdg-light"
        columns={columnsWithHeaderMenu}
        rows={rows}
        rowKeyGetter={(row: Row) => row.id}
        onCellContextMenu={onCellContextMenu}
        defaultColumnOptions={{
          resizable: true,
          sortable: true,
        }}
      />
      <ContextMenu<Row>
        open={menuOpen}
        x={menuPos.x}
        y={menuPos.y}
        row={menuRow}
        onClose={() => setMenuOpen(false)}
      >
        {({ row, close }) => (
          <DisableSensorButton<Row> row={row} close={close} />
        )}
      </ContextMenu>
    </>
  );
};

export default Grid;
