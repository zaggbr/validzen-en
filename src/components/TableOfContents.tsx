import { useState } from "react";
import { ChevronDown, List } from "lucide-react";
import type { ContentSection } from "@/types/database";

interface TableOfContentsProps {
  sections: ContentSection[];
}

const TableOfContents = ({ sections }: TableOfContentsProps) => {
  const [open, setOpen] = useState(false);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setOpen(false);
    }
  };

  return (
    <>
      <div className="rounded-lg border border-border bg-card p-4 lg:hidden">
        <button
          onClick={() => setOpen(!open)}
          className="flex w-full items-center justify-between"
        >
          <span className="flex items-center gap-2 text-sm font-semibold text-card-foreground uppercase tracking-widest">
            <List className="h-4 w-4" /> Table of Contents
          </span>
          <ChevronDown
            className={`h-4 w-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
          />
        </button>
        {open && (
          <nav className="mt-3 flex flex-col gap-2 border-t border-border pt-3">
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => scrollTo(s.id)}
                className="text-left text-sm text-muted-foreground hover:text-secondary transition-colors italic"
              >
                {s.heading}
              </button>
            ))}
          </nav>
        )}
      </div>

      <nav className="sticky top-24 hidden lg:block">
        <h4 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
          <List className="h-3.5 w-3.5" /> Table of Contents
        </h4>
        <div className="flex flex-col gap-2 border-l-2 border-border pl-4">
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => scrollTo(s.id)}
              className="text-left text-sm text-muted-foreground hover:text-secondary transition-colors italic"
            >
              {s.heading}
            </button>
          ))}
        </div>
      </nav>
    </>
  );
};

export default TableOfContents;
