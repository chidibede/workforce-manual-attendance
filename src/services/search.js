import { useQuery } from "@tanstack/react-query";
import supabase from "./supabase";

const searchWorkers = async (searchParams) => {
  if (!searchParams) return [];
  const { data, error } = await supabase.rpc("get_search_results", {
    search_text: searchParams.trim(),
  });
  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error("Worker not found");
  }
  return data;
};

export const useSearchWorker = (searchParams) => {
  return useQuery({
    queryKey: [searchParams],
    queryFn: () => searchWorkers(searchParams),
  });
};
