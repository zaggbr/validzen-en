import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { DimensionRow } from "@/types/database";

export function useDimensions() {
  return useQuery({
    queryKey: ["dimensions"],
    queryFn: async (): Promise<DimensionRow[]> => {
      const { data, error } = await supabase
        .from("dimensions")
        .select("*")
        .order("slug", { ascending: true });

      if (error) throw error;
      return (data || []) as DimensionRow[];
    },
  });
}

/** Helper to get localized dimension name */
export function getDimensionName(dim: DimensionRow, locale: string): string {
  return locale === "en" ? dim.name_en : dim.name_pt;
}

/** Helper to get interpretation based on score */
export function getDimensionInterpretation(dim: DimensionRow, score: number, locale: string): string {
  if (score <= 33) return locale === "en" ? dim.interpretation_low_en : dim.interpretation_low_pt;
  if (score <= 66) return locale === "en" ? dim.interpretation_moderate_en : dim.interpretation_moderate_pt;
  return locale === "en" ? dim.interpretation_high_en : dim.interpretation_high_pt;
}
