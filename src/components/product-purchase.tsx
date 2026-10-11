"use client";

import { useState } from "react";

type Props = {
  name: string;
  sizes?: string[];
  soldOut: boolean;
};

export function ProductPurchase({ name, sizes, soldOut }: Props) {
  const [size, setSize] = useState<string>();
  const [message, setMessage] = useState<{ text: string; error: boolean }>();

  function addToBag() {
    if (sizes && !size) {
      setMessage({ text: "Select a size to continue.", error: true });
      return;
    }
    // The cart does not exist yet; this only confirms the selection.
    setMessage({
      text: `${name}${size ? `, size ${size}` : ""} added to your bag.`,
      error: false,
    });
  }

  return (
    <div className="stack gap-6">
      {sizes && (
        <fieldset disabled={soldOut} className="min-w-0">
          <legend className="eyebrow mb-3 flex w-full justify-between">
            <span>Size{size ? `: ${size}` : ""}</span>
            <a href="/help/sizing" className="link-quiet text-muted">
              Size guide
            </a>
          </legend>
          <div className="grid grid-cols-5 gap-(--spacing-grid-gap)">
            {sizes.map((s) => (
              <label key={s} className="relative">
                <input
                  type="radio"
                  name="size"
                  value={s}
                  checked={size === s}
                  onChange={() => {
                    setSize(s);
                    setMessage(undefined);
                  }}
                  className="peer sr-only"
                />
                <span className="flex h-(--spacing-control) cursor-pointer items-center justify-center border text-body transition-colors peer-checked:border-border-strong peer-checked:bg-foreground peer-checked:text-background peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-disabled:cursor-not-allowed peer-disabled:text-muted md:hover:border-border-strong">
                  {s}
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      )}

      <button
        type="button"
        className="btn btn-block"
        disabled={soldOut}
        onClick={addToBag}
      >
        {soldOut ? "Sold out" : "Add to bag"}
      </button>

      <p
        role="status"
        className={`min-h-5 text-body ${message?.error ? "text-danger" : "text-success"}`}
      >
        {message?.text}
      </p>
    </div>
  );
}
