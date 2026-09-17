import {StopListTable} from "@/features/stop-list/ui/StopListTable";

export default function Page() {
  return (
    <main className="min-h-screen bg-[#F6F3EE] p-8">
      <h1 className="mb-6 text-2xl font-semibold text-[#171512]">Стоп-лист кухни</h1>
      <StopListTable />
    </main>
  );
}