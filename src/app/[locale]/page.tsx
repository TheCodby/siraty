import { useTranslations } from "next-intl";
import Link from "next/link";
import { useLocale } from "next-intl";
import Navbar from "@/components/layout/Navbar";
import {
  DocumentTextIcon,
  SparklesIcon,
  MagnifyingGlassIcon,
  ChartBarIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  StarIcon,
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

  const testimonials = [
    {
      name: "Sarah Ahmed",
      role: "Software Engineer",
      content:
        "سيرتي helped me create a professional CV that got me interviews at top tech companies!",
      rating: 5,
      avatar: "👩‍💻",
    },
    {
      name: "Mohammed Ali",
      role: "Marketing Manager",
      content:
        "The AI suggestions were incredibly helpful. I landed my dream job within 2 weeks!",
      rating: 5,
      avatar: "👨‍💼",
    },
    {
      name: "Fatima Hassan",
      role: "Data Scientist",
      content:
        "Amazing tool! The ATS optimization feature made all the difference.",
      rating: 5,
      avatar: "👩‍🔬",
    },
  ];

  const stats = [
    { number: "50K+", label: "CVs Created" },
    { number: "85%", label: "Success Rate" },
    { number: "200+", label: "Companies" },
    { number: "4.9★", label: "User Rating" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 rtl:space-x-reverse bg-gradient-to-r from-blue-100 to-purple-100 rounded-full px-4 py-2 mb-8">
              <SparklesIcon className="h-5 w-5 text-blue-600" />
              <span className="text-blue-700 font-medium text-sm">
                AI-Powered Career Coach
              </span>
            </div>

            <h1 className="text-5xl sm:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                {t("title")}
              </span>
            </h1>

            <p className="text-xl sm:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
              {t("subtitle")}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
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
                href={`/${locale}/improve-cv`}
                className="group border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 flex items-center gap-2"
              >
                <DocumentTextIcon className="h-5 w-5" />
                <span>{t("learnMore")}</span>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
                    {stat.number}
                  </div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
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
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Powerful Tools for Your
              <span className="block bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Career Success
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to create, improve, and optimize your resume
              with AI assistance
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Link
                key={feature.name}
                href={feature.href}
                className="group relative bg-white rounded-2xl p-8 shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-gray-200 transform hover:-translate-y-2"
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

                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors">
                    {feature.name}
                  </h3>

                  <p className="text-gray-600 leading-relaxed mb-6">
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

      {/* Testimonials */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 rtl:space-x-reverse bg-gradient-to-r from-green-100 to-emerald-100 rounded-full px-4 py-2 mb-4">
              <CheckCircleIcon className="h-4 w-4 text-green-600" />
              <span className="text-green-700 font-medium text-sm">
                Success Stories
              </span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Loved by Job Seekers
              <span className="block bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Worldwide
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.name}
                className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="flex items-center space-x-1 rtl:space-x-reverse mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <StarIcon
                      key={i}
                      className="h-5 w-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>

                <p className="text-gray-700 mb-6 leading-relaxed">
                  &quot;{testimonial.content}&quot;
                </p>

                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <div className="text-2xl">{testimonial.avatar}</div>
                  <div>
                    <div className="font-semibold text-gray-900">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </div>
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
                Ready to Build Your
                <span className="block">Perfect CV?</span>
              </h2>
              <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
                Join thousands of job seekers who have improved their careers
                with our AI-powered tools
              </p>
              <Link
                href={`/${locale}/create-cv`}
                className="group inline-flex items-center space-x-3 rtl:space-x-reverse bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <SparklesIcon className="h-5 w-5" />
                <span>Start Building Now</span>
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
      <footer className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">س</span>
            </div>
            <span className="ml-3 text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              سيرتي
            </span>
          </div>
          <p className="text-gray-400 mb-4">
            Building better careers with AI-powered tools
          </p>
          <p className="text-gray-500 text-sm">
            © 2024 Siraty. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
