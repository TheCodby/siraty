"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import {
  Bars3Icon,
  XMarkIcon,
  MoonIcon,
  SunIcon,
  ChevronDownIcon,
  GlobeAltIcon,
} from "@heroicons/react/24/outline";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const t = useTranslations("navigation");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useAppStore();

  const handleLanguageChange = (newLocale: string) => {
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath);
    setIsLangOpen(false);
  };

  const handleThemeToggle = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const navigation = [
    {
      name: t("home"),
      href: `/${locale}`,
      icon: "🏠",
    },
    {
      name: t("createCV"),
      href: `/${locale}/create-cv`,
      icon: "📝",
    },
    {
      name: t("improveCV"),
      href: `/${locale}/improve-cv`,
      icon: "✨",
    },
    {
      name: t("matchJD"),
      href: `/${locale}/match-jd`,
      icon: "🎯",
    },
    {
      name: t("atsScore"),
      href: `/${locale}/ats-score`,
      icon: "📊",
    },
  ];

  const languages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "ar", name: "العربية", flag: "🇸🇦" },
  ];

  const currentLang = languages.find((lang) => lang.code === locale);

  return (
    <nav className="bg-white/95 backdrop-blur-lg border-b border-gray-200/60 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link
              href={`/${locale}`}
              className="flex items-center space-x-3 rtl:space-x-reverse group"
            >
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                  <span className="text-white font-bold text-lg">س</span>
                </div>
                <div className="absolute -inset-1 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300 -z-10"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 bg-clip-text text-transparent">
                  سيرتي
                </span>
                <span className="text-xs text-gray-500 font-medium">
                  AI Career Coach
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1 rtl:space-x-reverse">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`relative flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 group ${
                    isActive
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                  }`}
                >
                  <span className="text-base">{item.icon}</span>
                  <span>{item.name}</span>
                  {isActive && (
                    <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right side controls */}
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center space-x-2 rtl:space-x-reverse px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-all duration-200 border border-gray-200 hover:border-blue-300"
                aria-label={t("language")}
              >
                <GlobeAltIcon className="h-4 w-4" />
                <span className="text-sm font-medium">{currentLang?.flag}</span>
                <span className="hidden sm:block text-sm font-medium">
                  {currentLang?.name}
                </span>
                <ChevronDownIcon
                  className={`h-3 w-3 transition-transform duration-200 ${
                    isLangOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isLangOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang.code)}
                      className={`w-full flex items-center space-x-3 rtl:space-x-reverse px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                        locale === lang.code
                          ? "text-blue-600 bg-blue-50"
                          : "text-gray-700"
                      }`}
                    >
                      <span className="text-base">{lang.flag}</span>
                      <span className="font-medium">{lang.name}</span>
                      {locale === lang.code && (
                        <div className="ml-auto w-2 h-2 bg-blue-600 rounded-full"></div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Theme Switcher */}
            <button
              onClick={handleThemeToggle}
              className="p-2.5 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-all duration-200 border border-gray-200 hover:border-blue-300"
              aria-label="Toggle theme"
            >
              {theme === "light" ? (
                <MoonIcon className="h-4 w-4" />
              ) : (
                <SunIcon className="h-4 w-4" />
              )}
            </button>

            {/* CTA Button */}
            <Link
              href={`/${locale}/create-cv`}
              className="hidden sm:flex items-center space-x-2 rtl:space-x-reverse bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <span>✨</span>
              <span>Create CV</span>
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2.5 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-all duration-200 border border-gray-200 hover:border-blue-300"
              aria-label="Open main menu"
            >
              {isOpen ? (
                <XMarkIcon className="h-5 w-5" />
              ) : (
                <Bars3Icon className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="lg:hidden border-t border-gray-200">
          <div className="px-4 pt-4 pb-6 space-y-2 bg-white">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-3 rtl:space-x-reverse px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                    isActive
                      ? "text-blue-600 bg-blue-50 border-l-4 border-blue-600"
                      : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              );
            })}

            {/* Mobile CTA */}
            <div className="pt-4 border-t border-gray-200">
              <Link
                href={`/${locale}/create-cv`}
                className="flex items-center justify-center space-x-2 rtl:space-x-reverse bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-sm"
                onClick={() => setIsOpen(false)}
              >
                <span>✨</span>
                <span>Create Your CV Now</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Backdrop for mobile menu */}
      {(isOpen || isLangOpen) && (
        <div
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          onClick={() => {
            setIsOpen(false);
            setIsLangOpen(false);
          }}
        />
      )}
    </nav>
  );
};

export default Navbar;
