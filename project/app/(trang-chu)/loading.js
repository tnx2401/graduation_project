export default function Loading() {
  return (
    <div className="flex justify-center items-center fixed top-0 left-0 w-full h-full bg-white z-50">
      <div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}
