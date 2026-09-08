"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useStore } from "@/lib/store";
import { Control, Priority, Task } from "@/lib/types";
import { Badge, Button, Card, Chip, Input, Select } from "@/components/ui";

type Filter = "all" | "today" | "in" | "ex";
type View = "list" | "board";

const FILTERS: { id: Filter; key: string }[] = [
  { id: "all", key: "filterAll" },
  { id: "today", key: "filterToday" },
  { id: "in", key: "filterIn" },
  { id: "ex", key: "filterEx" },
];

export default function TasksPage() {
  const t = useTranslations("tasks");
  const { state, addTask, cycleTask, deleteTask } = useStore();

  const [view, setView] = useState<View>("list");
  const [filter, setFilter] = useState<Filter>("all");
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<Priority>("P2");
  const [control, setControl] = useState<Control>("in");
  const [flash, setFlash] = useState<string | null>(null);

  const flashAnd = (msg: string, fn: () => void) => {
    fn();
    setFlash(msg);
    setTimeout(() => setFlash(null), 2200);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    flashAnd(t("added"), () =>
      addTask({ title: title.trim(), priority, control, dueToday: true })
    );
    setTitle("");
  };

  const visible = state.tasks.filter((x) => {
    switch (filter) {
      case "today":
        return x.dueToday;
      case "in":
        return x.control === "in";
      case "ex":
        return x.control === "ex";
      default:
        return true;
    }
  });

  return (
    <div>
      <div className="flex items-center gap-3">
        <h1 className="font-serif text-3xl font-semibold">{t("title")}</h1>
        <div className="ml-auto inline-flex gap-0.5 rounded-md border border-line bg-surface2 p-1">
          {(["list", "board"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`rounded-[10px] px-3.5 py-1.5 text-[13.5px] font-semibold transition-colors ${
                view === v ? "bg-surface text-ink shadow-card" : "text-soft"
              }`}
            >
              {v === "list" ? t("list") : t("board")}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4 mt-4 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <Chip key={f.id} active={filter === f.id} onClick={() => setFilter(f.id)}>
            {t(f.key)}
          </Chip>
        ))}
      </div>

      {flash && (
        <div className="mb-4 animate-fadeUp rounded-md bg-sageBg px-4 py-2.5 text-sm font-medium text-sage">
          {flash}
        </div>
      )}

      <Card className="mb-5">
        <form onSubmit={submit} className="flex flex-wrap items-center gap-2.5">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t("quickTitle")}
            className="min-w-40 flex-1"
          />
          <Select value={priority} onChange={(e) => setPriority(e.target.value as Priority)} className="w-20">
            <option>P1</option>
            <option>P2</option>
            <option>P3</option>
          </Select>
          <Select value={control} onChange={(e) => setControl(e.target.value as Control)} className="w-44">
            <option value="in">⭕ {t("inControl")}</option>
            <option value="ex">◌ {t("outControl")}</option>
          </Select>
          <Button type="submit">{t("add")}</Button>
        </form>
      </Card>

      {visible.length === 0 ? (
        <Card>
          <p className="py-5 text-center text-soft">{t("empty")}</p>
        </Card>
      ) : view === "list" ? (
        <div className="space-y-3">
          {visible.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onCycle={() => cycleTask(task.id)}
              onDelete={() => deleteTask(task.id)}
            />
          ))}
        </div>
      ) : (
        <Board tasks={visible} onCycle={cycleTask} />
      )}
    </div>
  );
}

function TaskCard({
  task,
  onCycle,
  onDelete,
}: {
  task: Task;
  onCycle: () => void;
  onDelete: () => void;
}) {
  const t = useTranslations("tasks");
  const done = task.status === "done";
  return (
    <Card className="animate-fadeUp group flex items-start gap-3.5">
      <button
        onClick={onCycle}
        aria-label="status"
        className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 text-sm transition-colors ${
          done ? "border-sage bg-sage text-white" : task.status === "doing" ? "border-accent text-accent" : "border-line"
        }`}
      >
        {done ? "✓" : task.status === "doing" ? "•" : ""}
      </button>
      <div className="min-w-0 flex-1">
        <div className={`text-[15px] font-medium ${done ? "text-soft line-through" : ""}`}>{task.title}</div>
        {task.note && <div className="mt-0.5 text-sm text-soft">{task.note}</div>}
        <div className="mt-2 flex flex-wrap gap-1.5">
          <Badge tone="neutral">{task.priority}</Badge>
          {task.dueToday && <Badge tone="accent">{t("today")}</Badge>}
          <Badge tone={task.control === "in" ? "sage" : "clay"}>
            {task.control === "in" ? t("inControl") : t("outControl")}
          </Badge>
          {task.reaction && <Badge tone="neutral">↳ {task.reaction}</Badge>}
        </div>
      </div>
      <button
        onClick={onDelete}
        className="min-h-9 rounded-md px-2.5 text-sm text-clay opacity-0 transition-opacity hover:bg-clayBg group-hover:opacity-100"
      >
        ✕
      </button>
    </Card>
  );
}

function Board({ tasks, onCycle }: { tasks: Task[]; onCycle: (id: string) => void }) {
  const t = useTranslations("tasks");
  const cols: { id: Task["status"]; key: string }[] = [
    { id: "todo", key: "colTodo" },
    { id: "doing", key: "colDoing" },
    { id: "done", key: "colDone" },
  ];
  return (
    <div className="grid gap-3.5 md:grid-cols-3">
      {cols.map((col) => (
        <div key={col.id} className="min-h-32 rounded-lg bg-surface2 p-3">
          <h4 className="mb-2.5 px-1 text-xs font-semibold uppercase tracking-[.08em] text-soft">{t(col.key)}</h4>
          <div className="space-y-2">
            {tasks
              .filter((x) => x.status === col.id)
              .map((task) => (
                <button
                  key={task.id}
                  onClick={() => onCycle(task.id)}
                  className="w-full rounded-md border border-line bg-surface p-3 text-left shadow-card transition-transform active:scale-[.98]"
                >
                  <div className="text-sm font-medium">{task.title}</div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    <Badge tone="neutral">{task.priority}</Badge>
                    <Badge tone={task.control === "in" ? "sage" : "clay"}>
                      {task.control === "in" ? "⭕" : "◌"}
                    </Badge>
                  </div>
                </button>
              ))}
            {tasks.filter((x) => x.status === col.id).length === 0 && (
              <p className="py-2 text-center text-sm text-soft">—</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
