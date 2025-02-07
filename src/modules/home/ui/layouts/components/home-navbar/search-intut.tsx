import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";

export function SearchInput() {
  // TODO Add search functionality
  return (
    <form className="flex w-full max-w-[600px]">
      <div className="relative w-full">
        <Input
          type="text"
          placeholder="Search"
          className="w-full rounded-l-full border py-2 pl-4 pr-12 focus:border-blue-500 focus:outline-none focus-visible:ring-transparent"
        />
        {/* TODO add remove searchButton */}
      </div>
      <button
        type="submit"
        className="rounded-r-full border border-l-0 bg-gray-100 px-5 py-2.5 hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <SearchIcon className="size-4" />
      </button>
    </form>
  );
}
