// MarketReady.ai Onboarding Wizard Page
'use client';

import { useState } from 'react';
import { z } from 'zod';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { cn } from '~/lib/utils';
import { Button } from '@kit/ui/button';
import { Progress } from '@kit/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@kit/ui/card';
import { Input } from '@kit/ui/input';
import { useRouter } from 'next/navigation';
import { Heading } from '@kit/ui/heading';
import { Trans } from 'react-i18next';
import { AppLogo } from '~/components/app-logo';

// --- Step Schemas ---
const PersonalInfoSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  company: z.string().optional(),
  profilePicture: z.string().optional(),
});

const BusinessInfoSchema = z.object({
  propertyType: z.string().min(1, 'Property type is required'),
  state: z.string().min(1, 'State is required'),
  timezone: z.string().optional(),
});

const IntegrationSetupSchema = z.object({
  rpDataApiKey: z.string().optional(),
  canvaApiKey: z.string().optional(),
});

const steps = [
  {
    label: 'Personal Info',
    schema: PersonalInfoSchema,
  },
  {
    label: 'Business Info',
    schema: BusinessInfoSchema,
  },
  {
    label: 'Integrations',
    schema: IntegrationSetupSchema,
  },
];

const totalSteps = steps.length;

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [formData, setFormData] = useState({});

  // Compose all schemas for final validation
  const FullSchema = PersonalInfoSchema.merge(BusinessInfoSchema).merge(IntegrationSetupSchema);

  const methods = useForm({
    resolver: zodResolver(steps[step].schema),
    defaultValues: formData,
    mode: 'onChange',
  });

  const onSubmit = async (data: any) => {
    // Save progress for this step
    setFormData((prev) => ({ ...prev, ...data }));
    if (step < totalSteps - 1) {
      setStep(step + 1);
    } else {
      // Final submit: validate all data
      const result = FullSchema.safeParse({ ...formData, ...data });
      if (!result.success) {
        // Should not happen, but just in case
        return;
      }
      // TODO: Persist onboarding data to backend (Supabase)
      // TODO: Set hasCompletedOnboarding flag via server action
      setCompleted(true);
      // Redirect to dashboard after short delay
      setTimeout(() => {
        router.replace('/home');
      }, 1200);
    }
  };

  // UI for each step
  function StepFields() {
    switch (step) {
      case 0:
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <Input label="First Name" {...methods.register('firstName')} autoFocus />
              <Input label="Last Name" {...methods.register('lastName')} />
            </div>
            <Input label="Company (optional)" {...methods.register('company')} className="mt-4" />
            {/* Profile picture uploader could go here */}
          </>
        );
      case 1:
        return (
          <>
            <Input label="Property Type" {...methods.register('propertyType')} autoFocus />
            <Input label="State" {...methods.register('state')} className="mt-4" />
            <Input label="Timezone (optional)" {...methods.register('timezone')} className="mt-4" />
          </>
        );
      case 2:
        return (
          <>
            <Input label="RP Data API Key (optional)" {...methods.register('rpDataApiKey')} autoFocus />
            <Input label="Canva API Key (optional)" {...methods.register('canvaApiKey')} className="mt-4" />
          </>
        );
      default:
        return null;
    }
  }

  if (completed) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <AppLogo className="mb-6" />
        <Card className="w-full max-w-md shadow-xl animate-in fade-in zoom-in duration-700">
          <CardHeader>
            <CardTitle className="text-center text-primary">Welcome to MarketReady.ai!</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center gap-2">
              <Heading level={4} className="text-success">Onboarding Complete</Heading>
              <p className="text-muted-foreground text-center">
                You’ll be redirected to your dashboard in a moment.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <AppLogo className="mb-6" />
      <Card className="w-full max-w-md shadow-xl animate-in fade-in zoom-in duration-700">
        <CardHeader>
          <CardTitle className="text-center text-primary">
            <Trans i18nKey="onboarding:title" defaults="Get Started with MarketReady.ai" />
          </CardTitle>
          <Progress value={((step + 1) / totalSteps) * 100} className="mt-4" />
          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            {steps.map((s, i) => (
              <span key={s.label} className={cn(i === step && 'font-bold text-primary')}>
                {s.label}
              </span>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          <FormProvider {...methods}>
            <form
              className="flex flex-col gap-6"
              onSubmit={methods.handleSubmit(onSubmit)}
              autoComplete="off"
            >
              <StepFields />
              <div className="flex justify-between mt-6">
                <Button
                  type="button"
                  variant="outline"
                  disabled={step === 0}
                  onClick={() => setStep((s) => Math.max(0, s - 1))}
                >
                  Back
                </Button>
                <Button type="submit" variant="brand">
                  {step === totalSteps - 1 ? 'Finish' : 'Next'}
                </Button>
              </div>
            </form>
          </FormProvider>
        </CardContent>
      </Card>
    </div>
  );
}
