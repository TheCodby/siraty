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
            <strong>Development in Progress</strong>
            <br />
            This step is currently under development. We&apos;re working hard to
            bring you the best CV building experience!
          </AlertDescription>
        </Alert>

        <div className="flex justify-between pt-6 border-t">
          <Button type="button" variant="outline" onClick={onPrevious}>
            Previous
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
