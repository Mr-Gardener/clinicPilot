export default function Unauthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center text-center">
      <div>
        <h1 className="text-3xl font-bold">Unauthorized Access</h1>
        <p className="mt-2 text-gray-600">
          You don’t have permission for this page.
        </p>
      </div>
    </div>
  );
}
