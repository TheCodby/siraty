"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";

interface StepPlaceholderProps {
  title: string;
  description: string;
  nextButtonText: string;
  onNext: () => void;
  onPrevious: () => void;
  isLastStep?: boolean;
}

export const StepPlaceholder: React.FC<StepPlaceholderProps> = ({
  title,
  description,
  nextButtonText,
  onNext,
  onPrevious,
  isLastStep = false,
}) => {
  const t = useTranslations("development");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const isRTL = locale === "ar";

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <Alert>
          <InfoIcon className="h-4 w-4" />
          <AlertDescription>
            <strong>{t("inProgress")}</strong>
            <br />
            {t("inProgressDescription")}
          </AlertDescription>
        </Alert>

        <div
          className={`flex justify-between pt-6 border-t ${
            isRTL ? "flex-row-reverse" : "flex-row"
          }`}
        >
          <Button type="button" variant="outline" onClick={onPrevious}>
            {tCommon("previous")}
          </Button>
          <Button
            type="button"
            onClick={onNext}
            variant={isLastStep ? "default" : "default"}
            className={isLastStep ? "bg-green-600 hover:bg-green-700" : ""}
          >
            {nextButtonText}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
