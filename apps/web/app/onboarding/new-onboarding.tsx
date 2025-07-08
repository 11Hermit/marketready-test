'use client';

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, FormProvider, useFormContext } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserResponse, User } from "@supabase/supabase-js";
import { getSupabaseBrowserClient } from "../../lib/get-supabase-browser-client";
import { Card, CardContent, CardHeader, CardTitle } from "@kit/ui/card";
import { Input } from "@kit/ui/input";
import { Label } from "@kit/ui/label";
import { Button } from "@kit/ui/button";

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

const PROPERTY_TYPES = [
  "Residential",
  "Office",
  "Retail",
  "Industrial & Logistics",
  "Hotel / Hospitality",
  "Land / Rural",
  "Other",
] as const;

const STATES = [
  "QLD",
  "NSW",
  "VIC",
  "SA",
  "WA",
  "TAS",
  "ACT",
  "NT",
] as const;

const step1Schema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  agency: z.string().min(1, "Agency / Company name is required"),
  profilePicture: z.any().optional(),
});

const step2Schema = z.object({
  propertyType: z.enum(PROPERTY_TYPES, { required_error: "Property type is required" }),
  state: z.enum(STATES, { required_error: "State is required" }),
  timezone: z.string().optional(),
});

const formSchema = step1Schema.merge(step2Schema);

type FormValues = z.infer<typeof formSchema>;

interface StepConfig {
  title: string;
  fields: (keyof FormValues)[];
  schema: z.ZodTypeAny;
}

const steps: StepConfig[] = [
  {
    title: "Tell us about you",
    fields: ["firstName", "lastName", "agency", "profilePicture"],
    schema: step1Schema,
  },
  {
    title: "Role & Preferences",
    fields: ["propertyType", "state", "timezone"],
    schema: step2Schema,
  },
];

const TextInput: React.FC<{ name: keyof FormValues; label: string; type?: string; autoFocus?: boolean }> = ({ name, label, type = "text", autoFocus = false }) => {
  const { register, formState: { errors } } = useFormContext<FormValues>();
  const error = errors[name]?.message as string | undefined;
  return (
    <div className="space-y-2">
      <Label htmlFor={name as string}>{label}</Label>
      <Input id={name as string} type={type} autoFocus={autoFocus} className={cn(error && "border-destructive")} {...register(name)} />
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
};

const SelectInput: React.FC<{ name: keyof FormValues; label: string; options: readonly string[]; autoFocus?: boolean }> = ({ name, label, options, autoFocus = false }) => {
  const { register, formState: { errors } } = useFormContext<FormValues>();
  const error = errors[name]?.message as string | undefined;
  return (
    <div className="space-y-2">
      <Label htmlFor={name as string}>{label}</Label>
      <select id={name as string} className={cn("mt-1 block w-full rounded-md border bg-background p-2 text-sm shadow-sm focus:border-primary focus:outline-none", error && "border-destructive")} {...register(name)} autoFocus={autoFocus}>
        <option value="" disabled>Select...</option>
        {options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
      </select>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
};

const FileInput: React.FC<{ name: keyof FormValues; label: string }> = ({ name, label }) => {
  const { register } = useFormContext<FormValues>();
  return (
    <div className="space-y-2">
      <Label htmlFor={name as string}>{label}</Label>
      <input id={name as string} type="file" accept="image/*" {...register(name)} className="mt-1 block w-full text-sm" />
    </div>
  );
};

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = steps.length;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);
  const supabase = getSupabaseBrowserClient();

  const methods = useForm<FormValues>({
    resolver: zodResolver(formSchema), // Use the full schema
    mode: "onChange",
  });

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) router.replace("/auth/sign-in");
    })();
  }, [supabase, router]);

  const { handleSubmit, trigger } = methods;

  const handleNextStep = async () => {
    const fields = steps[currentStep]?.fields;
    if (!fields) return;

    const isValid = await trigger(fields);
    if (isValid && currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = async (data: FormValues) => {
    // This function is now only for the final submission
    setIsSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !user.email) throw new Error("User not authenticated");

      let avatarUrl: string | undefined;
      const profilePicture = data.profilePicture as unknown as FileList | undefined;
      const pic = profilePicture?.[0];

      if (pic) {
        const filePath = `${user.id}/${Date.now()}-${pic.name}`;
        const { error: uploadError } = await supabase.storage.from('profile_pictures').upload(filePath, pic, { upsert: true, contentType: pic.type });
        if (uploadError) {
          console.error('Upload error:', uploadError.message);
        } else {
          const { data: publicUrlData } = supabase.storage.from('profile_pictures').getPublicUrl(filePath);
          avatarUrl = publicUrlData?.publicUrl;
        }
      }

      const { error: profileError } = await supabase.from('profiles').upsert({
        id: user.id,
        email: user.email,
        username: user.user_metadata?.username || user.email.split('@')[0],
        first_name: data.firstName,
        last_name: data.lastName,
        agency: data.agency,
        property_type: data.propertyType,
        state: data.state,
        timezone: data.timezone,
        profile_picture_url: avatarUrl,
        hascompletedonboarding: true,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'id' });

      if (profileError) throw profileError;

      setCompleted(true);
      setTimeout(() => router.push("/home"), 1500);
    } catch (err) {
      console.error("Onboarding error:", err);
      alert("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (completed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md text-center p-8">
          <h2 className="text-2xl font-bold mb-2">Setup complete!</h2>
          <p className="text-muted-foreground">Redirecting you to your dashboard…</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="hidden md:flex md:w-1/2 bg-muted items-center justify-center p-8">
        <h1 className="text-3xl font-semibold max-w-sm text-center">
          Let’s get you set up — this helps us personalise your experience and recommend the most relevant tools for your work.
        </h1>
      </div>
      <div className="flex w-full md:w-1/2 items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">{steps[currentStep]?.title ?? 'Onboarding Step'}</CardTitle>
            <div className="flex justify-between mt-2 text-sm text-muted-foreground">
              <span>Step {currentStep + 1} of {totalSteps}</span>
              <span>{Math.round(((currentStep + 1) / totalSteps) * 100)}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
              <div className="bg-primary h-2.5 rounded-full transition-all duration-300" style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }} />
            </div>
          </CardHeader>
          <CardContent>
            <FormProvider {...methods}>
              <form className="space-y-6">
                {currentStep === 0 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <TextInput name="firstName" label="First Name" autoFocus />
                      <TextInput name="lastName" label="Last Name" />
                    </div>
                    <TextInput name="agency" label="Agency / Company Name" />
                    <FileInput name="profilePicture" label="Profile Picture (optional)" />
                  </div>
                )}
                {currentStep === 1 && (
                  <div className="space-y-4">
                    <SelectInput name="propertyType" label="Property Type" options={PROPERTY_TYPES} autoFocus />
                    <SelectInput name="state" label="State" options={STATES} />
                    <TextInput name="timezone" label="Timezone (optional)" />
                  </div>
                )}
                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={handlePrevStep} disabled={currentStep === 0 || isSubmitting}>Back</Button>
                  {currentStep === totalSteps - 1 ? (
                    <Button type="button" onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>{isSubmitting ? "Finishing…" : "Finish"}</Button>
                  ) : (
                    <Button type="button" onClick={handleNextStep}>Next</Button>
                  )}
                </div>
              </form>
            </FormProvider>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
