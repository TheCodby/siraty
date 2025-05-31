import { useTranslations } from "next-intl";
import Link from "next/link";
import { useLocale } from "next-intl";
import Navbar from "@/components/layout/Navbar";
import {
  InformationCircleIcon,
  ArrowLeftIcon,
  SparklesIcon,
  DocumentTextIcon,
  MagnifyingGlassIcon,
  ChartBarIcon,
  CheckCircleIcon,
  LightBulbIcon,
  CogIcon,
} from "@heroicons/react/24/outline";

export default function LearnMorePage() {
  const t = useTranslations("learnMore");
  const tCommon = useTranslations("common");
  const locale = useLocale();

  const features = [
    {
      id: "ai-powered",
      title: t("features.aiPowered.title"),
      description: t("features.aiPowered.description"),
      icon: SparklesIcon,
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-50",
    },
    {
      id: "ats-optimization",
      title: t("features.atsOptimization.title"),
      description: t("features.atsOptimization.description"),
      icon: ChartBarIcon,
      color: "from-orange-500 to-red-500",
      bgColor: "bg-orange-50",
    },
    {
      id: "job-matching",
      title: t("features.jobMatching.title"),
      description: t("features.jobMatching.description"),
      icon: MagnifyingGlassIcon,
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-50",
    },
    {
      id: "templates",
      title: t("features.templates.title"),
      description: t("features.templates.description"),
      icon: DocumentTextIcon,
      color: "from-blue-500 to-indigo-500",
      bgColor: "bg-blue-50",
    },
  ];

  const benefits = [
    t("benefits.noRegistration"),
    t("benefits.freeToUse"),
    t("benefits.privacyFirst"),
    t("benefits.bilingual"),
    t("benefits.openSource"),
    t("benefits.multipleFormats"),
  ];

  const howItWorks = [
    {
      step: 1,
      title: t("howItWorks.step1.title"),
      description: t("howItWorks.step1.description"),
      icon: DocumentTextIcon,
    },
    {
      step: 2,
      title: t("howItWorks.step2.title"),
      description: t("howItWorks.step2.description"),
      icon: SparklesIcon,
    },
    {
      step: 3,
      title: t("howItWorks.step3.title"),
      description: t("howItWorks.step3.description"),
      icon: CheckCircleIcon,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 rtl:space-x-reverse bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full px-4 py-2 mb-6">
            <InformationCircleIcon className="h-5 w-5 text-indigo-600" />
            <span className="text-indigo-700 font-medium text-sm">
              {t("badge")}
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6">
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              {t("title")}
            </span>
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            {t("subtitle")}
          </p>
        </div>

        {/* Introduction */}
        <div className="bg-white rounded-3xl p-12 shadow-xl border border-gray-100 mb-16">
          <div className="text-center mb-8">
            <LightBulbIcon className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {t("introduction.title")}
            </h2>
          </div>
          <p className="text-lg text-gray-700 leading-relaxed text-center max-w-4xl mx-auto">
            {t("introduction.content")}
          </p>
        </div>

        {/* Features Grid */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {t("featuresSection.title")}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t("featuresSection.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature) => (
              <div
                key={feature.id}
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className={`${feature.bgColor} rounded-xl p-4 w-fit mb-6`}>
                  <feature.icon className="h-8 w-8 text-gray-700" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {t("howItWorksSection.title")}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t("howItWorksSection.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {howItWorks.map((step) => (
              <div key={step.step} className="text-center">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                  {step.step}
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <step.icon className="h-8 w-8 text-indigo-600 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-3xl p-12 mb-16 border border-indigo-100">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {t("benefitsSection.title")}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t("benefitsSection.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 rtl:space-x-reverse bg-white rounded-xl p-4 shadow-sm"
              >
                <CheckCircleIcon className="h-6 w-6 text-green-600 flex-shrink-0" />
                <span className="text-gray-700 font-medium">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Technology Stack */}
        <div className="bg-white rounded-3xl p-12 shadow-xl border border-gray-100 mb-16">
          <div className="text-center mb-8">
            <CogIcon className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {t("technology.title")}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t("technology.content")}
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-12 text-white mb-8">
            <h2 className="text-3xl font-bold mb-4">{t("cta.title")}</h2>
            <p className="text-xl mb-8 opacity-90">{t("cta.subtitle")}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={`/${locale}/create-cv`}
                className="group bg-white text-indigo-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300 flex items-center justify-center gap-3 shadow-lg"
              >
                <SparklesIcon className="h-5 w-5" />
                <span>{t("cta.button")}</span>
              </Link>
            </div>
          </div>

          <Link
            href={`/${locale}`}
            className="group border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 inline-flex items-center gap-2"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            <span>{tCommon("backHome")}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
