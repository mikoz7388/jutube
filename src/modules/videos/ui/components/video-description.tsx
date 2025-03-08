import { cn } from "@/lib/utils";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { useState } from "react";

interface VideoDescriptionProps {
  compactViews: string;
  expandedViews: string;
  compactDate: string;
  expandedDate: string;
  description?: string | null;
}

export function VideoDescription({
  compactDate,
  compactViews,
  expandedDate,
  expandedViews,
  description,
}: VideoDescriptionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <button
      type="button"
      onClick={() => setIsExpanded((cur) => !cur)}
      className="w-full cursor-pointer rounded-xl bg-secondary/50 p-3 text-left transition hover:bg-secondary/70"
    >
      <div className="mb-2 flex gap-2 text-sm">
        <span className="font-medium">
          {isExpanded ? expandedViews : compactViews} views
        </span>
        <span className="font-medium">
          {isExpanded ? expandedDate : compactDate}
        </span>
      </div>
      <div className="relative">
        <p
          className={cn(
            "whitespace-pre-wrap text-sm",
            !isExpanded && "line-clamp-2",
          )}
        >
          {description || "No description"}
        </p>
        <div className="mt-4 flex items-center gap-2 text-sm font-medium">
          {isExpanded ? (
            <>
              Show less <ChevronUpIcon className="size-4" />
            </>
          ) : (
            <>
              Show more <ChevronDownIcon className="size-4" />
            </>
          )}
        </div>
      </div>
    </button>
  );
}
