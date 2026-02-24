"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type MarkdownEditorProps = {
  name: string;
  defaultValue?: string;
};

export function MarkdownEditor({ name, defaultValue = "" }: MarkdownEditorProps) {
  const [value, setValue] = useState(defaultValue);

  const applyWrap = (before: string, after: string) => {
    const selection = window.getSelection();
    const textarea = document.getElementById(
      name
    ) as HTMLTextAreaElement | null;

    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const current = value;

    const selectedText = current.slice(start, end);
    const newText =
      current.slice(0, start) +
      before +
      selectedText +
      after +
      current.slice(end);

    setValue(newText);
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor={name}>Chapter content (Markdown)</Label>
          <div className="flex gap-1 text-xs">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => applyWrap("**", "**")}
            >
              Bold
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => applyWrap("*", "*")}
            >
              Italic
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => applyWrap("# ", "")}
            >
              Heading
            </Button>
          </div>
        </div>
        <Textarea
          id={name}
          name={name}
          className="h-72"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Write your chapter in Markdown..."
        />
      </div>
      <div className="space-y-2">
        <div className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
          Live preview
        </div>
        <div className="prose max-w-none rounded-md border border-zinc-200 bg-zinc-50 p-3 text-sm dark:border-zinc-700 dark:bg-zinc-900">
          <ReactMarkdown>{value || "_Nothing yet..._"}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}

