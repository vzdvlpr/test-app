const originalString = `

export interface DisableSensorButtonProps<DataT> {
  data?: DataT | null;
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
        //alert("Disable sensor for data: {data?.toString() || ''}" );
        close();
      }}
    >
      Отключить сенсор
    </button>
  );
}

export default DisableSensorButton;


`;
const encodedString = Buffer.from(originalString).toString('base64');
// console.log(encodedString);

const encStr =
  'CgpleHBvcnQgaW50ZXJmYWNlIERpc2FibGVTZW5zb3JCdXR0b25Qcm9wczxEYXRhVD4gewogIGRhdGE/OiBEYXRhVCB8IG51bGw7CiAgY2xvc2U6ICgpID0+IHZvaWQ7Cn0KCmZ1bmN0aW9uIERpc2FibGVTZW5zb3JCdXR0b248RGF0YVQ+KHsKICBkYXRhLAogIGNsb3NlLAp9OiBEaXNhYmxlU2Vuc29yQnV0dG9uUHJvcHM8RGF0YVQ+KSB7CiAgcmV0dXJuICgKICAgIDxidXR0b24KICAgICAgc3R5bGU9e3sKICAgICAgICB3aWR0aDogJzEwMCUnLAogICAgICAgIHRleHRBbGlnbjogJ2xlZnQnLAogICAgICAgIHBhZGRpbmc6ICc4cHggMTBweCcsCiAgICAgICAgYmFja2dyb3VuZDogJ3RyYW5zcGFyZW50JywKICAgICAgICBib3JkZXI6ICdub25lJywKICAgICAgICBjdXJzb3I6ICdwb2ludGVyJywKICAgICAgfX0KICAgICAgb25DbGljaz17KCkgPT4gewogICAgICAgIC8vYWxlcnQoIkRpc2FibGUgc2Vuc29yIGZvciBkYXRhOiB7ZGF0YT8udG9TdHJpbmcoKSB8fCAnJ30iICk7CiAgICAgICAgY2xvc2UoKTsKICAgICAgfX0KICAgID4KICAgICAg0J7RgtC60LvRjtGH0LjRgtGMINGB0LXQvdGB0L7RgAogICAgPC9idXR0b24+CiAgKTsKfQoKZXhwb3J0IGRlZmF1bHQgRGlzYWJsZVNlbnNvckJ1dHRvbjsKCgo=';
const decodedString = Buffer.from(encStr, 'base64').toString('utf8');
console.log(decodedString);
