export interface DisableSensorButtonProps<DataT> {
  data: DataT | null;
  close: () => void;
}

function DisableSensorButton<DataT>({
  data,
  close,
}: DisableSensorButtonProps<DataT>) {
  return (
    <button
      style={{
        width: '100%',
        textAlign: 'left',
        padding: '8px 10px',
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
      }}
      onClick={() => {
        // eslint-disable-next-line no-console
        console.log('Disable sensor for data:', data);
        close();
      }}
    >
      Disable sensor
    </button>
  );
}

export default DisableSensorButton;
