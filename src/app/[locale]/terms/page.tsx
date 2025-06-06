import { useTranslations } from "next-intl";
import Link from "next/link";
import { useLocale } from "next-intl";
import {
  DocumentTextIcon,
  ArrowLeftIcon,
  ExclamationTriangleIcon,
  UserIcon,
  CogIcon,
  ShieldExclamationIcon,
} from "@heroicons/react/24/outline";

export default function TermsPage() {
  const t = useTranslations("terms");
  const tCommon = useTranslations("common");
  const locale = useLocale();

  const sections = [
    {
      id: "acceptance",
      title: t("sections.acceptance.title"),
      content: t("sections.acceptance.content"),
      icon: DocumentTextIcon,
    },
    {
      id: "use-license",
      title: t("sections.useLicense.title"),
      content: t("sections.useLicense.content"),
      icon: UserIcon,
    },
    {
      id: "prohibited-uses",
      title: t("sections.prohibitedUses.title"),
      content: t("sections.prohibitedUses.content"),
      icon: ExclamationTriangleIcon,
    },
    {
      id: "service-availability",
      title: t("sections.serviceAvailability.title"),
      content: t("sections.serviceAvailability.content"),
      icon: CogIcon,
    },
    {
      id: "disclaimer",
      title: t("sections.disclaimer.title"),
      content: t("sections.disclaimer.content"),
      icon: ShieldExclamationIcon,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 rtl:space-x-reverse bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30 rounded-full px-4 py-2 mb-6">
            <DocumentTextIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            <span className="text-purple-700 dark:text-purple-300 font-medium text-sm">
              {t("badge")}
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              {t("title")}
            </span>
          </h1>

          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            {t("subtitle")}
          </p>

          <div className="text-sm text-gray-500 dark:text-gray-400">
            {t("lastUpdated")}: {t("date")}
          </div>
        </div>

        {/* Introduction */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700 mb-8 transition-colors duration-300">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            {t("introduction.title")}
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {t("introduction.content")}
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-6">
          {sections.map((section) => (
            <div
              key={section.id}
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-start space-x-4 rtl:space-x-reverse">
                <div className="bg-purple-50 dark:bg-purple-900/30 rounded-xl p-3 flex-shrink-0">
                  <section.icon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                    {section.title}
                  </h3>
                  <div className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                    {section.content}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:bg-gradient-to-r dark:from-purple-900/20 dark:to-indigo-900/20 rounded-2xl p-8 mt-12 border border-purple-100 dark:border-purple-800/50 transition-colors duration-300">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              {t("contact.title")}
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
              {t("contact.content")}
            </p>
            <div className="text-purple-600 dark:text-purple-400 font-medium">
              {t("contact.email")}: legal@siraty.com
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-center mt-12">
          <Link
            href={`/${locale}`}
            className="group border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-400 dark:hover:border-gray-500 transition-all duration-300 flex items-center gap-2"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            <span>{tCommon("backHome")}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
