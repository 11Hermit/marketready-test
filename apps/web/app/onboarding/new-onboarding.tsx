'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, FormProvider, useFormContext } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@kit/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@kit/ui/card';
import { Input } from '@kit/ui/input';
import { Label } from '@kit/ui/label';
// Simple class name utility function
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

// Form Schemas
const personalInfoSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  company: z.string().optional(),
});

const businessInfoSchema = z.object({
  propertyType: z.string().min(1, 'Property type is required'),
  state: z.string().min(1, 'State is required'),
  timezone: z.string().optional(),
});

const integrationsSchema = z.object({
  rpDataApiKey: z.string().optional(),
  canvaApiKey: z.string().optional(),
});

const formSchema = personalInfoSchema.merge(businessInfoSchema).merge(integrationsSchema);

type FormData = z.infer<typeof formSchema>;

// Form Steps
const steps = [
  {
    title: 'Personal Information',
    fields: ['firstName', 'lastName', 'company'],
    schema: personalInfoSchema,
  },
  {
    title: 'Business Information',
    fields: ['propertyType', 'state', 'timezone'],
    schema: businessInfoSchema,
  },
  {
    title: 'Integrations',
    fields: ['rpDataApiKey', 'canvaApiKey'],
    schema: integrationsSchema,
  },
];

// Input Component
const FormInput = ({ 
  name, 
  label, 
  type = 'text', 
  ...props 
}: { 
  name: string; 
  label: string; 
  type?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) => {
  const { register, formState: { errors } } = useFormContext<FormData>();
  const error = errors[name as keyof FormData]?.message as string;

  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <Input
        id={name}
        type={type}
        {...props}
        {...register(name as keyof FormData)}
        className={cn(error && 'border-destructive')}
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
};

// Step Component
const StepForm = ({ 
  step, 
  onNext, 
  onBack, 
  isLastStep 
}: { 
  step: number; 
  onNext: () => void; 
  onBack: () => void; 
  isLastStep: boolean;
}) => {
  const { handleSubmit, formState: { isSubmitting } } = useFormContext<FormData>();
  
  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-6">
      <div className="space-y-4">
        {step === 0 && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <FormInput
                name="firstName"
                label="First Name"
                autoFocus
              />
              <FormInput
                name="lastName"
                label="Last Name"
              />
            </div>
            <FormInput
              name="company"
              label="Company (Optional)"
            />
          </>
        )}

        {step === 1 && (
          <>
            <FormInput
              name="propertyType"
              label="Property Type"
              autoFocus
            />
            <FormInput
              name="state"
              label="State"
            />
            <FormInput
              name="timezone"
              label="Timezone (Optional)"
            />
          </>
        )}

        {step === 2 && (
          <>
            <FormInput
              name="rpDataApiKey"
              label="RP Data API Key (Optional)"
              type="password"
              autoFocus
            />
            <FormInput
              name="canvaApiKey"
              label="Canva API Key (Optional)"
              type="password"
            />
          </>
        )}
      </div>
      
      <div className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={step === 0}
        >
          Back
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isLastStep ? 'Finish' : 'Next'}
        </Button>
      </div>
    </form>
  );
};

// Main Component
export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const totalSteps = steps.length;

  const methods = useForm<FormData>({
    resolver: zodResolver(steps[currentStep].schema as any),
    mode: 'onChange',
  });

  const { handleSubmit, trigger } = methods;

  const onNext = async () => {
    const isValid = await trigger(steps[currentStep].fields as any);
    if (!isValid) return;
    
    if (currentStep < totalSteps - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      // Handle final submission
      setIsCompleted(true);
      // Redirect to dashboard after a short delay
      setTimeout(() => {
        router.push('/home');
      }, 2000);
    }
  };

  const onBack = () => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
  };

  const onSubmit = async (data: FormData) => {
    console.log('Form submitted:', data);
    // TODO: Save data to backend
    await onNext();
  };

  if (isCompleted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background p-4">
        <Card className="w-full max-w-md text-center p-8">
          <div className="rounded-full bg-green-100 p-4 w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-12 h-12 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Setup Complete!
          </h2>
          <p className="text-muted-foreground mb-6">
            Your account is ready. Redirecting you to the dashboard...
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">
            {steps[currentStep].title}
          </CardTitle>
          <div className="flex justify-between mt-2 text-sm text-muted-foreground">
            <span>Step {currentStep + 1} of {totalSteps}</span>
            <span>{Math.round(((currentStep + 1) / totalSteps) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
            <div 
              className="bg-primary h-2.5 rounded-full transition-all duration-300" 
              style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
            />
          </div>
        </CardHeader>
        <CardContent>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                {currentStep === 0 && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <FormInput
                        name="firstName"
                        label="First Name"
                        autoFocus
                      />
                      <FormInput
                        name="lastName"
                        label="Last Name"
                      />
                    </div>
                    <FormInput
                      name="company"
                      label="Company (Optional)"
                    />
                  </>
                )}

                {currentStep === 1 && (
                  <>
                    <FormInput
                      name="propertyType"
                      label="Property Type"
                      autoFocus
                    />
                    <FormInput
                      name="state"
                      label="State"
                    />
                    <FormInput
                      name="timezone"
                      label="Timezone (Optional)"
                    />
                  </>
                )}

                {currentStep === 2 && (
                  <>
                    <FormInput
                      name="rpDataApiKey"
                      label="RP Data API Key (Optional)"
                      type="password"
                      autoFocus
                    />
                    <FormInput
                      name="canvaApiKey"
                      label="Canva API Key (Optional)"
                      type="password"
                    />
                  </>
                )}
              </div>
              
              <div className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onBack}
                  disabled={currentStep === 0}
                >
                  Back
                </Button>
                <Button type="submit">
                  {currentStep === totalSteps - 1 ? 'Finish' : 'Next'}
                </Button>
              </div>
            </form>
          </FormProvider>
        </CardContent>
      </Card>
    </div>
  );
}
