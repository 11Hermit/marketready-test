'use client';

import type { Provider } from '@supabase/supabase-js';

import { isBrowser } from '@kit/shared/utils';
import { Alert, AlertDescription, AlertTitle } from '@kit/ui/alert';
import { If } from '@kit/ui/if';
import { Separator } from '@kit/ui/separator';
import { Trans } from '@kit/ui/trans';

import { useCaptchaToken } from './captcha';
import { MagicLinkAuthContainer } from './magic-link-auth-container';
import { OauthProviders } from './oauth-providers';
import { EmailPasswordSignUpContainer } from './password-sign-up-container';

export function SignUpMethodsContainer(props: {
  paths: {
    callback: string;
    appHome: string;
  };

  providers: {
    password: boolean;
    magicLink: boolean;
    oAuth: Provider[];
  };

  inviteToken?: string;
}) {
  const redirectUrl = getCallbackUrl(props);
  const captchaToken = useCaptchaToken();

  return (
    <>
      <If condition={props.inviteToken}>
        <InviteAlert />
      </If>

      <If condition={props.providers.password}>
        <EmailPasswordSignUpContainer
          captchaToken={captchaToken}
          emailRedirectTo={redirectUrl}
        />
      </If>

      <If condition={props.providers.magicLink}>
        <MagicLinkAuthContainer
          inviteToken={props.inviteToken}
          redirectUrl={redirectUrl}
          captchaToken={captchaToken}
        />
      </If>

      <If condition={props.providers.oAuth.length}>
        <Separator />

        <OauthProviders
          enabledProviders={props.providers.oAuth}
          inviteToken={props.inviteToken}
          paths={{
            callback: props.paths.callback,
            returnPath: props.paths.appHome,
          }}
        />
      </If>
    </>
  );
}

function getCallbackUrl(props: {
  paths: {
    callback: string;
    appHome: string;
  };

  inviteToken?: string;
}) {
  if (!isBrowser()) {
    return '';
  }

  const redirectPath = props.paths.callback;
  const origin = window.location.origin;
  const url = new URL(redirectPath, origin);

  if (props.inviteToken) {
    url.searchParams.set('invite_token', props.inviteToken);
  }

  return url.href;
}

function InviteAlert() {
  return (
    <Alert variant={'info'}>
      <AlertTitle>
        <Trans i18nKey={'auth:inviteAlertHeading'} />
      </AlertTitle>

      <AlertDescription>
        <Trans i18nKey={'auth:inviteAlertBody'} />
      </AlertDescription>
    </Alert>
  );
}
