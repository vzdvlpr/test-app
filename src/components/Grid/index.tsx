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
  const [cellMenuOpen, setCellMenuOpen] = useState(false);
  const [headerCellMenuOpen, setHeaderCellMenuOpen] = useState(false);
  const [menuPos, setMenuPos] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [menuRow, setMenuRow] = useState<Row | null>(null);
  const [visibleColumns, setVisibleColumns] = useState<Column<Row>[]>(columns);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const toggleColumnByKey = useCallback((columnKey: string) => {
    setVisibleColumns((prev) => {
      const exists = prev.some(({ key }) => key === columnKey);
      if (exists) {
        return prev.filter((c) => c.key !== columnKey);
      } else {
        const col = columns.find(({ key }) => key === columnKey);
        if (!col) {
          return prev;
        }
        const newColumns: Column<Row>[] = [];
        for (const c of columns) {
          if (c.key === columnKey) {
            newColumns.push(col);
          } else if (prev.some((pc) => pc.key === c.key)) {
            newColumns.push(c);
          }
        }
        return newColumns;
      }
    });
  }, []);

  const onCellContextMenu = useCallback(
    (args: { row: Row }, event: React.MouseEvent) => {
      event.preventDefault();
      setMenuRow(args.row);
      setMenuPos({ x: event.clientX, y: event.clientY });
      setCellMenuOpen(true);
    },
    [],
  );

  const columnsWithHeaderMenu = useMemo(() => {
    return visibleColumns.map((c) => ({
      ...c,
      renderHeaderCell: (p: any) => (
        <div
          onContextMenu={(e) => {
            e.preventDefault();
            setMenuRow(null);
            setMenuPos({ x: e.clientX, y: e.clientY });
            setHeaderCellMenuOpen(true);
          }}
          style={{ cursor: 'context-menu' }}
        >
          {String(p.column.name ?? p.column.key)}
        </div>
      ),
    }));
  }, [visibleColumns]);

  return (
    <>

      <DataGrid
        className={theme === 'light' ? 'rdg-light' : 'rdg-dark'}
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
        open={cellMenuOpen}
        x={menuPos.x}
        y={menuPos.y}
        data={menuRow}
        onClose={() => setCellMenuOpen(false)}
      >
        {({ data, close }) => (
          <DisableSensorButton<Row> data={data} close={close} />
        )}
      </ContextMenu>

      <ContextMenu<unknown>
        open={headerCellMenuOpen}
        x={menuPos.x}
        y={menuPos.y}
        onClose={() => setHeaderCellMenuOpen(false)}
      >
        {() => (
          <div>
            Показать/скрыть колонки
            {columns.map(({ key, name }) => {
              return (
                <div key={key}>
                  {name}
                  <input
                    type="checkbox"
                    checked={
                      !!visibleColumns.find(
                        ({ key: visColKey }) => visColKey === key,
                      )
                    }
                    name={name as string}
                    onChange={() => toggleColumnByKey(key)}
                  />
                </div>
              );
            })}
            <div style={{marginTop: 8,display: 'flex', alignItems: 'center', gap: '8px' }}>
              <label htmlFor="theme-select">Тема:</label>
              <select
                id="theme-select"
                value={theme}
                onChange={(e) => setTheme(e.target.value as 'light' | 'dark')}
                style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #ccc' }}
              >
                <option value="light">Светлая</option>
                <option value="dark">Темная</option>
              </select>
            </div>
          </div>
        )}
      </ContextMenu>
    </>
  );
};

export default Grid;
