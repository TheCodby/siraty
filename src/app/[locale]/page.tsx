import { useTranslations } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import { useLocale } from "next-intl";
import {
  DocumentTextIcon,
  SparklesIcon,
  MagnifyingGlassIcon,
  ChartBarIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  StarIcon,
  CodeBracketIcon,
  DocumentIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";

export default function HomePage() {
  const t = useTranslations("home");
  const locale = useLocale();

  const features = [
    {
      name: t("features.createCV.title"),
      description: t("features.createCV.description"),
      icon: DocumentTextIcon,
      href: `/${locale}/create-cv`,
      color: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-50 to-cyan-50",
    },
    {
      name: t("features.improveCV.title"),
      description: t("features.improveCV.description"),
      icon: SparklesIcon,
      href: `/${locale}/improve-cv`,
      color: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-50 to-pink-50",
    },
    {
      name: t("features.matchJD.title"),
      description: t("features.matchJD.description"),
      icon: MagnifyingGlassIcon,
      href: `/${locale}/match-jd`,
      color: "from-green-500 to-emerald-500",
      bgGradient: "from-green-50 to-emerald-50",
    },
    {
      name: t("features.atsScore.title"),
      description: t("features.atsScore.description"),
      icon: ChartBarIcon,
      href: `/${locale}/ats-score`,
      color: "from-orange-500 to-red-500",
      bgGradient: "from-orange-50 to-red-50",
    },
  ];

  const benefits = [
    {
      title: t("benefits.openSource.title"),
      description: t("benefits.openSource.description"),
      icon: CodeBracketIcon,
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-50",
      textColor: "text-green-700",
    },
    {
      title: t("benefits.fileFormats.title"),
      description: t("benefits.fileFormats.description"),
      icon: DocumentIcon,
      color: "from-blue-500 to-indigo-500",
      bgColor: "bg-blue-50",
      textColor: "text-blue-700",
    },
    {
      title: t("benefits.atsFriendly.title"),
      description: t("benefits.atsFriendly.description"),
      icon: ShieldCheckIcon,
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-50",
      textColor: "text-purple-700",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 rtl:space-x-reverse bg-gradient-to-r from-blue-100 to-purple-100 rounded-full px-4 py-2 mb-8">
              <SparklesIcon className="h-5 w-5 text-blue-600" />
              <span className="text-blue-700 font-medium text-sm">
                {t("heroTag")}
              </span>
            </div>

            <h1 className="text-5xl sm:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                {t("title")}
              </span>
            </h1>

            <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
              {t("subtitle")}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Link
                href={`/${locale}/create-cv`}
                className="group relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 transition-all duration-300 flex items-center gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <SparklesIcon className="h-5 w-5" />
                <span>{t("getStarted")}</span>
                <ArrowRightIcon className="h-5 w-5 group-hover:translate-x-1 transition-transform rtl:rotate-180" />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity -z-10"></div>
              </Link>

              <Link
                href={`/${locale}/learn-more`}
                className="group border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-400 dark:hover:border-gray-500 transition-all duration-300 flex items-center gap-2"
              >
                <DocumentTextIcon className="h-5 w-5" />
                <span>{t("learnMore")}</span>
              </Link>
            </div>

            {/* Key Benefits - Inline in hero */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {benefits.map((benefit, index) => (
                <div
                  key={benefit.title}
                  className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div
                    className={`${benefit.bgColor} rounded-xl p-3 w-fit mb-4 mx-auto`}
                  >
                    <benefit.icon className={`h-6 w-6 ${benefit.textColor}`} />
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2 text-center">
                    {benefit.title}
                  </h3>

                  <p className="text-sm text-gray-600 dark:text-gray-300 text-center leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Background Elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-40 -right-32 w-96 h-96 bg-gradient-to-br from-blue-300 to-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob"></div>
          <div className="absolute -bottom-40 -left-32 w-96 h-96 bg-gradient-to-br from-purple-300 to-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob animation-delay-2000"></div>
          <div className="absolute top-40 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-gradient-to-br from-indigo-300 to-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob animation-delay-4000"></div>
        </div>
      </section>

      {/* Benefits Section - Moved here for immediate visibility */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white to-gray-50 dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900 border-t border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 rtl:space-x-reverse bg-gradient-to-r from-emerald-100 to-teal-100 rounded-full px-4 py-2 mb-4">
              <CheckCircleIcon className="h-4 w-4 text-emerald-600" />
              <span className="text-emerald-700 font-medium text-sm">
                {t("benefits.tag")}
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              {t("benefits.title")}
              <span className="block bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                {t("benefits.titleHighlight")}
              </span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {t("benefits.subtitle")}
            </p>
          </div>

          {/* Main Benefits - Enhanced design */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {benefits.map((benefit, index) => (
              <div
                key={benefit.title}
                className="relative group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transform hover:-translate-y-3 h-full">
                  {/* Colored top border */}
                  <div
                    className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${benefit.color} rounded-t-2xl`}
                  ></div>

                  <div
                    className={`${benefit.bgColor} rounded-xl p-3 w-fit mb-4`}
                  >
                    <benefit.icon className={`h-7 w-7 ${benefit.textColor}`} />
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                    {benefit.title}
                  </h3>

                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4 text-sm">
                    {benefit.description}
                  </p>

                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <CheckCircleIcon
                      className={`h-4 w-4 ${benefit.textColor}`}
                    />
                    <span
                      className={`font-medium text-sm ${benefit.textColor}`}
                    >
                      {t("benefits.availableNow")}
                    </span>
                  </div>
                </div>

                {/* Subtle hover glow */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${benefit.color} rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-500 -z-10`}
                ></div>
              </div>
            ))}
          </div>

          {/* Quick features list - Simplified for top placement */}
          <div className="bg-gradient-to-r from-gray-50 to-white dark:bg-gradient-to-r dark:from-gray-800 dark:to-gray-700 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <CheckCircleIcon className="h-4 w-4 text-green-600 flex-shrink-0" />
                <span className="text-gray-700 dark:text-gray-300 text-sm font-medium">
                  {t("benefits.features.noRegistration")}
                </span>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <CheckCircleIcon className="h-4 w-4 text-green-600 flex-shrink-0" />
                <span className="text-gray-700 dark:text-gray-300 text-sm font-medium">
                  {t("benefits.features.privacy")}
                </span>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <CheckCircleIcon className="h-4 w-4 text-green-600 flex-shrink-0" />
                <span className="text-gray-700 dark:text-gray-300 text-sm font-medium">
                  {t("benefits.features.templates")}
                </span>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <CheckCircleIcon className="h-4 w-4 text-green-600 flex-shrink-0" />
                <span className="text-gray-700 dark:text-gray-300 text-sm font-medium">
                  {t("benefits.features.autoSave")}
                </span>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <CheckCircleIcon className="h-4 w-4 text-green-600 flex-shrink-0" />
                <span className="text-gray-700 dark:text-gray-300 text-sm font-medium">
                  {t("benefits.features.bilingual")}
                </span>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <CheckCircleIcon className="h-4 w-4 text-green-600 flex-shrink-0" />
                <span className="text-gray-700 dark:text-gray-300 text-sm font-medium">
                  {t("benefits.features.community")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 rtl:space-x-reverse bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full px-4 py-2 mb-4">
              <StarIcon className="h-4 w-4 text-indigo-600" />
              <span className="text-indigo-700 font-medium text-sm">
                Features
              </span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              {t("features.title")}
              <span className="block bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {t("features.titleHighlight")}
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              {t("features.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Link
                key={feature.name}
                href={feature.href}
                className="group relative bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600 transform hover:-translate-y-2"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.bgGradient} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                ></div>

                <div className="relative z-10">
                  <div
                    className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                  >
                    <feature.icon className="h-7 w-7 text-white" />
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3 group-hover:text-indigo-600 transition-colors">
                    {feature.name}
                  </h3>

                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                    {feature.description}
                  </p>

                  <div className="flex items-center text-indigo-600 font-medium group-hover:text-indigo-700">
                    <span className="mr-2">Learn more</span>
                    <ArrowRightIcon className="h-4 w-4 group-hover:translate-x-1 transition-transform rtl:rotate-180" />
                  </div>
                </div>

                <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-br from-transparent to-gray-100 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <div className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-3xl p-12 text-white overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-4xl sm:text-5xl font-bold mb-6">
                {t("cta.title")}
                <span className="block">{t("cta.titleHighlight")}</span>
              </h2>
              <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
                {t("cta.subtitle")}
              </p>
              <Link
                href={`/${locale}/create-cv`}
                className="group inline-flex items-center space-x-3 rtl:space-x-reverse bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <SparklesIcon className="h-5 w-5" />
                <span>{t("cta.button")}</span>
                <ArrowRightIcon className="h-5 w-5 group-hover:translate-x-1 transition-transform rtl:rotate-180" />
              </Link>
            </div>

            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-40 h-40 border border-white rounded-full"></div>
              <div className="absolute bottom-0 right-0 w-60 h-60 border border-white rounded-full"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 border border-white rounded-full"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-900 dark:bg-gray-950 text-white transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-6">
              <div className="relative w-16 h-10">
                <Image
                  src="/siraty-logo.png"
                  alt="سيرتي - Siraty"
                  fill
                  className="object-contain rounded-lg"
                />
              </div>
            </div>
            <p className="text-gray-400 mb-6">{t("footer.tagline")}</p>

            {/* Footer Links */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
              <Link
                href={`/${locale}/privacy`}
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                {t("footer.privacy")}
              </Link>
              <div className="hidden sm:block w-1 h-1 bg-gray-600 rounded-full"></div>
              <Link
                href={`/${locale}/terms`}
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                {t("footer.terms")}
              </Link>
              <div className="hidden sm:block w-1 h-1 bg-gray-600 rounded-full"></div>
              <Link
                href={`/${locale}/learn-more`}
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                {t("footer.learnMore")}
              </Link>
            </div>
          </div>
          <p className="text-gray-500 text-sm text-center">
            {t("footer.copyright", { year: new Date().getFullYear() })}
          </p>
        </div>
      </footer>
    </div>
  );
}
