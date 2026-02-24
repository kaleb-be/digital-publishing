"use client";

import { useState } from "react";
import { COVER_PRESETS } from "@/lib/constants";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export function CoverSelector() {
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [customUrl, setCustomUrl] = useState("");
  const coverValue = customUrl.trim() || selectedPreset || "";

  return (
    <div className="space-y-2">
      <Label>Cover image</Label>
      <div className="flex flex-wrap gap-2">
        {COVER_PRESETS.map((p) => (
          <button
            key={p.id}
            type="button"
            className={`overflow-hidden rounded-md border-2 transition ${
              selectedPreset === p.url ? "border-zinc-900 dark:border-zinc-50" : "border-transparent hover:border-zinc-300"
            }`}
            onClick={() => {
              setSelectedPreset(p.url);
              setCustomUrl("");
            }}
          >
            <img src={p.url} alt="" className="h-24 w-16 object-cover" />
          </button>
        ))}
      </div>
      <div className="space-y-1">
        <Label className="text-xs">Or custom URL (Supabase Storage, etc.)</Label>
        <Input
          type="text"
          placeholder="https://..."
          value={customUrl}
          onChange={(e) => {
            setCustomUrl(e.target.value);
            if (e.target.value) setSelectedPreset(null);
          }}
        />
      </div>
      <input type="hidden" name="cover_url" value={coverValue} />
    </div>
  );
}
