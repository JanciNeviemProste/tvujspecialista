'use client';

import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQProps {
  items: FAQItem[];
}

export function FAQ({ items }: FAQProps) {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());

  const toggleItem = (index: number) => {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  return (
    <div className="divide-y divide-gray-200 dark:divide-border">
      {items.map((item, index) => {
        const isOpen = openItems.has(index);
        return (
          <div key={index} className="py-5">
            <button
              type="button"
              onClick={() => toggleItem(index)}
              className="flex w-full items-center justify-between text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-background rounded-sm"
              aria-expanded={isOpen}
            >
              <span className="pr-4 text-base font-semibold text-gray-900 dark:text-foreground sm:text-lg">
                {item.question}
              </span>
              <span className="ml-4 flex-shrink-0">
                {isOpen ? (
                  <Minus className="h-5 w-5 text-blue-600 dark:text-primary" />
                ) : (
                  <Plus className="h-5 w-5 text-gray-400 dark:text-muted-foreground" />
                )}
              </span>
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                isOpen ? 'mt-3 max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <p className="text-gray-600 dark:text-muted-foreground leading-relaxed pr-12">
                {item.answer}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
