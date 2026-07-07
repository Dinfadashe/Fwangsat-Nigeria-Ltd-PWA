import { ExpensesManager } from "@/components/forms/ExpensesManager";
import { createClient } from "@/lib/supabase/server";
import type { Expense } from "@/lib/types";

export default async function AdminExpensesPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("expenses").select("*").order("incurred_on", { ascending: false });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <span className="eyebrow">Finance</span>
        <h2 className="font-display text-xl font-semibold text-white mt-1">Expenses</h2>
        <p className="text-sm text-white/40 mt-1">Logged expenses feed directly into each business&apos;s profit &amp; loss.</p>
      </div>
      <ExpensesManager expenses={(data as Expense[]) ?? []} />
    </div>
  );
}
