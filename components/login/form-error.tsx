import React from "react";
import { IoAlertCircle } from "react-icons/io5";

export default function FormError({ message }: { message: string }) {
  return (
    <div className="bg-destructiv/25 text-secondary-foreground p-3 rounded-md flex items-center gap-2">
      <IoAlertCircle className="w-4 h-4" />
      <p>{message}</p>
    </div>
  );
}
