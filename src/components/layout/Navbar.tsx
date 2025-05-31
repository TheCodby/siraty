"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
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
  const [mounted, setMounted] = useState(false);
  const t = useTranslations("navigation");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  // Handle hydration
  useEffect(() => {
    setMounted(true);
  }, []);

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
  const isRTL = locale === "ar";

  if (!mounted) {
    return null; // Prevent hydration mismatch
  }

  return (
    <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/60 dark:border-gray-700/60 sticky top-0 z-50 shadow-sm dark:shadow-gray-900/20 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link
              href={`/${locale}`}
              className="flex items-center space-x-3 rtl:space-x-reverse group"
            >
              <div className="relative">
                <div className="relative w-12 h-8 transition-all duration-300 group-hover:scale-105">
                  <Image
                    src="/siraty-logo.png"
                    alt="سيرتي - Siraty"
                    fill
                    className="object-contain rounded-lg shadow-md group-hover:shadow-lg transition-all duration-300"
                    priority
                  />
                </div>
                <div className="absolute -inset-1 bg-gradient-to-br from-blue-500 to-teal-500 rounded-lg blur opacity-20 group-hover:opacity-40 transition-opacity duration-300 -z-10"></div>
              </div>
              <div className="hidden sm:flex flex-col">
                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
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
                  className={`relative flex items-center space-x-2 rtl:space-x-reverse px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 group ${
                    isActive
                      ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 shadow-sm"
                      : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  }`}
                >
                  <span className="text-base transition-transform duration-200 group-hover:scale-110">
                    {item.icon}
                  </span>
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
                className="flex items-center space-x-2 rtl:space-x-reverse px-3 py-2.5 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-sm"
                aria-label={t("language")}
              >
                <GlobeAltIcon className="h-4 w-4" />
                <span className="text-sm font-medium">{currentLang?.flag}</span>
                <span className="hidden sm:block text-sm font-medium">
                  {currentLang?.name}
                </span>
                <ChevronDownIcon
                  className={`h-3 w-3 transition-transform duration-300 ${
                    isLangOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isLangOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsLangOpen(false)}
                  />
                  <div
                    className={`absolute ${
                      isRTL ? "left-0" : "right-0"
                    } top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-900/40 border border-gray-200 dark:border-gray-700 py-2 z-20 backdrop-blur-sm`}
                  >
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang.code)}
                        className={`w-full flex items-center space-x-3 rtl:space-x-reverse px-4 py-3 text-sm hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200 ${
                          locale === lang.code
                            ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30"
                            : "text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        <span className="text-base">{lang.flag}</span>
                        <span className="font-medium">{lang.name}</span>
                        {locale === lang.code && (
                          <div
                            className={`${
                              isRTL ? "mr-auto" : "ml-auto"
                            } w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full`}
                          ></div>
                        )}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Theme Switcher */}
            <button
              onClick={handleThemeToggle}
              className="relative p-2.5 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-sm group"
              aria-label="Toggle theme"
            >
              <div className="relative w-4 h-4">
                <SunIcon
                  className={`absolute inset-0 h-4 w-4 transition-all duration-500 ${
                    theme === "light"
                      ? "rotate-0 scale-100 opacity-100"
                      : "rotate-90 scale-0 opacity-0"
                  }`}
                />
                <MoonIcon
                  className={`absolute inset-0 h-4 w-4 transition-all duration-500 ${
                    theme === "dark"
                      ? "rotate-0 scale-100 opacity-100"
                      : "-rotate-90 scale-0 opacity-0"
                  }`}
                />
              </div>
            </button>

            {/* CTA Button */}
            <Link
              href={`/${locale}/create-cv`}
              className="hidden sm:flex items-center space-x-2 rtl:space-x-reverse bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2.5 rounded-xl font-medium transition-all duration-300 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 hover:scale-105"
            >
              <span>✨</span>
              <span>Create CV</span>
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2.5 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600"
              aria-label="Open main menu"
            >
              <div className="relative w-5 h-5">
                <Bars3Icon
                  className={`absolute inset-0 h-5 w-5 transition-all duration-300 ${
                    isOpen
                      ? "rotate-90 scale-0 opacity-0"
                      : "rotate-0 scale-100 opacity-100"
                  }`}
                />
                <XMarkIcon
                  className={`absolute inset-0 h-5 w-5 transition-all duration-300 ${
                    isOpen
                      ? "rotate-0 scale-100 opacity-100"
                      : "-rotate-90 scale-0 opacity-0"
                  }`}
                />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`lg:hidden border-t border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out ${
          isOpen
            ? "max-h-screen opacity-100"
            : "max-h-0 opacity-0 overflow-hidden"
        }`}
      >
        <div className="px-4 pt-4 pb-6 space-y-2 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm">
          {navigation.map((item, index) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center space-x-3 rtl:space-x-reverse px-4 py-4 rounded-xl font-medium transition-all duration-300 transform ${
                  isActive
                    ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 shadow-sm scale-105"
                    : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:scale-105"
                }`}
                style={{
                  animationDelay: `${index * 50}ms`,
                }}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.name}</span>
                {isActive && (
                  <div className="ml-auto rtl:mr-auto w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
                )}
              </Link>
            );
          })}

          {/* Mobile CTA */}
          <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
            <Link
              href={`/${locale}/create-cv`}
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center space-x-2 rtl:space-x-reverse bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-4 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <span>✨</span>
              <span>Create CV</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
