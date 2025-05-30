"use client";

import { useState, useMemo } from "react";
import {
  Check,
  Crown,
  Star,
  FileText,
  Briefcase,
  Palette,
  Minimize,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  WORD_TEMPLATES,
  getRecommendedTemplates,
} from "@/lib/templates/registry";
import type { WordTemplate, CVData } from "@/types";
import Image from "next/image";

interface TemplateSelectorProps {
  cvData: CVData;
  selectedTemplate: WordTemplate | null;
  onSelectTemplate: (template: WordTemplate) => void;
  className?: string;
}

const categoryIcons = {
  professional: Briefcase,
  creative: Palette,
  academic: FileText,
  modern: Minimize,
} as const;

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  cvData,
  selectedTemplate,
  onSelectTemplate,
  className = "",
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const templates = WORD_TEMPLATES;
  const recommendedTemplates = getRecommendedTemplates({
    industry: "technology", // You can derive this from CV data
    isPremiumUser: false, // You can get this from user context
  });
  const recommendedTemplate = recommendedTemplates[0];

  const categories = useMemo(() => {
    const cats = new Set(templates.map((t: WordTemplate) => t.category));
    return Array.from(cats);
  }, [templates]);

  const filteredTemplates = useMemo(() => {
    if (selectedCategory === "all") return templates;
    return templates.filter(
      (t: WordTemplate) => t.category === selectedCategory
    );
  }, [templates, selectedCategory]);

  const getTemplatePreviewUrl = (template: WordTemplate) => {
    return template.previewImage;
  };

  const handleTemplateSelect = (template: WordTemplate) => {
    onSelectTemplate(template);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Choose Your CV Template
        </h2>
        <p className="text-muted-foreground">
          Select a professional template that matches your style and industry
        </p>
      </div>

      {/* Recommendation */}
      {recommendedTemplate && (
        <Alert>
          <Star className="h-4 w-4" />
          <AlertDescription>
            <strong>Recommended for you:</strong> {recommendedTemplate.name} -
            Perfect for{" "}
            {cvData.personalInfo.summary
              ? "your professional background"
              : "getting started"}
          </AlertDescription>
        </Alert>
      )}

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 justify-center">
        <Button
          variant={selectedCategory === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedCategory("all")}
        >
          All Templates
        </Button>
        {categories.map((category: string) => {
          const Icon =
            categoryIcons[category as keyof typeof categoryIcons] || FileText;
          return (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="capitalize"
            >
              <Icon className="h-4 w-4 mr-1" />
              {category}
            </Button>
          );
        })}
      </div>

      {/* Template Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template: WordTemplate) => (
          <div key={template.id} className="relative">
            <Label htmlFor={template.id} className="cursor-pointer">
              <Card
                className={`transition-all duration-200 hover:shadow-lg ${
                  selectedTemplate?.id === template.id
                    ? "ring-2 ring-primary shadow-lg"
                    : "hover:shadow-md"
                }`}
              >
                {/* Preview Image */}
                <div className="relative">
                  <Image
                    src={getTemplatePreviewUrl(template)}
                    alt={`${template.name} preview`}
                    width={300}
                    height={200}
                    className="w-full h-48 object-cover rounded-t-lg"
                    onError={(e) => {
                      // Fallback to placeholder if image doesn't exist
                      (e.target as HTMLImageElement).src =
                        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y4ZjlmYSIvPgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTRweCIgZmlsbD0iIzY5NzU4MyIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkNWIFRlbXBsYXRlPC90ZXh0Pgo8L3N2Zz4K";
                    }}
                  />

                  {/* Premium Badge */}
                  {template.isPremium && (
                    <div className="absolute top-2 right-2">
                      <Badge
                        variant="secondary"
                        className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white"
                      >
                        <Crown className="h-3 w-3 mr-1" />
                        Premium
                      </Badge>
                    </div>
                  )}

                  {/* Recommendation Badge */}
                  {recommendedTemplate?.id === template.id && (
                    <div className="absolute top-2 left-2">
                      <Badge variant="default">
                        <Star className="h-3 w-3 mr-1" />
                        Recommended
                      </Badge>
                    </div>
                  )}

                  {/* Selection Indicator */}
                  {selectedTemplate?.id === template.id && (
                    <div className="absolute inset-0 bg-primary/10 flex items-center justify-center rounded-t-lg">
                      <div className="bg-primary text-primary-foreground rounded-full p-2">
                        <Check className="h-6 w-6" />
                      </div>
                    </div>
                  )}
                </div>

                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center justify-between">
                    {template.name}
                  </CardTitle>
                  <CardDescription className="text-sm">
                    {template.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="space-y-3">
                    {/* Category */}
                    <div className="flex flex-wrap gap-1">
                      <Badge variant="outline" className="text-xs capitalize">
                        {template.category}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {template.supportedLanguages.join(", ").toUpperCase()}
                      </Badge>
                    </div>

                    {/* Use Button */}
                    <Button
                      size="sm"
                      className="w-full"
                      variant={
                        selectedTemplate?.id === template.id
                          ? "default"
                          : "outline"
                      }
                      disabled={template.isPremium} // You can add premium logic here
                      onClick={() => handleTemplateSelect(template)}
                    >
                      {selectedTemplate?.id === template.id ? (
                        <>
                          <Check className="h-4 w-4 mr-1" />
                          Selected
                        </>
                      ) : template.isPremium ? (
                        <>
                          <Crown className="h-4 w-4 mr-1" />
                          Upgrade to Use
                        </>
                      ) : (
                        "Select Template"
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Label>
          </div>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground">
            No templates found in this category
          </p>
        </div>
      )}

      {/* Selected Template Info */}
      {selectedTemplate && (
        <Card className="bg-primary/5">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Check className="h-5 w-5 text-primary" />
              {selectedTemplate.name} Selected
            </CardTitle>
            <CardDescription>{selectedTemplate.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Category:</span>
                <p className="text-muted-foreground capitalize">
                  {selectedTemplate.category}
                </p>
              </div>
              <div>
                <span className="font-medium">Languages:</span>
                <p className="text-muted-foreground">
                  {selectedTemplate.supportedLanguages.join(", ").toUpperCase()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
