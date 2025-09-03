import React from 'react';

export interface DisableSensorButtonProps<RowT> {
  row: RowT | null;
  close: () => void;
}

function DisableSensorButton<RowT>({ row, close }: DisableSensorButtonProps<RowT>) {
  return (
    <button
      style={{
        width: '100%',
        textAlign: 'left',
        padding: '8px 10px',
        background: 'transparent',
        border: 'none',
        cursor: 'pointer'
      }}
      onClick={() => {
        // eslint-disable-next-line no-console
        console.log('Disable sensor for row:', row);
        close();
      }}
    >
      Disable sensor
    </button>
  );
}

export default DisableSensorButton;
