# 🗄️ Database Schema for "سيرتي" (Siraty)

## 📋 Overview

This document outlines the database schema for the Siraty career coaching AI tool. The schema is designed with simplicity and scalability in mind, starting without authentication and focusing on core CV/resume functionality.

## 🎯 **Why Prisma?**

For this project, **Prisma** is recommended over Drizzle for these reasons:

- ✅ **Mature ecosystem** with excellent TypeScript support
- ✅ **Robust migration system** crucial for evolving CV schemas
- ✅ **Better developer experience** for rapid development
- ✅ **Excellent documentation** and community support
- ✅ **Schema-first approach** that aligns well with structured CV data
- ✅ **Built-in validation** and type generation
- ✅ **Great tooling** (Prisma Studio for data visualization)

## 🏗️ **Schema Structure**

### Core Entities

#### 1. **CV (Resume)**

- **Purpose**: Main CV/resume entity containing personal information
- **Key Features**:
  - Bilingual support (Arabic/English)
  - Embedded personal information for quick access
  - Soft delete capability with `isActive` flag
  - Timestamp tracking

#### 2. **Work Experience**

- **Purpose**: Professional experience entries
- **Key Features**:
  - Support for current roles and date ranges
  - Achievement tracking as string arrays
  - Technology stack recording
  - Sortable order for display

#### 3. **Education**

- **Purpose**: Academic background
- **Key Features**:
  - GPA and honors tracking
  - Relevant coursework listing
  - Flexible date handling

#### 4. **Skills**

- **Purpose**: Technical and soft skills
- **Key Features**:
  - Categorized (Technical, Soft, Language)
  - Skill level assessment
  - Sortable for custom ordering

#### 5. **Projects**

- **Purpose**: Portfolio projects and personal work
- **Key Features**:
  - Technology stack tracking
  - Link to live demos and repositories
  - Date range support

#### 6. **Certifications**

- **Purpose**: Professional certifications and achievements
- **Key Features**:
  - Expiry date tracking
  - Credential ID and verification links
  - Issuer information

### AI & Analysis Entities

#### 7. **JobDescription**

- **Purpose**: Job posting data for matching
- **Key Features**:
  - Structured requirements and responsibilities
  - Skills extraction
  - Salary and benefits information

#### 8. **JobMatch**

- **Purpose**: CV-Job matching results
- **Key Features**:
  - Overall match percentage
  - Detailed category scoring (JSON)
  - Improvement recommendations
  - Priority-based suggestions

#### 9. **ATSScore**

- **Purpose**: Applicant Tracking System compatibility scoring
- **Key Features**:
  - Category-wise scoring (formatting, keywords, experience, etc.)
  - Pass rate estimation
  - Detailed feedback per category

#### 10. **ChatSession & ChatMessage**

- **Purpose**: AI conversation tracking
- **Key Features**:
  - Purpose-driven sessions (CV improvement, job matching, etc.)
  - Bilingual support
  - Token usage tracking for cost management
  - Model versioning support

#### 11. **CVTemplate**

- **Purpose**: Resume templates
- **Key Features**:
  - Bilingual template support
  - JSON-based template structure
  - Category-based organization

## 🔄 **Relationships**

```
CV (1:many) → WorkExperience
CV (1:many) → Education
CV (1:many) → Skills
CV (1:many) → Projects
CV (1:many) → Certifications
CV (1:many) → Languages
CV (1:many) → ATSScores
CV (1:many) → ChatSessions
CV (1:many) → JobMatches

JobDescription (1:many) → JobMatches

ChatSession (1:many) → ChatMessages
ChatSession (many:1) → CV [optional]
```

## 📊 **JSON Fields Structure**

### ATSScore JSON Fields

```typescript
formattingScore: {
  score: number,
  feedback: string[]
}

keywordsScore: {
  score: number,
  matched: string[],
  missing: string[],
  feedback: string[]
}
```

### JobMatch JSON Fields

```typescript
skillsMatch: {
  matched: string[],
  missing: string[],
  percentage: number
}

improvementAreas: Array<{
  area: string,
  priority: "high" | "medium" | "low",
  suggestions: string[]
}>
```

## 🚀 **Getting Started**

### 1. **Set Up Database (Future)**

```bash
# When ready to use Prisma
npm install prisma @prisma/client
npx prisma init
npx prisma generate
npx prisma db push
```

### 2. **Current Implementation**

For now, the project uses mock data and in-memory storage in `src/lib/db.ts`. This allows development to proceed without database setup while maintaining the same API structure.

### 3. **Migration Path**

When ready to implement the database:

1. Install Prisma dependencies
2. Replace mock functions in `src/lib/db.ts` with actual Prisma calls
3. Run migrations
4. Seed initial data

## 🔧 **Best Practices Implemented**

### Data Modeling

- ✅ **Normalized structure** with proper relationships
- ✅ **JSON fields** for flexible, evolving data (scores, metadata)
- ✅ **String arrays** for simple lists (achievements, technologies)
- ✅ **Soft deletes** for important entities
- ✅ **Timestamp tracking** on all entities

### Performance

- ✅ **Proper indexing** on foreign keys
- ✅ **Unique constraints** where needed
- ✅ **Cascade deletes** for data integrity
- ✅ **Sort order fields** for UI ordering

### Scalability

- ✅ **Bilingual support** baked into schema
- ✅ **Extensible JSON fields** for future features
- ✅ **Template system** for CV customization
- ✅ **Activity tracking** ready for analytics

### Developer Experience

- ✅ **TypeScript-first** approach
- ✅ **Clear naming conventions**
- ✅ **Comprehensive type definitions**
- ✅ **Utility functions** for common operations

## 📈 **Future Enhancements**

When authentication is added:

1. Add `User` model with authentication fields
2. Add `userId` foreign keys to relevant models
3. Implement proper authorization checks
4. Add user activity tracking

When analytics are needed:

1. Add `UserActivity` model for tracking
2. Implement event logging
3. Add dashboard queries

## 🔐 **Security Considerations**

- Personal data is contained within CV entities
- JSON fields allow for flexible data without exposing internal structure
- Cascade deletes ensure data consistency
- Ready for row-level security when authentication is added

---

This schema provides a solid foundation for the Siraty project, balancing simplicity with future extensibility.
