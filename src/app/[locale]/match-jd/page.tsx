"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { JobMatchAnalysis } from "@/components/ai/JobMatchAnalysis";
import { getLocalStorageItem, STORAGE_KEYS } from "@/lib/localStorage";
import type { CVData } from "@/types/cv";
import {
  Search,
  ChartBarIcon,
  StarIcon,
  TrendingUp,
  Sparkles,
  Target,
  CheckCircle,
  BriefcaseIcon,
} from "lucide-react";

export default function MatchJDPage() {
  const t = useTranslations("ai.jobMatch");
  const params = useParams();
  const locale = params.locale as string;
  const [currentCV, setCurrentCV] = useState<CVData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load CV data only on client side to prevent hydration mismatch
  useEffect(() => {
    const cvData = getLocalStorageItem(STORAGE_KEYS.CV_BUILDER_DATA, null);
    setCurrentCV(cvData);
    setIsLoading(false);
  }, []);

  const features = [
    {
      icon: Search,
      title: "Smart Job Analysis",
      description:
        "AI-powered analysis of job requirements and your CV compatibility",
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      textColor: "text-blue-600 dark:text-blue-400",
    },
    {
      icon: ChartBarIcon,
      title: "Skills Gap Analysis",
      description:
        "Identify missing skills and get recommendations for improvement",
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-50 dark:bg-green-900/20",
      textColor: "text-green-600 dark:text-green-400",
    },
    {
      icon: StarIcon,
      title: "Match Percentage",
      description:
        "Get precise compatibility scores for better job applications",
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
      textColor: "text-purple-600 dark:text-purple-400",
    },
  ];

  // Show loading state during hydration
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-green-900">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-green-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full mb-6">
              <Target className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Job Description
              <span className="block bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                Matching
              </span>
            </h1>
            <p className="text-xl text-green-100 max-w-3xl mx-auto mb-8">
              Discover how well your CV aligns with job requirements. Get
              detailed insights, match percentages, and actionable
              recommendations to improve your applications.
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-green-100">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                AI-Powered Analysis
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Skills Gap Identification
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Improvement Recommendations
              </div>
            </div>
          </div>
        </div>

        {/* Animated background elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-20 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-teal-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
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
              Create or upload a CV first to start matching with job
              descriptions.
            </p>
            <a
              href={`/${locale}/create-cv`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Sparkles className="w-5 h-5" />
              Create Your CV
            </a>
          </div>
        )}

        {currentCV && (
          <>
            {/* Features Overview */}
            <div className="mb-12">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  How Job Matching Works
                </h2>
                <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                  Our AI analyzes job descriptions and compares them with your
                  CV to provide actionable insights
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6 mb-12">
                {features.map((feature, index) => (
                  <div
                    key={feature.title}
                    className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                    style={{ animationDelay: `${index * 150}ms` }}
                  >
                    <div
                      className={`${feature.bgColor} rounded-lg p-3 w-fit mb-4`}
                    >
                      <feature.icon
                        className={`w-6 h-6 ${feature.textColor}`}
                      />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Job Matching Interface */}
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center justify-center gap-2">
                  <Target className="w-6 h-6 text-green-500" />
                  {t("title")}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Paste a job description below to see how well your CV matches
                  the requirements
                </p>
              </div>

              <JobMatchAnalysis
                cvData={currentCV}
                language={locale as "en" | "ar"}
              />
            </div>

            {/* Tips Section */}
            <div className="mt-16 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-8 border border-green-200 dark:border-green-800">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900/40 rounded-full mb-4">
                  <BriefcaseIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Pro Tips for Better Matches
                </h3>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                      Use Complete Job Descriptions
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Include the full job posting for more accurate analysis
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                      Focus on Keywords
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Pay attention to specific skills and technologies
                      mentioned
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                      Update Your CV
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Use insights to improve your CV before applying
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
