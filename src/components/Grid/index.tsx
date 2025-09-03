import type React from 'react';
import {useCallback, useMemo, useState} from 'react';
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

  const toggleColumnByKey = useCallback((columnKey: string) => {
    setVisibleColumns((prev) => {
      const idx = prev.findIndex(({key}) => key === columnKey)
      if (idx !== -1) {
        return prev.filter((c) => c.key !== columnKey);
      } else {
        const col = columns.find(({key}) => key === columnKey )
        if (col) {
          return [...prev, col];
        }
        return prev;
      }
    } );
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
        onClose={() => setCellMenuOpen}
      >
        {() => (
          <div>
            <p>Показать/скрыть колонки</p>
            {columns.map(({key, name}) => {
              return (
                <div>
                  {name}
                  <input type="checkbox"
                         checked={!!visibleColumns.find(({key: visColKey}) =>  visColKey === key)}
                         name={name as string}
                         onChange={() => toggleColumnByKey(key)}/>
                </div>
              );
            })}
          </div>
        )}
      </ContextMenu>
    </>
  );
};

export default Grid;
