import {StopListTable} from "@/features/stop-list/ui/StopListTable";

export default function Page() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-semibold mb-4">Стоп-лист кухни</h1>
      <StopListTable />
    </main>
  );
}