"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useStore } from "@/lib/store";
import { Control, Priority, Recur, Task, todayISO } from "@/lib/types";
import { Badge, Button, Card, Chip, Field, Input, Select } from "@/components/ui";

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
  const locale = useLocale();
  const { state, addTask, updateTask, cycleTask, deleteTask } = useStore();

  const [view, setView] = useState<View>("list");
  const [filter, setFilter] = useState<Filter>("all");
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<Priority>("P2");
  const [control, setControl] = useState<Control>("in");
  const [due, setDue] = useState<"today" | "tomorrow" | "none">("today");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [flash, setFlash] = useState<string | null>(null);

  const today = todayISO();
  const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);

  const flashAnd = (msg: string, fn: () => void) => {
    fn();
    setFlash(msg);
    setTimeout(() => setFlash(null), 2200);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    flashAnd(t("added"), () =>
      addTask({
        title: title.trim(),
        priority,
        control,
        dueToday: due === "today",
        dueDate: due === "none" ? undefined : due === "today" ? today : tomorrow,
      })
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

  const editing = editingId ? state.tasks.find((x) => x.id === editingId) : undefined;

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

      {editing && (
        <TaskEditor
          task={editing}
          today={today}
          tomorrow={tomorrow}
          locale={locale}
          onCancel={() => setEditingId(null)}
          onSave={(patch) => {
            updateTask(editing.id, patch);
            setEditingId(null);
          }}
        />
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
          <Select value={due} onChange={(e) => setDue(e.target.value as never)} className="w-36">
            <option value="today">{t("dueToday")}</option>
            <option value="tomorrow">{t("dueTomorrow")}</option>
            <option value="none">{t("dueNone")}</option>
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
              locale={locale}
              onCycle={() => cycleTask(task.id)}
              onEdit={() => setEditingId(editingId === task.id ? null : task.id)}
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

/* ---------- Редактор задачи (инлайн) ---------- */

function TaskEditor({
  task,
  today,
  tomorrow,
  locale,
  onSave,
  onCancel,
}: {
  task: Task;
  today: string;
  tomorrow: string;
  locale: string;
  onSave: (patch: Partial<Task>) => void;
  onCancel: () => void;
}) {
  const t = useTranslations("tasks");
  const [title, setTitle] = useState(task.title);
  const [note, setNote] = useState(task.note ?? "");
  const [priority, setPriority] = useState<Priority>(task.priority);
  const [control, setControl] = useState<Control>(task.control);
  const [reaction, setReaction] = useState(task.reaction ?? "");
  const [dueDate, setDueDate] = useState(task.dueDate ?? "");
  const [recur, setRecur] = useState<Recur>(task.recur ?? "none");

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave({
      title: title.trim(),
      note: note.trim() || undefined,
      priority,
      control,
      reaction: control === "ex" ? reaction.trim() || undefined : undefined,
      dueToday: dueDate === today,
      dueDate: dueDate || undefined,
      recur,
    });
  };

  return (
    <Card className="mb-5 animate-fadeUp border-l-4 border-l-accent">
      <div className="mb-3 text-xs font-semibold uppercase tracking-[.1em] text-soft">{t("edit")}</div>
      <form onSubmit={save} className="space-y-3.5">
        <Field label={t("titleField")}>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        </Field>
        <Field label={t("note")}>
          <Input value={note} onChange={(e) => setNote(e.target.value)} placeholder={t("notePh")} />
        </Field>
        <div className="flex flex-wrap gap-3">
          <Field label={t("priority")}>
            <Select value={priority} onChange={(e) => setPriority(e.target.value as Priority)} className="w-24">
              <option>P1</option>
              <option>P2</option>
              <option>P3</option>
            </Select>
          </Field>
          <Field label={t("due")}>
            <Input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-44"
              max="2030-12-31"
            />
          </Field>
          <Field label={t("recur")}>
            <Select value={recur} onChange={(e) => setRecur(e.target.value as Recur)} className="w-36">
              <option value="none">{t("recurNone")}</option>
              <option value="daily">{t("recurDaily")}</option>
              <option value="weekly">{t("recurWeekly")}</option>
            </Select>
          </Field>
        </div>
        <Field label={t("control")}>
          <div className="flex flex-wrap gap-2">
            <Chip active={control === "in"} onClick={() => setControl("in")}>
              {t("inControl")}
            </Chip>
            <Chip active={control === "ex"} onClick={() => setControl("ex")}>
              {t("outControl")}
            </Chip>
          </div>
        </Field>
        {control === "ex" && (
          <Field label={t("reaction")}>
            <Input value={reaction} onChange={(e) => setReaction(e.target.value)} placeholder={t("reactionPh")} />
          </Field>
        )}
        <div className="flex gap-2 pt-1">
          <Button type="submit">{t("save")}</Button>
          <Button type="button" variant="ghost" onClick={onCancel}>
            {t("cancel")}
          </Button>
        </div>
      </form>
      <div className="mt-3 text-xs text-soft">
        {dueDate === tomorrow ? t("dueTomorrow") : ""}
      </div>
    </Card>
  );
}

/* ---------- Карточка задачи ---------- */

function TaskCard({
  task,
  locale,
  onCycle,
  onEdit,
  onDelete,
}: {
  task: Task;
  locale: string;
  onCycle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const t = useTranslations("tasks");
  const done = task.status === "done";

  const dueLabel = task.dueDate
    ? new Date(task.dueDate + "T00:00:00").toLocaleDateString(locale === "ru" ? "ru-RU" : "en-US", {
        day: "numeric",
        month: "short",
      })
    : null;

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
          {!task.dueToday && dueLabel && <Badge tone="neutral">📅 {dueLabel}</Badge>}
          {task.recur !== "none" && <Badge tone="neutral">↻ {t(task.recur === "daily" ? "recurDaily" : "recurWeekly")}</Badge>}
          <Badge tone={task.control === "in" ? "sage" : "clay"}>
            {task.control === "in" ? t("inControl") : t("outControl")}
          </Badge>
          {task.reaction && <Badge tone="neutral">↳ {task.reaction}</Badge>}
        </div>
      </div>
      <div className="flex flex-col">
        <button
          onClick={onEdit}
          aria-label={t("edit")}
          className="flex h-9 w-9 items-center justify-center rounded-md text-sm text-soft transition-colors hover:bg-surface2"
        >
          ✎
        </button>
        <button
          onClick={onDelete}
          aria-label={t("delete")}
          className="flex h-9 w-9 items-center justify-center rounded-md text-sm text-clay transition-colors hover:bg-clayBg"
        >
          ✕
        </button>
      </div>
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
                    {task.recur !== "none" && <Badge tone="neutral">↻</Badge>}
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
