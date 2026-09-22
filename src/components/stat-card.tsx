import type { LucideIcon } from "lucide-react";
export function StatCard({ label, value, detail, Icon }: { label: string; value: string; detail: string; Icon: LucideIcon }) {
  return <div className="rounded-md border border-border bg-card p-4 sm:p-5"><div className="flex items-center justify-between"><p className="text-xs font-semibold text-muted-foreground">{label}</p><Icon className="size-4 text-primary" /></div><p className="mt-3 font-display text-2xl font-bold">{value}</p><p className="mt-1 text-xs text-muted-foreground">{detail}</p></div>
}