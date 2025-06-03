"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { ATSScoreDisplay } from "@/components/ai/ATSScoreDisplay";
import { getLocalStorageItem, STORAGE_KEYS } from "@/lib/localStorage";
import type { CVData } from "@/types/cv";
import {
  BarChart3,
  ShieldCheck,
  CheckCircle,
  TrendingUp,
  Sparkles,
  Award,
  FileText,
  Search,
  Zap,
  AlertTriangle,
  Target,
  Eye,
} from "lucide-react";

export default function ATSScorePage() {
  const t = useTranslations("ai.atsScore");
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
      icon: BarChart3,
      title: "Comprehensive Scoring",
      description:
        "Detailed analysis of formatting, keywords, and structure optimization",
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      textColor: "text-blue-600 dark:text-blue-400",
    },
    {
      icon: Search,
      title: "Keyword Analysis",
      description:
        "Identify missing keywords and optimize for better searchability",
      color: "from-orange-500 to-red-500",
      bgColor: "bg-orange-50 dark:bg-orange-900/20",
      textColor: "text-orange-600 dark:text-orange-400",
    },
    {
      icon: ShieldCheck,
      title: "ATS Compatibility",
      description:
        "Ensure your CV passes through Applicant Tracking Systems successfully",
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-50 dark:bg-green-900/20",
      textColor: "text-green-600 dark:text-green-400",
    },
  ];

  const atsFactors = [
    {
      icon: FileText,
      title: "Clean Formatting",
      description: "Simple, readable layout without complex graphics or tables",
      importance: "Critical",
    },
    {
      icon: Search,
      title: "Relevant Keywords",
      description:
        "Industry-specific terms and skills that match job descriptions",
      importance: "High",
    },
    {
      icon: Target,
      title: "Standard Sections",
      description: "Traditional CV sections like Experience, Education, Skills",
      importance: "High",
    },
    {
      icon: Eye,
      title: "Readable Fonts",
      description: "Standard fonts like Arial, Calibri, or Times New Roman",
      importance: "Medium",
    },
  ];

  // Show loading state during hydration
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-orange-900">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-orange-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-orange-600 via-red-600 to-pink-600">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full mb-6">
              <Award className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              ATS Score
              <span className="block bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                Analysis
              </span>
            </h1>
            <p className="text-xl text-orange-100 max-w-3xl mx-auto mb-8">
              Optimize your CV for Applicant Tracking Systems. Get detailed
              scores, identify improvement areas, and boost your chances of
              passing initial screenings.
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-orange-100">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Comprehensive Analysis
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Keyword Optimization
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Formatting Review
              </div>
            </div>
          </div>
        </div>

        {/* Animated background elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-20 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
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
              Create or upload a CV first to get your ATS compatibility score.
            </p>
            <a
              href={`/${locale}/create-cv`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:from-orange-600 hover:to-red-700 transition-all duration-200 shadow-lg hover:shadow-xl"
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
                  How ATS Scoring Works
                </h2>
                <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                  Our AI analyzes your CV against modern ATS requirements to
                  ensure maximum compatibility
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

            {/* ATS Score Interface */}
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center justify-center gap-2">
                  <BarChart3 className="w-6 h-6 text-orange-500" />
                  {t("title")}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Get your comprehensive ATS compatibility score and detailed
                  improvement recommendations
                </p>
              </div>

              <ATSScoreDisplay
                cvData={currentCV}
                language={locale as "en" | "ar"}
              />
            </div>

            {/* ATS Factors Section */}
            <div className="mt-16 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-2xl p-8 border border-orange-200 dark:border-orange-800">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 dark:bg-orange-900/40 rounded-full mb-4">
                  <Zap className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Key ATS Success Factors
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Understanding what ATS systems look for can significantly
                  improve your chances
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {atsFactors.map((factor) => (
                  <div key={factor.title} className="flex items-start gap-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm">
                      <factor.icon className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {factor.title}
                        </h4>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            factor.importance === "Critical"
                              ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                              : factor.importance === "High"
                              ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                              : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                          }`}
                        >
                          {factor.importance}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {factor.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pro Tips Section */}
            <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-8 border border-blue-200 dark:border-blue-800">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900/40 rounded-full mb-4">
                  <AlertTriangle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Common ATS Pitfalls to Avoid
                </h3>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                      Complex Layouts
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Avoid tables, columns, and graphics that ATS can&apos;t
                      parse
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                      Image-Based Text
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Text in images cannot be read by ATS systems
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                      Unusual File Formats
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Stick to PDF or DOCX formats for best compatibility
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
