"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useATSScore } from "@/features/ats-grading/hooks/useATSScore";
import type { CVData } from "@/types/cv";
import {
  TrendingUp,
  Target,
  Award,
  CheckCircle,
  XCircle,
  AlertCircle,
  BarChart3,
  Zap,
  Sparkles,
  Eye,
  FileText,
} from "lucide-react";

interface ATSScoreDisplayProps {
  cvData?: CVData;
  language?: "en" | "ar";
  className?: string;
}

interface ScoreCircleProps {
  score: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  label?: string;
}

const ScoreCircle = ({
  score,
  size = "md",
  showLabel = true,
  label,
}: ScoreCircleProps) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    if (score >= 40) return "text-orange-500";
    return "text-red-500";
  };

  const getCircleColor = (score: number) => {
    if (score >= 80) return "stroke-green-500";
    if (score >= 60) return "stroke-yellow-500";
    if (score >= 40) return "stroke-orange-500";
    return "stroke-red-500";
  };

  const sizeClasses = {
    sm: "w-12 h-12",
    md: "w-16 h-16",
    lg: "w-24 h-24",
  };

  const radius = size === "lg" ? 40 : size === "md" ? 28 : 20;
  const strokeWidth = size === "lg" ? 6 : 4;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`relative ${sizeClasses[size]}`}>
        <svg className="transform -rotate-90 w-full h-full">
          <circle
            cx="50%"
            cy="50%"
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            className="text-gray-200 dark:text-gray-700"
          />
          <circle
            cx="50%"
            cy="50%"
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            className={`transition-all duration-1000 ease-out ${getCircleColor(
              score
            )}`}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className={`font-bold ${getScoreColor(score)} ${
              size === "lg" ? "text-xl" : size === "md" ? "text-lg" : "text-sm"
            }`}
          >
            {Math.round(score)}
          </span>
        </div>
      </div>
      {showLabel && label && (
        <span className="text-xs text-gray-600 dark:text-gray-400 text-center">
          {label}
        </span>
      )}
    </div>
  );
};

export const ATSScoreDisplay = ({
  cvData,
  language = "en",
  className = "",
}: ATSScoreDisplayProps) => {
  const t = useTranslations("ai.atsScore");
  const tCommon = useTranslations("ai.common");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const { score, isLoading, error, analyzeCV } = useATSScore({
    language,
    onSuccess: () => setIsAnalyzing(false),
    onError: () => setIsAnalyzing(false),
  });

  const handleAnalyze = async () => {
    if (!cvData) return;
    setIsAnalyzing(true);
    await analyzeCV(cvData);
  };

  const getScoreRating = (score: number) => {
    if (score >= 80) return t("scoreRanges.excellent");
    if (score >= 60) return t("scoreRanges.good");
    if (score >= 40) return t("scoreRanges.average");
    return t("scoreRanges.needsWork");
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="w-5 h-5 text-green-500" />;
    if (score >= 60) return <Target className="w-5 h-5 text-yellow-500" />;
    if (score >= 40) return <AlertCircle className="w-5 h-5 text-orange-500" />;
    return <XCircle className="w-5 h-5 text-red-500" />;
  };

  return (
    <div
      className={`bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 ${className}`}
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-t-xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-full">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {t("title")}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t("subtitle")}
            </p>
          </div>
        </div>

        {!score && cvData && (
          <button
            onClick={handleAnalyze}
            disabled={isLoading || isAnalyzing}
            className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-lg hover:from-green-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
          >
            {isLoading || isAnalyzing ? (
              <>
                <Zap className="w-4 h-4 animate-pulse" />
                {t("analyzing")}
              </>
            ) : (
              <>
                <Eye className="w-4 h-4" />
                {t("analyzeButton")}
              </>
            )}
          </button>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {!cvData && !score && (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {t("emptyState.title")}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {t("emptyState.subtitle")}
            </p>
          </div>
        )}

        {score && (
          <div className="space-y-6">
            {/* Overall Score */}
            <div className="text-center">
              <ScoreCircle score={score.overall} size="lg" />
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center justify-center gap-2">
                  {getScoreIcon(score.overall)}
                  {t("overallScore")}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {getScoreRating(score.overall)}
                </p>
                <div className="mt-2 flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <TrendingUp className="w-4 h-4" />
                  {t("passRate")}: {Math.round(score.estimatedPassRate)}%
                </div>
              </div>
            </div>

            {/* Category Breakdown */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                {t("categories.title")}
              </h4>
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="text-center">
                  <ScoreCircle
                    score={score.categories.formatting.score}
                    size="sm"
                    label={t("categories.formatting")}
                  />
                </div>
                <div className="text-center">
                  <ScoreCircle
                    score={score.categories.keywords.score}
                    size="sm"
                    label={t("categories.keywords")}
                  />
                </div>
                <div className="text-center">
                  <ScoreCircle
                    score={score.categories.experience.score}
                    size="sm"
                    label={t("categories.experience")}
                  />
                </div>
                <div className="text-center">
                  <ScoreCircle
                    score={score.categories.education.score}
                    size="sm"
                    label={t("categories.education")}
                  />
                </div>
                <div className="text-center">
                  <ScoreCircle
                    score={score.categories.skills.score}
                    size="sm"
                    label={t("categories.skills")}
                  />
                </div>
              </div>
            </div>

            {/* Feedback Sections */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Award className="w-5 h-5" />
                {t("feedback.title")}
              </h4>

              {/* Keywords */}
              {score.categories.keywords.matched.length > 0 && (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <h5 className="font-medium text-green-800 dark:text-green-200 mb-2">
                    {t("feedback.matched")}
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {score.categories.keywords.matched.map((keyword, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 text-xs rounded-full"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Missing Keywords */}
              {score.categories.keywords.missing.length > 0 && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                  <h5 className="font-medium text-red-800 dark:text-red-200 mb-2">
                    {t("feedback.missing")}
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {score.categories.keywords.missing.map((keyword, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-200 text-xs rounded-full"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendations */}
              {score.recommendations.length > 0 && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <h5 className="font-medium text-blue-800 dark:text-blue-200 mb-3">
                    {t("feedback.recommendations")}
                  </h5>
                  <ul className="space-y-2">
                    {score.recommendations.map((recommendation, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 text-sm text-blue-700 dark:text-blue-300"
                      >
                        <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        {recommendation}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-red-700 dark:text-red-300">{error}</p>
            <button
              onClick={handleAnalyze}
              className="mt-2 text-sm text-red-600 dark:text-red-400 hover:underline"
            >
              {tCommon("retry")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
