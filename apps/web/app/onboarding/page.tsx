'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { Button } from '@kit/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@kit/ui/card';
import { Input } from '@kit/ui/input';
import { Label } from '@kit/ui/label';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Simple class name utility
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

type FormData = {
  firstName: string;
  lastName: string;
  company: string;
  propertyType: string;
  state: string;
  timezone: string;
  rpDataApiKey: string;
  canvaApiKey: string;
};

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    company: '',
    propertyType: '',
    state: '',
    timezone: '',
    rpDataApiKey: '',
    canvaApiKey: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const nextStep = () => setStep(prev => Math.min(prev + 1, 2));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 0));

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step < 2) {
      nextStep();
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Get the current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        throw new Error(userError?.message || 'User not authenticated');
      }

      // Update the user's account to mark onboarding as complete
      const { error: updateError } = await supabase
        .from('accounts')
        .update({
          public_data: {
            has_completed_onboarding: true,
            ...formData
          },
          updated_at: new Date().toISOString()
        })
        .eq('primary_owner_user_id', user.id)
        .eq('is_personal_account', true);

      if (updateError) {
        throw updateError;
      }

      // Redirect to home after successful submission
      window.location.href = '/home';
    } catch (error) {
      console.error('Error submitting form:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">
            {step === 0 ? 'Personal Information' : 
             step === 1 ? 'Business Information' : 'Review'}
          </CardTitle>
          <div className="flex justify-between mt-2 text-sm text-muted-foreground">
            <span>Step {step + 1} of 3</span>
            <span>{Math.round(((step + 1) / 3) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
            <div 
              className="bg-primary h-2.5 rounded-full transition-all duration-300" 
              style={{ width: `${((step + 1) / 3) * 100}%` }}
            />
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {step === 0 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      className="mt-1"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="company">Company (Optional)</Label>
                  <Input
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="mt-1"
                  />
                </div>
              </div>
            )}
            
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="propertyType">Property Type</Label>
                  <Input
                    id="propertyType"
                    name="propertyType"
                    value={formData.propertyType}
                    onChange={handleChange}
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="timezone">Timezone (Optional)</Label>
                  <Input
                    id="timezone"
                    name="timezone"
                    value={formData.timezone}
                    onChange={handleChange}
                    className="mt-1"
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="rpDataApiKey">RP Data API Key (Optional)</Label>
                  <Input
                    id="rpDataApiKey"
                    name="rpDataApiKey"
                    type="password"
                    value={formData.rpDataApiKey}
                    onChange={handleChange}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="canvaApiKey">Canva API Key (Optional)</Label>
                  <Input
                    id="canvaApiKey"
                    name="canvaApiKey"
                    type="password"
                    value={formData.canvaApiKey}
                    onChange={handleChange}
                    className="mt-1"
                  />
                </div>
              </div>
            )}
            
            <div className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={step === 0}
              >
                Back
              </Button>
              <Button 
                type="submit" 
                className="w-full"
                disabled={
                  isSubmitting || 
                  step === 0 || 
                  (step === 1 && (!formData.firstName || !formData.lastName))
                }
              >
                {isSubmitting ? 'Saving...' : step === 2 ? 'Complete Setup' : 'Next'}
              </Button>
              {error && (
                <p className="text-sm text-red-500 mt-2 text-center">
                  {error}
                </p>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
