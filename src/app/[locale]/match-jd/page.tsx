import { useTranslations } from "next-intl";
import Link from "next/link";
import { useLocale } from "next-intl";
import Navbar from "@/components/layout/Navbar";
import {
  MagnifyingGlassIcon,
  ArrowLeftIcon,
  ClockIcon,
  DocumentTextIcon,
  ChartBarIcon,
  StarIcon,
} from "@heroicons/react/24/outline";

export default function MatchJDPage() {
  const t = useTranslations("comingSoon");
  const tCommon = useTranslations("common");
  const locale = useLocale();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-green-50 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          {/* Coming Soon Badge */}
          <div className="inline-flex items-center space-x-2 rtl:space-x-reverse bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-full px-4 py-2 mb-8">
            <ClockIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
            <span className="text-green-700 dark:text-green-300 font-medium text-sm">
              {t("badge")}
            </span>
          </div>

          {/* Main Content */}
          <div className="mb-12">
            <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              <span className="block bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
                {t("matchJD.title")}
              </span>
            </h1>

            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
              {t("matchJD.description")}
            </p>

            {/* Features Preview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 transition-colors duration-300">
                <div className="bg-green-50 dark:bg-green-900/30 rounded-xl p-3 w-fit mb-4 mx-auto">
                  <MagnifyingGlassIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  {t("matchJD.features.smartAnalysis")}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {t("matchJD.features.smartAnalysisDesc")}
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 transition-colors duration-300">
                <div className="bg-emerald-50 dark:bg-emerald-900/30 rounded-xl p-3 w-fit mb-4 mx-auto">
                  <ChartBarIcon className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  {t("matchJD.features.gapAnalysis")}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {t("matchJD.features.gapAnalysisDesc")}
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 transition-colors duration-300">
                <div className="bg-teal-50 dark:bg-teal-900/30 rounded-xl p-3 w-fit mb-4 mx-auto">
                  <StarIcon className="h-6 w-6 text-teal-600 dark:text-teal-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  {t("matchJD.features.recommendations")}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {t("matchJD.features.recommendationsDesc")}
                </p>
              </div>
            </div>

            {/* CTA */}
            <div className="space-y-4">
              <p className="text-lg text-gray-700 dark:text-gray-300 font-medium">
                {t("notify")}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href={`/${locale}/create-cv`}
                  className="group bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
                >
                  <DocumentTextIcon className="h-5 w-5" />
                  <span>{t("createNow")}</span>
                </Link>

                <Link
                  href={`/${locale}`}
                  className="group border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-400 dark:hover:border-gray-500 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <ArrowLeftIcon className="h-5 w-5" />
                  <span>{tCommon("backHome")}</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
