import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Plus, CheckCircle2, CalendarClock } from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";

export type Reminder = {
  id: string;
  title: string;
  date: string;   // YYYY-MM-DD
  time: string;   // HH:mm
  notes?: string;
  repeat: "none" | "daily" | "weekly";
  done: boolean;
  createdAt: number;
};

type Props = {
  storageKey?: string;         // so you can scope per-user/farm later
  defaultTitleHint?: string;   // e.g. “Irrigate paddy field”
};

export function RemindersCard({ storageKey = "agri.reminders", defaultTitleHint = "e.g., Irrigate paddy field" }: Props) {
  const [items, setItems, reset] = useLocalStorage<Reminder[]>(storageKey, []);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState<string>(() => new Date().toISOString().slice(0, 10));
  const [time, setTime] = useState("07:00");
  const [repeat, setRepeat] = useState<Reminder["repeat"]>("none");
  const [notes, setNotes] = useState("");

  function add() {
    if (!title.trim()) return;
    const r: Reminder = {
      id: crypto.randomUUID(),
      title: title.trim(),
      date,
      time,
      repeat,
      notes: notes.trim() || undefined,
      done: false,
      createdAt: Date.now(),
    };
    setItems([r, ...items]);
    setTitle("");
    setNotes("");
  }

  function toggleDone(id: string) {
    setItems(items.map(r => r.id === id ? { ...r, done: !r.done } : r));
  }

  function remove(id: string) {
    setItems(items.filter(r => r.id !== id));
  }

  const upcoming = useMemo(() => {
    return [...items].sort((a, b) => {
      const ad = new Date(`${a.date}T${a.time}:00`).getTime();
      const bd = new Date(`${b.date}T${b.time}:00`).getTime();
      return ad - bd;
    });
  }, [items]);

  return (
    <Card className="p-6 shadow-md border border-emerald-200 bg-white/80 backdrop-blur-md animate-fade-in-up">
      <div className="flex items-center gap-2 mb-4">
        <CalendarClock className="w-5 h-5 text-emerald-700" />
        <h2 className="text-xl font-bold text-emerald-800">Farmer Reminders</h2>
      </div>

      {/* Add form */}
      <div className="grid md:grid-cols-5 gap-2 mb-4">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={defaultTitleHint}
          className="md:col-span-2"
        />
        <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
        <Select value={repeat} onValueChange={(v) => setRepeat(v as any)}>
          <SelectTrigger><SelectValue placeholder="Repeat" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="none">No repeat</SelectItem>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
          </SelectContent>
        </Select>
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Notes (optional: fertilizer type, quantity, etc.)"
          className="md:col-span-5"
        />
        <div className="md:col-span-5 flex gap-2">
          <Button onClick={add} className="bg-emerald-600 hover:bg-emerald-500">
            <Plus className="w-4 h-4 mr-1" /> Add Task
          </Button>
          <Button variant="outline" onClick={reset}>Clear All</Button>
        </div>
      </div>

      {/* List */}
      {upcoming.length === 0 ? (
        <div className="text-sm text-muted-foreground">No reminders yet. Add your first task above.</div>
      ) : (
        <div className="space-y-2">
          {upcoming.map((r) => {
            const dt = new Date(`${r.date}T${r.time}:00`);
            const label = dt.toLocaleString([], { dateStyle: "medium", timeStyle: "short" });
            return (
              <div key={r.id} className="flex items-start justify-between border rounded-lg p-3 hover:bg-emerald-50 transition">
                <div className="flex items-start gap-3">
                  <Checkbox checked={r.done} onCheckedChange={() => toggleDone(r.id)} />
                  <div>
                    <div className={`font-medium ${r.done ? "line-through text-muted-foreground" : ""}`}>
                      {r.title} {r.repeat !== "none" && <span className="text-xs text-emerald-700 ml-1">({r.repeat})</span>}
                    </div>
                    <div className="text-xs text-muted-foreground">{label}</div>
                    {r.notes && <div className="text-sm mt-1">{r.notes}</div>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {r.done && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                  <Button variant="ghost" size="icon" onClick={() => remove(r.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
