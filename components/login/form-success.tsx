import React from "react";
import { IoCheckmarkCircle } from "react-icons/io5";

export default function FormSuccess({ message }: { message: string }) {
  return (
    <div className="bg-teal-400/25 p-3 text-secondary-foreground  rounded-md flex items-center gap-2">
      <IoCheckmarkCircle className="w-4 h-4" />
      <p>{message}</p>
    </div>
  );
}
