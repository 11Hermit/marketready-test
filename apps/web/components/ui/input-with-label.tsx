import * as React from 'react';
import { Input, InputProps } from '@kit/ui/input';
import { Label } from '@kit/ui/label';
import { cn } from '~/lib/utils';

type InputWithLabelProps = InputProps & {
  label: string;
  labelClassName?: string;
  wrapperClassName?: string;
};

export function InputWithLabel({
  label,
  className,
  labelClassName,
  wrapperClassName,
  id,
  ...props
}: InputWithLabelProps) {
  const inputId = id || React.useId();
  
  return (
    <div className={cn('grid w-full items-center gap-1.5', wrapperClassName)}>
      <Label htmlFor={inputId} className={labelClassName}>
        {label}
      </Label>
      <Input id={inputId} className={className} {...props} />
    </div>
  );
}
