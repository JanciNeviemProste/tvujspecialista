'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Cookie, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function CookieConsent() {
  const t = useTranslations('cookies');
  const [visible, setVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      // Show after 1 second delay
      const timer = setTimeout(() => setVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setVisible(false);
  };

  const handleReject = () => {
    localStorage.setItem('cookie-consent', 'rejected');
    setVisible(false);
  };

  if (!isMounted) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4"
        >
          <div className="mx-auto max-w-4xl rounded-xl border bg-white dark:bg-card shadow-2xl p-6">
            <div className="flex items-start gap-4">
              <Cookie className="h-6 w-6 text-amber-500 shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-foreground mb-1">
                  {t('title')}
                </h3>
                <p className="text-sm text-gray-600 dark:text-muted-foreground mb-4">
                  {t('description')}
                </p>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={handleAccept}
                    className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                  >
                    {t('accept')}
                  </button>
                  <button
                    onClick={handleReject}
                    className="rounded-lg border border-gray-300 dark:border-border px-6 py-2 text-sm font-medium text-gray-700 dark:text-foreground hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-muted transition-colors"
                  >
                    {t('reject')}
                  </button>
                </div>
              </div>
              <button
                onClick={handleReject}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
