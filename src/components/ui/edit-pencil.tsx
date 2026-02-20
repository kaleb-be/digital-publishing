"use client";

import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type EditPencilProps = {
  onClick?: () => void;
  className?: string;
  size?: "sm" | "default" | "lg" | "icon";
};

export function EditPencil({ onClick, className, size = "icon" }: EditPencilProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      size={size}
      className={cn("h-7 w-7 shrink-0 opacity-60 hover:opacity-100", className)}
      onClick={onClick}
    >
      <Pencil className="h-3.5 w-3.5" />
    </Button>
  );
}
