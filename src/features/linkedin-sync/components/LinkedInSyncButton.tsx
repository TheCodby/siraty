"use client";

import { useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { useTranslations, useLocale } from "next-intl";
import { LinkedInCVData } from "../types";

interface LinkedInSyncButtonProps {
  onSyncComplete?: (data: LinkedInCVData) => void;
  onSyncError?: (error: string) => void;
  className?: string;
}

export const LinkedInSyncButton = ({
  onSyncComplete,
  onSyncError,
  className = "",
}: LinkedInSyncButtonProps) => {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const t = useTranslations("linkedIn");
  const locale = useLocale();
  const isRTL = locale === "ar";

  const handleConnect = async () => {
    try {
      setIsLoading(true);
      await signIn("linkedin", {
        callbackUrl: window.location.href,
      });
    } catch (error) {
      console.error("LinkedIn connection failed:", error);
      onSyncError?.(t("errors.authFailed"));
      setIsLoading(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      setIsLoading(true);
      await signOut({ redirect: false });
    } catch (error) {
      console.error("LinkedIn disconnection failed:", error);
      onSyncError?.(t("errors.networkError"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleImportProfile = async () => {
    if (!session?.user) {
      onSyncError?.(t("errors.noSession"));
      return;
    }

    try {
      setIsLoading(true);

      // Extract basic profile data from NextAuth session
      const linkedInData: LinkedInCVData = {
        personalInfo: {
          fullName: session.user.name || "",
          email: session.user.email || "",
          profilePicture: session.user.image || "",
        },
        // Work experience, education, and skills are not available
        // with basic LinkedIn OAuth permissions
        workExperience: [],
        education: [],
        skills: [],
      };

      onSyncComplete?.(linkedInData);
    } catch (error) {
      console.error("Profile import failed:", error);
      onSyncError?.(t("errors.importFailed"));
    } finally {
      setIsLoading(false);
    }
  };

  const baseClasses =
    "inline-flex items-center justify-center px-4 py-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variantClasses = {
    primary: "bg-[#0077B5] hover:bg-[#005885] text-white focus:ring-[#0077B5]",
    secondary:
      "bg-gray-100 hover:bg-gray-200 text-gray-900 focus:ring-gray-500",
    outline:
      "border border-[#0077B5] text-[#0077B5] hover:bg-[#0077B5] hover:text-white focus:ring-[#0077B5]",
  };

  const iconDirection = isRTL ? "ml-2" : "mr-2";

  if (status === "loading") {
    return (
      <div
        className={`${baseClasses} ${variantClasses.secondary} ${className}`}
      >
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
        <span className={iconDirection}>{t("checkingConnection")}</span>
      </div>
    );
  }

  if (session?.user) {
    return (
      <div className={`space-y-2 ${isRTL ? "text-right" : "text-left"}`}>
        <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-md">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span
              className={`text-sm text-green-700 ${isRTL ? "mr-2" : "ml-2"}`}
            >
              {t("connected")}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            {session.user.image && (
              <img
                src={session.user.image}
                alt=""
                className="w-6 h-6 rounded-full"
              />
            )}
            <span className="text-sm text-green-700">
              {t("connectedAs")} {session.user.name}
            </span>
          </div>
        </div>

        <div
          className={`flex gap-2 ${isRTL ? "flex-row-reverse" : "flex-row"}`}
        >
          <button
            onClick={handleImportProfile}
            disabled={isLoading}
            className={`${baseClasses} ${variantClasses.primary} ${className}`}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span className={iconDirection}>{t("importing")}</span>
              </>
            ) : (
              <>
                <svg
                  className={`w-4 h-4 ${iconDirection}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                {t("import")}
              </>
            )}
          </button>

          <button
            onClick={handleDisconnect}
            disabled={isLoading}
            className={`${baseClasses} ${variantClasses.outline} ${className}`}
          >
            {t("disconnect")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={handleConnect}
      disabled={isLoading}
      className={`${baseClasses} ${variantClasses.primary} ${className}`}
    >
      {isLoading ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          <span className={iconDirection}>{t("connecting")}</span>
        </>
      ) : (
        <>
          <svg
            className={`w-5 h-5 ${iconDirection}`}
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
          </svg>
          {t("connect")}
        </>
      )}
    </button>
  );
};

// Connection status component
export const LinkedInConnectionStatus = () => {
  const { data: session, status } = useSession();
  const t = useTranslations("linkedIn");
  const locale = useLocale();
  const isRTL = locale === "ar";

  if (status === "loading") {
    return (
      <div
        className={`flex items-center text-sm text-gray-500 ${
          isRTL ? "flex-row-reverse" : "flex-row"
        }`}
      >
        <div
          className={`animate-spin w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full ${
            isRTL ? "ml-2" : "mr-2"
          }`}
        />
        {t("checkingConnection")}
      </div>
    );
  }

  if (session?.user) {
    return (
      <div
        className={`flex items-center text-sm text-green-600 ${
          isRTL ? "flex-row-reverse" : "flex-row"
        }`}
      >
        <svg
          className={`w-4 h-4 ${isRTL ? "ml-2" : "mr-2"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg>
        {t("connected")}
        <span className={`text-gray-500 ${isRTL ? "mr-2" : "ml-2"}`}>
          ({session.user.name})
        </span>
      </div>
    );
  }

  return (
    <div
      className={`flex items-center text-sm text-gray-500 ${
        isRTL ? "flex-row-reverse" : "flex-row"
      }`}
    >
      <svg
        className={`w-4 h-4 ${isRTL ? "ml-2" : "mr-2"}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
          clipRule="evenodd"
        />
      </svg>
      {t("notConnected")}
    </div>
  );
};
