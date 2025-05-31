import { useTranslations } from "next-intl";
import Link from "next/link";
import { useLocale } from "next-intl";
import Navbar from "@/components/layout/Navbar";
import {
  ShieldCheckIcon,
  ArrowLeftIcon,
  InformationCircleIcon,
  DocumentTextIcon,
  EyeSlashIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";

export default function PrivacyPolicyPage() {
  const t = useTranslations("privacy");
  const tCommon = useTranslations("common");
  const locale = useLocale();

  const sections = [
    {
      id: "data-collection",
      title: t("sections.dataCollection.title"),
      content: t("sections.dataCollection.content"),
      icon: InformationCircleIcon,
    },
    {
      id: "data-usage",
      title: t("sections.dataUsage.title"),
      content: t("sections.dataUsage.content"),
      icon: DocumentTextIcon,
    },
    {
      id: "data-storage",
      title: t("sections.dataStorage.title"),
      content: t("sections.dataStorage.content"),
      icon: LockClosedIcon,
    },
    {
      id: "data-sharing",
      title: t("sections.dataSharing.title"),
      content: t("sections.dataSharing.content"),
      icon: EyeSlashIcon,
    },
    {
      id: "user-rights",
      title: t("sections.userRights.title"),
      content: t("sections.userRights.content"),
      icon: ShieldCheckIcon,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 rtl:space-x-reverse bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full px-4 py-2 mb-6">
            <ShieldCheckIcon className="h-5 w-5 text-blue-600" />
            <span className="text-blue-700 font-medium text-sm">
              {t("badge")}
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              {t("title")}
            </span>
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            {t("subtitle")}
          </p>

          <div className="text-sm text-gray-500">
            {t("lastUpdated")}: {t("date")}
          </div>
        </div>

        {/* Introduction */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {t("introduction.title")}
          </h2>
          <p className="text-gray-700 leading-relaxed">
            {t("introduction.content")}
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-6">
          {sections.map((section) => (
            <div
              key={section.id}
              className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex items-start space-x-4 rtl:space-x-reverse">
                <div className="bg-blue-50 rounded-xl p-3 flex-shrink-0">
                  <section.icon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {section.title}
                  </h3>
                  <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {section.content}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 mt-12 border border-blue-100">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {t("contact.title")}
            </h3>
            <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
              {t("contact.content")}
            </p>
            <div className="text-blue-600 font-medium">
              {t("contact.email")}: support@siraty.com
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-center mt-12">
          <Link
            href={`/${locale}`}
            className="group border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 flex items-center gap-2"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            <span>{tCommon("backHome")}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
