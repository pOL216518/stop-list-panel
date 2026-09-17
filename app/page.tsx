import { parseFilters } from "@/features/stop-list/model/filters";
import { Filters } from "@/features/stop-list/ui/Filters";
import {StopListTable} from "@/features/stop-list/ui/StopListTable";

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function Page({ searchParams }: PageProps) {

  const resolvedSearchParams = await searchParams;
  const filters = parseFilters(resolvedSearchParams);

  return (
    <main className="min-h-screen bg-[#F6F3EE] p-8">
      <h1 className="mb-6 text-2xl font-semibold text-[#171512]">Стоп-лист кухни</h1>
      <Filters filters={filters} />
      <StopListTable filters={filters} />
    </main>
  );
}