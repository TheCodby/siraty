"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useJobMatch } from "@/features/jd-matching/hooks/useJobMatch";
import type { CVData } from "@/types/cv";
import type { JobDescription } from "@/types/job";
import {
  Target,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  TrendingUp,
  Star,
  Briefcase,
  GraduationCap,
  Award,
  Lightbulb,
  Zap,
  Search,
} from "lucide-react";

interface JobMatchAnalysisProps {
  cvData?: CVData;
  language?: "en" | "ar";
  className?: string;
}

const MatchMeter = ({
  percentage,
  label,
}: {
  percentage: number;
  label: string;
}) => {
  const getColor = (pct: number) => {
    if (pct >= 80) return "bg-green-500";
    if (pct >= 60) return "bg-yellow-500";
    if (pct >= 40) return "bg-orange-500";
    return "bg-red-500";
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </span>
        <span className="text-sm font-bold text-gray-900 dark:text-white">
          {Math.round(percentage)}%
        </span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-1000 ease-out ${getColor(
            percentage
          )}`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export const JobMatchAnalysis = ({
  cvData,
  language = "en",
  className = "",
}: JobMatchAnalysisProps) => {
  const t = useTranslations("ai.jobMatch");
  const tCommon = useTranslations("ai.common");
  const [jobDescription, setJobDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const { analysis, isLoading, error, matchJob } = useJobMatch({
    language,
    onSuccess: () => setIsAnalyzing(false),
    onError: () => setIsAnalyzing(false),
  });

  const handleAnalyze = async () => {
    if (!cvData || !jobDescription.trim()) return;
    setIsAnalyzing(true);

    const jobData: JobDescription = {
      id: `job-${Date.now()}`,
      title: "Job Position",
      company: "Company",
      location: "Location",
      description: jobDescription,
      requirements: [],
      responsibilities: [],
      skills: [],
      experience: "",
    };

    await matchJob(cvData, jobData);
  };

  const getPriorityColor = (priority: "high" | "medium" | "low") => {
    switch (priority) {
      case "high":
        return "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20";
      case "medium":
        return "border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20";
      case "low":
        return "border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800";
    }
  };

  const getPriorityIcon = (priority: "high" | "medium" | "low") => {
    switch (priority) {
      case "high":
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case "medium":
        return <Target className="w-4 h-4 text-yellow-500" />;
      case "low":
        return <Lightbulb className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div
      className={`bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 ${className}`}
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-t-xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full">
            <Target className="w-5 h-5 text-white" />
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

        {/* Job Description Input */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t("jobDescription.title")}
          </label>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder={t("jobDescription.placeholder")}
            rows={6}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
            style={{ direction: language === "ar" ? "rtl" : "ltr" }}
          />
          <button
            onClick={handleAnalyze}
            disabled={
              !cvData || !jobDescription.trim() || isLoading || isAnalyzing
            }
            className="w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg hover:from-purple-600 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
          >
            {isLoading || isAnalyzing ? (
              <>
                <Zap className="w-4 h-4 animate-pulse" />
                {t("analyzing")}
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                {t("analyzeButton")}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {!analysis && !jobDescription && (
          <div className="text-center py-12">
            <Briefcase className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {t("emptyState.title")}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {t("emptyState.subtitle")}
            </p>
          </div>
        )}

        {analysis && (
          <div className="space-y-6">
            {/* Overall Match Score */}
            <div className="text-center bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-6 border border-purple-200 dark:border-purple-800">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full mb-4">
                <span className="text-2xl font-bold text-white">
                  {Math.round(analysis.overallMatch)}%
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {t("overallMatch")}
              </h3>
              <div className="flex items-center justify-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {analysis.overallMatch >= 80
                    ? "Excellent Match"
                    : analysis.overallMatch >= 60
                    ? "Good Match"
                    : analysis.overallMatch >= 40
                    ? "Fair Match"
                    : "Poor Match"}
                </span>
              </div>
            </div>

            {/* Match Breakdown */}
            <div className="grid md:grid-cols-3 gap-6">
              {/* Skills Match */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-3">
                  <Award className="w-5 h-5 text-blue-500" />
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {t("skillsMatch.title")}
                  </h4>
                </div>
                <MatchMeter
                  percentage={analysis.skillsMatch.percentage}
                  label={t("skillsMatch.percentage")}
                />
                <div className="mt-3 space-y-2">
                  {analysis.skillsMatch.matched.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-green-600 dark:text-green-400 mb-1">
                        {t("skillsMatch.matched")} (
                        {analysis.skillsMatch.matched.length})
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {analysis.skillsMatch.matched
                          .slice(0, 3)
                          .map((skill, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 text-xs rounded"
                            >
                              {skill}
                            </span>
                          ))}
                        {analysis.skillsMatch.matched.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded">
                            +{analysis.skillsMatch.matched.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Experience Match */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-3">
                  <Briefcase className="w-5 h-5 text-purple-500" />
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {t("experienceMatch.title")}
                  </h4>
                </div>
                <MatchMeter
                  percentage={analysis.experienceMatch.percentage}
                  label={t("experienceMatch.percentage")}
                />
                <div className="mt-3 space-y-2">
                  <div className="flex items-center gap-2">
                    {analysis.experienceMatch.relevant ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500" />
                    )}
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      {t("experienceMatch.relevant")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {analysis.experienceMatch.yearsMatch ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500" />
                    )}
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      {t("experienceMatch.yearsMatch")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Education Match */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-3">
                  <GraduationCap className="w-5 h-5 text-indigo-500" />
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {t("educationMatch.title")}
                  </h4>
                </div>
                <MatchMeter
                  percentage={analysis.educationMatch.percentage}
                  label={t("educationMatch.percentage")}
                />
                <div className="mt-3">
                  <div className="flex items-center gap-2">
                    {analysis.educationMatch.relevant ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500" />
                    )}
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      {t("educationMatch.relevant")}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Missing Skills */}
            {analysis.skillsMatch.missing.length > 0 && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <h5 className="font-medium text-red-800 dark:text-red-200 mb-3 flex items-center gap-2">
                  <XCircle className="w-4 h-4" />
                  {t("skillsMatch.missing")}
                </h5>
                <div className="flex flex-wrap gap-2">
                  {analysis.skillsMatch.missing.map((skill, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-200 text-xs rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendations */}
            {analysis.recommendations.length > 0 && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <h5 className="font-medium text-blue-800 dark:text-blue-200 mb-3 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  {t("recommendations")}
                </h5>
                <ul className="space-y-2">
                  {analysis.recommendations.map((recommendation, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2 text-sm text-blue-700 dark:text-blue-300"
                    >
                      <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      {recommendation}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Improvement Areas */}
            {analysis.improvementAreas.length > 0 && (
              <div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5" />
                  {t("improvementAreas.title")}
                </h4>
                <div className="space-y-3">
                  {analysis.improvementAreas.map((area, index) => (
                    <div
                      key={index}
                      className={`rounded-lg p-4 border ${getPriorityColor(
                        area.priority
                      )}`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        {getPriorityIcon(area.priority)}
                        <h5 className="font-medium text-gray-900 dark:text-white">
                          {area.area}
                        </h5>
                        <span className="px-2 py-1 text-xs rounded-full bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300">
                          {t(`improvementAreas.priority.${area.priority}`)}
                        </span>
                      </div>
                      <ul className="space-y-1">
                        {area.suggestions.map((suggestion, suggestionIndex) => (
                          <li
                            key={suggestionIndex}
                            className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2"
                          >
                            <span className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
