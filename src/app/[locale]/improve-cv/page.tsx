"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { ChatInterface } from "@/components/ai/ChatInterface";
import { ATSScoreDisplay } from "@/components/ai/ATSScoreDisplay";
import { JobMatchAnalysis } from "@/components/ai/JobMatchAnalysis";
import { getLocalStorageItem, STORAGE_KEYS } from "@/lib/localStorage";
import type { CVData } from "@/types/cv";
import {
  MessageCircle,
  BarChart3,
  Target,
  Sparkles,
  Brain,
  Zap,
  TrendingUp,
  CheckCircle,
} from "lucide-react";

type TabType = "chat" | "ats" | "match";

export default function ImproveCVPage() {
  const t = useTranslations("ai");
  const params = useParams();
  const locale = params.locale as string;
  const [activeTab, setActiveTab] = useState<TabType>("chat");
  const [currentCV, setCurrentCV] = useState<CVData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load CV data only on client side to prevent hydration mismatch
  useEffect(() => {
    const cvData = getLocalStorageItem(STORAGE_KEYS.CV_BUILDER_DATA, null);
    setCurrentCV(cvData);
    setIsLoading(false);
  }, []);

  const tabs = [
    {
      id: "chat" as TabType,
      label: t("chat.title"),
      icon: MessageCircle,
      description: t("chat.subtitle"),
      color: "blue",
    },
    {
      id: "ats" as TabType,
      label: t("atsScore.title"),
      icon: BarChart3,
      description: t("atsScore.subtitle"),
      color: "green",
    },
    {
      id: "match" as TabType,
      label: t("jobMatch.title"),
      icon: Target,
      description: t("jobMatch.subtitle"),
      color: "purple",
    },
  ];

  const getTabColorClasses = (color: string, isActive: boolean) => {
    const baseClasses = "transition-all duration-200";
    if (isActive) {
      switch (color) {
        case "blue":
          return `${baseClasses} bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300`;
        case "green":
          return `${baseClasses} bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300`;
        case "purple":
          return `${baseClasses} bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300`;
        default:
          return `${baseClasses} bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700`;
      }
    }
    return `${baseClasses} bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300`;
  };

  // Show loading state during hydration
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full mb-6">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              AI-Powered CV
              <span className="block bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                Enhancement
              </span>
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
              Transform your resume with cutting-edge AI technology. Get
              personalized feedback, optimize for ATS systems, and match with
              your dream jobs.
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-blue-100">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Real-time AI Chat Support
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                ATS Optimization Analysis
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Job Matching Intelligence
              </div>
            </div>
          </div>
        </div>

        {/* Animated background elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-20 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!currentCV && (
          <div className="text-center py-12 mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full mb-4">
              <TrendingUp className="w-8 h-8 text-gray-500 dark:text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              No CV Found
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Create or upload a CV first to access AI-powered improvement
              features.
            </p>
            <a
              href={`/${locale}/create-cv`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Sparkles className="w-5 h-5" />
              Create Your CV
            </a>
          </div>
        )}

        {currentCV && (
          <>
            {/* Tabs Navigation */}
            <div className="mb-8">
              <div className="grid md:grid-cols-3 gap-4">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;

                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`p-6 rounded-xl border-2 text-left ${getTabColorClasses(
                        tab.color,
                        isActive
                      )}`}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            isActive
                              ? `bg-${tab.color}-500 text-white`
                              : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{tab.label}</h3>
                          {isActive && (
                            <div className="flex items-center gap-1 text-sm opacity-75">
                              <Zap className="w-3 h-3" />
                              Active
                            </div>
                          )}
                        </div>
                      </div>
                      <p className="text-sm opacity-75">{tab.description}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tab Content */}
            <div className="min-h-[600px]">
              {activeTab === "chat" && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center justify-center gap-2">
                      <MessageCircle className="w-6 h-6 text-blue-500" />
                      {t("chat.title")}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      Chat with our AI assistant to get personalized advice for
                      your CV
                    </p>
                  </div>
                  <ChatInterface
                    cvData={currentCV}
                    language={locale as "en" | "ar"}
                    className="h-[600px]"
                  />
                </div>
              )}

              {activeTab === "ats" && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center justify-center gap-2">
                      <BarChart3 className="w-6 h-6 text-green-500" />
                      {t("atsScore.title")}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      Analyze how well your CV performs with Applicant Tracking
                      Systems
                    </p>
                  </div>
                  <ATSScoreDisplay
                    cvData={currentCV}
                    language={locale as "en" | "ar"}
                  />
                </div>
              )}

              {activeTab === "match" && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center justify-center gap-2">
                      <Target className="w-6 h-6 text-purple-500" />
                      {t("jobMatch.title")}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      See how well your CV matches specific job requirements
                    </p>
                  </div>
                  <JobMatchAnalysis
                    cvData={currentCV}
                    language={locale as "en" | "ar"}
                  />
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
