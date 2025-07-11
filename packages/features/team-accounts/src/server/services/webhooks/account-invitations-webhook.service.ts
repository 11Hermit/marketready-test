import { SupabaseClient } from '@supabase/supabase-js';

import { z } from 'zod';

import { getLogger } from '@kit/shared/logger';
import { Database } from '@kit/supabase/database';

type Invitation = Database['public']['Tables']['invitations']['Row'];

const invitePath = '/join';

const siteURL = process.env.NEXT_PUBLIC_SITE_URL;
const productName = process.env.NEXT_PUBLIC_PRODUCT_NAME ?? '';
const emailSender = process.env.EMAIL_SENDER;

const env = z
  .object({
    invitePath: z
      .string({
        required_error: 'The property invitePath is required',
      })
      .min(1),
    siteURL: z
      .string({
        required_error: 'NEXT_PUBLIC_SITE_URL is required',
      })
      .min(1),
    productName: z
      .string({
        required_error: 'NEXT_PUBLIC_PRODUCT_NAME is required',
      })
      .min(1),
    emailSender: z
      .string({
        required_error: 'EMAIL_SENDER is required',
      })
      .min(1),
  })
  .parse({
    invitePath,
    siteURL,
    productName,
    emailSender,
  });

export function createAccountInvitationsWebhookService(
  client: SupabaseClient<Database>,
) {
  return new AccountInvitationsWebhookService(client);
}

class AccountInvitationsWebhookService {
  private namespace = 'accounts.invitations.webhook';

  constructor(private readonly adminClient: SupabaseClient<Database>) {}

  /**
   * @name handleInvitationWebhook
   * @description Handles the webhook event for invitations
   * @param invitation
   */
  async handleInvitationWebhook(invitation: Invitation) {
    return this.dispatchInvitationEmail(invitation);
  }

  private async dispatchInvitationEmail(invitation: Invitation) {
    const logger = await getLogger();

    logger.info(
      { invitation, name: this.namespace },
      'Handling invitation webhook event...',
    );

    const inviter = await this.adminClient
      .from('accounts')
      .select('email, name')
      .eq('id', invitation.invited_by)
      .single();

    if (inviter.error) {
      logger.error(
        {
          error: inviter.error,
          name: this.namespace,
        },
        'Failed to fetch inviter details',
      );

      throw inviter.error;
    }

    const team = await this.adminClient
      .from('accounts')
      .select('name')
      .eq('id', invitation.account_id)
      .single();

    if (team.error) {
      logger.error(
        {
          error: team.error,
          name: this.namespace,
        },
        'Failed to fetch team details',
      );

      throw team.error;
    }

    const ctx = {
      invitationId: invitation.id,
      name: this.namespace,
    };

    logger.info(ctx, 'Invite retrieved. Sending invitation email...');

    try {
      const { renderInviteEmail } = await import('@kit/email-templates');
      const { getMailer } = await import('@kit/mailers');

      const mailer = await getMailer();
      const link = this.getInvitationLink(
        invitation.invite_token,
        invitation.email,
      );

      const { html, subject } = await renderInviteEmail({
        link,
        invitedUserEmail: invitation.email,
        inviter: inviter.data.name ?? inviter.data.email ?? '',
        productName: env.productName,
        teamName: team.data.name,
      });

      await mailer
        .sendEmail({
          from: env.emailSender,
          to: invitation.email,
          subject,
          html,
        })
        .then(() => {
          logger.info(ctx, 'Invitation email successfully sent!');
        })
        .catch((error) => {
          console.error(error);

          logger.error({ error, ...ctx }, 'Failed to send invitation email');
        });

      return {
        success: true,
      };
    } catch (error) {
      console.error(error);
      logger.warn({ error, ...ctx }, 'Failed to invite user to team');

      return {
        error,
        success: false,
      };
    }
  }

  private getInvitationLink(token: string, email: string) {
    const searchParams = new URLSearchParams({
      invite_token: token,
      email,
    }).toString();

    const href = new URL(env.invitePath, env.siteURL).href;

    return `${href}?${searchParams}`;
  }
}
