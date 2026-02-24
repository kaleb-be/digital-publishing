"use client";

import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {EditPencilProps} from "@/lib/types";



export function EditPencil({ onClick, className, size = "icon" , variant="default", text}: EditPencilProps) {
  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      className={cn("h-7 w-7 shrink-0 opacity-60 hover:opacity-100", className)}
      onClick={onClick}
    >
      <Pencil className={cn(`${text ? "mr-1" : ""}`,"h-3.5 w-3.5")} />{text}
    </Button>
  );
}
