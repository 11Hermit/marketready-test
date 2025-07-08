"use client";

// Onboarding Wizard – captures user profile data in a two-step flow.
// Step 1 – Personal / Agency information
// Step 2 – Role & Preferences
// After completion the wizard stores the information in Supabase `accounts.public_data`
// and redirects the user to /home.

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, FormProvider, useFormContext } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClient } from "@supabase/supabase-js";

import { Card, CardContent, CardHeader, CardTitle } from "@kit/ui/card";
import { Input } from "@kit/ui/input";
import { Label } from "@kit/ui/label";
import { Button } from "@kit/ui/button";

// Utility to join classNames
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

// --------------------
// Zod Schemas per step
// --------------------
const step1Schema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  agency: z.string().min(1, "Agency / Company name is required"),
  profilePicture: z.any().optional(), // Will be validated client side only
});

const step2Schema = z.object({
  propertyType: z.enum(PROPERTY_TYPES, {
    required_error: "Property type is required",
  }),
  state: z.enum(STATES, {
    required_error: "State is required",
  }),
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

// Shared Input component (text)
const TextInput: React.FC<{
  name: keyof FormValues;
  label: string;
  type?: string;
  autoFocus?: boolean;
}> = ({ name, label, type = "text", autoFocus = false }) => {
  const {
    register,
    formState: { errors },
  } = useFormContext<FormValues>();
  const error = errors[name]?.message as string | undefined;

  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <Input
        id={name as string}
        type={type}
        autoFocus={autoFocus}
        className={cn(error && "border-destructive")}
        {...register(name)}
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
};

// Select field component
const SelectInput: React.FC<{
  name: keyof FormValues;
  label: string;
  options: readonly string[];
  autoFocus?: boolean;
}> = ({ name, label, options, autoFocus = false }) => {
  const {
    register,
    formState: { errors },
  } = useFormContext<FormValues>();
  const error = errors[name]?.message as string | undefined;

  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <select
        id={name as string}
        className={cn(
          "mt-1 block w-full rounded-md border bg-background p-2 text-sm shadow-sm focus:border-primary focus:outline-none",
          error && "border-destructive"
        )}
        {...register(name)}
        autoFocus={autoFocus}
      >
        <option value="" disabled>
          Select...
        </option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
};

// File upload (profile picture)
const FileInput: React.FC<{
  name: keyof FormValues;
  label: string;
}> = ({ name, label }) => {
  const { register } = useFormContext<FormValues>();
  // For simplicity, skipping validation/error UI for optional file field
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <input
        id={name as string}
        type="file"
        accept="image/*"
        {...register(name)}
        className="mt-1 block w-full text-sm"/>
    </div>
  );
};

export default function OnboardingWizard() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = steps.length;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const methods = useForm<FormValues>({
    resolver: zodResolver(steps[currentStep].schema as any),
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      agency: "",
      propertyType: "" as any,
      state: "" as any,
      timezone: "",
      profilePicture: undefined,
    },
  });

  const {
    handleSubmit,
    trigger,
    getValues,
  } = methods;

  async function next() {
    const fields = steps[currentStep].fields as (keyof FormValues)[];
    const valid = await trigger(fields as any);
    if (!valid) return;
    if (currentStep < totalSteps - 1) {
      setCurrentStep((s) => s + 1);
    }
  }

  function back() {
    setCurrentStep((s) => Math.max(0, s - 1));
  }

  async function onSubmit(data: FormValues) {
    if (currentStep < totalSteps - 1) {
      await next();
      return;
    }

    setIsSubmitting(true);

    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData.user) throw new Error(userError?.message ?? "Could not fetch user");

      const userId = userData.user.id;

      // Optional profile picture upload
      let avatarUrl: string | undefined;
      const pic = (data.profilePicture as unknown as FileList | undefined)?.[0];
      if (pic) {
        const filePath = `${userId}/${Date.now()}-${pic.name}`;
        const { error: uploadError } = await supabase.storage
          .from("profile_pictures")
          .upload(filePath, pic, {
            upsert: true,
            contentType: pic.type,
          });
        if (!uploadError) {
          const { data: publicUrl } = supabase.storage
            .from("profile_pictures")
            .getPublicUrl(filePath);
          avatarUrl = publicUrl.publicUrl;
        }
      }

      // Persist data to accounts table (Makerkit personal account)
      const { error: updateError } = await supabase
        .from("accounts")
        .update({
          public_data: {
            has_completed_onboarding: true,
            first_name: data.firstName,
            last_name: data.lastName,
            agency: data.agency,
            property_type: data.propertyType,
            state: data.state,
            timezone: data.timezone,
            avatar_url: avatarUrl ?? null,
          },
          updated_at: new Date().toISOString(),
        })
        .eq("primary_owner_user_id", userId)
        .eq("is_personal_account", true);

      if (updateError) throw updateError;

      setCompleted(true);
      setTimeout(() => {
        router.push("/home");
      }, 1500);
    } catch (err) {
      console.error("Onboarding error", err);
      alert(
        err instanceof Error ? err.message : "Something went wrong, please try again."
      );
      setIsSubmitting(false);
    }
  }

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
      {/* Branding / Hero side */}
      <div className="hidden md:flex md:w-1/2 bg-muted items-center justify-center p-8">
        <h1 className="text-3xl font-semibold max-w-sm text-center">
          Let’s get you set up — this helps us personalise your experience and recommend the most relevant tools for your work.
        </h1>
      </div>

      {/* Form side */}
      <div className="flex w-full md:w-1/2 items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">
              {steps[currentStep].title}
            </CardTitle>
            <div className="flex justify-between mt-2 text-sm text-muted-foreground">
              <span>
                Step {currentStep + 1} of {totalSteps}
              </span>
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
                    <SelectInput
                      name="propertyType"
                      label="Property Type"
                      options={PROPERTY_TYPES}
                      autoFocus
                    />
                    <SelectInput name="state" label="State" options={STATES} />
                    <TextInput name="timezone" label="Timezone (optional)" />
                  </div>
                )}

                <div className="flex justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={back}
                    disabled={currentStep === 0 || isSubmitting}
                  >
                    Back
                  </Button>
                  {currentStep === totalSteps - 1 ? (
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Finishing…" : "Finish"}
                    </Button>
                  ) : (
                    <Button type="button" onClick={next}>
                      Next
                    </Button>
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
