"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { Markdown } from "tiptap-markdown";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type TiptapEditorProps = {
  name: string;
  defaultValue?: string;
  onChange?: (markdown: string) => void;
  placeholder?: string;
  className?: string;
  editable?: boolean;
};

export function TiptapEditor({
  name,
  defaultValue = "",
  onChange,
  placeholder = "Write your chapter...",
  className,
  editable = true,
}: TiptapEditorProps) {
  const [markdownValue, setMarkdownValue] = useState(defaultValue);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder }),
      Markdown.configure({ html: false }),
    ],
    content: defaultValue,
    editable,
    editorProps: {
      attributes: {
        class: cn(
          "prose prose-sm max-w-none min-h-[200px] p-3 outline-none",
          "focus:outline-none"
        ),
      },
    },
    onUpdate: ({ editor }) => {
      const md = (editor.storage as { markdown?: { getMarkdown: () => string } })?.markdown?.getMarkdown?.() ?? "";
      setMarkdownValue(md);
      onChange?.(md);
    },
  });

  const syncContent = useCallback(() => {
    if (!editor || !defaultValue) return;
    if (editor.isEmpty && defaultValue) {
      editor.commands.setContent(defaultValue);
      setMarkdownValue(defaultValue);
    }
  }, [editor, defaultValue]);

  useEffect(() => {
    syncContent();
  }, [syncContent]);

  if (!editor) return null;

  return (
    <div className={cn("rounded-md border border-input bg-background", className)}>
      {editable && (
        <div className="flex gap-1 border-b border-input p-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={editor.isActive("bold") ? "bg-muted" : ""}
          >
            B
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={editor.isActive("italic") ? "bg-muted" : ""}
          >
            I
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={editor.isActive("heading", { level: 1 }) ? "bg-muted" : ""}
          >
            H1
          </Button>
        </div>
      )}
      <EditorContent editor={editor} />
      <input type="hidden" name={name} value={markdownValue} readOnly />
    </div>
  );
}
