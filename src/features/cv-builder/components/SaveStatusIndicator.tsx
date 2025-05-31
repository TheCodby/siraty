"use client";

import React, { useState, useEffect } from "react";
import { CheckIcon, CloudIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

interface SaveStatusIndicatorProps {
  isDataLoaded: boolean;
  lastUpdated?: string;
  onClearData?: () => boolean;
  className?: string;
}

export const SaveStatusIndicator: React.FC<SaveStatusIndicatorProps> = ({
  isDataLoaded,
  lastUpdated,
  onClearData,
  className,
}) => {
  const t = useTranslations("cvBuilder.persistence");
  const tCommon = useTranslations("common");
  const [showSavedMessage, setShowSavedMessage] = useState(false);
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  // Show "data saved" message briefly when data changes
  useEffect(() => {
    if (isDataLoaded && lastUpdated) {
      setShowSavedMessage(true);
      const timer = setTimeout(() => setShowSavedMessage(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [lastUpdated, isDataLoaded]);

  const formatLastSaved = (dateString?: string) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "";
    }
  };

  const handleClearData = () => {
    if (onClearData) {
      const success = onClearData();
      if (success) {
        setShowConfirmClear(false);
      }
    }
  };

  return (
    <div
      className={cn(
        "flex items-center space-x-2 rtl:space-x-reverse text-sm",
        className
      )}
    >
      {/* Auto-save indicator */}
      <div className="flex items-center space-x-1 rtl:space-x-reverse text-green-600">
        <CloudIcon className="h-4 w-4" />
        <span className="font-medium">{t("autoSave")}</span>
      </div>

      {/* Save status */}
      {showSavedMessage && (
        <div className="flex items-center space-x-1 rtl:space-x-reverse text-green-600 animate-fade-in">
          <CheckIcon className="h-4 w-4" />
          <span>{t("dataSaved")}</span>
        </div>
      )}

      {/* Last saved time */}
      {lastUpdated && !showSavedMessage && (
        <span className="text-gray-500">
          {t("lastSaved", { time: formatLastSaved(lastUpdated) })}
        </span>
      )}

      {/* Clear data button */}
      {onClearData && (
        <div className="relative">
          <button
            onClick={() => setShowConfirmClear(!showConfirmClear)}
            className="flex items-center space-x-1 rtl:space-x-reverse text-red-600 hover:text-red-700 transition-colors"
            title={t("clearData")}
          >
            <TrashIcon className="h-4 w-4" />
            <span>{t("clearData")}</span>
          </button>

          {/* Confirmation dialog */}
          {showConfirmClear && (
            <div className="absolute top-full left-0 rtl:left-auto rtl:right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4 min-w-64 z-50">
              <p className="text-gray-700 mb-3 text-sm">
                {t("clearDataConfirm")}
              </p>
              <div className="flex space-x-2 rtl:space-x-reverse">
                <button
                  onClick={handleClearData}
                  className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
                >
                  {t("clearData")}
                </button>
                <button
                  onClick={() => setShowConfirmClear(false)}
                  className="bg-gray-200 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-300 transition-colors"
                >
                  {tCommon("cancel")}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
