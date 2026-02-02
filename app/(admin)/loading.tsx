export default function Loading() {
  const height = '70';
  const width = '70';

  return (
    <div className={'min-h-screen flex items-center justify-center'}>
      <div
        className="relative border-4 border-gray-200 rounded-full animate-spin"
        style={{
          width: `${width}px`,
          height: `${height}px`,
          borderTopColor: 'rgb(0 0 0)', 
        }}
      />
    </div>
  );
}