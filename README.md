# سيرتي (Siraty) - AI-Powered Career Coaching Tool

<div align="center">
  <img src="https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js" alt="Next.js 15" />
  <img src="https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind-4-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/i18n-Bilingual-green?style=for-the-badge" alt="Bilingual Support" />
</div>

## 🌟 Overview

**سيرتي (Siraty)** is a bilingual (Arabic/English) AI-powered career coaching platform that helps job seekers create, optimize, and enhance their CVs using artificial intelligence. The name "سيرتي" means "My CV" in Arabic, reflecting our commitment to personalized career development for Arabic and English speakers.

## ✨ Features

### 🤖 AI-Powered CV Enhancement

- **Smart CV Creation**: Build professional CVs with AI assistance
- **Intelligent Optimization**: Get AI-powered suggestions to improve your CV
- **Bilingual Support**: Full Arabic and English language support with RTL layout
- **Real-time Chat**: Interactive AI assistant for CV improvement guidance

### 📊 Professional Analysis Tools

- **ATS Scoring**: Analyze your CV against Applicant Tracking Systems
- **Job Description Matching**: Compare your CV with specific job requirements
- **Keyword Optimization**: Improve CV visibility with relevant industry keywords
- **Format Analysis**: Ensure your CV follows best practices and formatting standards

### 🌐 Accessibility & Localization

- **RTL Support**: Native right-to-left layout for Arabic users
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Cultural Adaptation**: CV templates and advice tailored for different markets

## 🚀 Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/) for type safety
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) for modern UI
- **State Management**: [Zustand](https://github.com/pmndrs/zustand) for efficient state handling
- **Internationalization**: [next-intl](https://next-intl-docs.vercel.app/) for i18n support
- **UI Components**: [Radix UI](https://www.radix-ui.com/) + [Lucide React](https://lucide.dev/) icons
- **Form Validation**: [Zod](https://zod.dev/) for schema validation
- **AI Integration**: OpenAI API for intelligent CV enhancement

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.0 or later)
- **npm**, **yarn**, **pnpm**, or **bun** package manager
- **Git** for version control

## 🛠️ Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/TheCodby/siraty.git
   cd siraty
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Add your environment variables:

   ```env
   # OpenAI API Configuration
   OPENAI_API_KEY=your_openai_api_key_here

   # Application URL (for production)
   NEXTAUTH_URL=http://localhost:3000

   # Database (if using)
   DATABASE_URL=your_database_url_here
   ```

4. **Run the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

5. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## 🏗️ Project Structure

```
siraty/
├── src/
│   ├── app/                     # Next.js App Router
│   │   ├── [locale]/           # Internationalized routes
│   │   │   ├── layout.tsx      # Root layout with i18n
│   │   │   ├── page.tsx        # Homepage
│   │   │   ├── create-cv/      # CV creation flow
│   │   │   ├── improve-cv/     # AI enhancement chat
│   │   │   ├── match-jd/       # Job description matching
│   │   │   └── ats-score/      # ATS scoring results
│   │   ├── api/                # API routes
│   │   │   ├── chat/           # AI chat endpoints
│   │   │   └── score/          # ATS scoring logic
│   │   └── globals.css         # Global styles
│   │
│   ├── components/             # Reusable UI components
│   │   ├── ui/                 # Base UI components (buttons, inputs, etc.)
│   │   └── layout/             # Layout components (header, footer, etc.)
│   │
│   ├── features/               # Feature-specific components and logic
│   │   ├── cv-builder/         # CV creation functionality
│   │   ├── ai-chat/            # AI chat interface
│   │   ├── jd-matching/        # Job description matching
│   │   └── ats-grading/        # ATS scoring features
│   │
│   ├── lib/                    # Utility functions and configurations
│   │   ├── openai.ts           # OpenAI API client
│   │   ├── utils.ts            # General utilities
│   │   └── validations.ts      # Zod schemas
│   │
│   ├── types/                  # TypeScript type definitions
│   ├── i18n/                   # Internationalization configuration
│   └── middleware.ts           # Next.js middleware for i18n
│
├── locales/                    # Translation files
│   ├── en.json                 # English translations
│   └── ar.json                 # Arabic translations
│
├── public/                     # Static assets
├── components.json             # shadcn/ui configuration
├── next.config.ts              # Next.js configuration
├── tailwind.config.ts          # Tailwind CSS configuration
└── tsconfig.json              # TypeScript configuration
```

## 🌍 Internationalization

The application supports both Arabic and English:

- **English**: `/en/...` routes
- **Arabic**: `/ar/...` routes with RTL layout
- **Auto-detection**: Automatically detects browser language preference
- **Language Switching**: Users can switch languages at any time

### Adding New Languages

1. Create a new translation file in `locales/[locale].json`
2. Update the `i18n/config.ts` to include the new locale
3. Add the locale to `middleware.ts` for routing

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
5. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
6. **Open a Pull Request**

### Development Guidelines

- Follow the existing code style and conventions
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting

## 📜 Scripts

| Script               | Description              |
| -------------------- | ------------------------ |
| `npm run dev`        | Start development server |
| `npm run build`      | Build for production     |
| `npm run start`      | Start production server  |
| `npm run lint`       | Run ESLint               |
| `npm run lint:fix`   | Fix ESLint issues        |
| `npm run type-check` | Run TypeScript checks    |

## 🚀 Deployment

Coming Soon...

## 🔧 Environment Variables

| Variable         | Description                        | Required |
| ---------------- | ---------------------------------- | -------- |
| `OPENAI_API_KEY` | OpenAI API key for AI features     | Yes      |
| `NEXTAUTH_URL`   | Application URL for authentication | No       |
| `DATABASE_URL`   | Database connection string         | No       |

## 📱 Browser Support

- **Chrome** (latest)
- **Firefox** (latest)
- **Safari** (latest)
- **Edge** (latest)
- **Mobile browsers** (iOS Safari, Chrome Mobile)

## 🔒 Security

- API routes are protected with rate limiting
- Input validation using Zod schemas
- Secure environment variable handling
- CORS protection for API endpoints

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 💬 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/TheCodby/siraty/issues) page
2. Create a new issue with a detailed description
3. Join our community discussions

## 🙏 Acknowledgments

- **Next.js team** for the amazing framework
- **Vercel** for hosting and deployment tools
- **OpenAI** for AI capabilities
- **Tailwind CSS** for the utility-first CSS framework
- **Radix UI** for accessible component primitives

---

<div align="center">
  <p>Built with ❤️ for the Arabic and English speaking communities</p>
  <p>سيرتي - طريقك نحو مستقبل مهني أفضل</p>
</div>
