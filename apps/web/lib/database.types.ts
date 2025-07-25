export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          operationName?: string;
          query?: string;
          variables?: Json;
          extensions?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      accounts: {
        Row: {
          created_at: string | null;
          created_by: string | null;
          email: string | null;
          id: string;
          is_personal_account: boolean;
          name: string;
          picture_url: string | null;
          primary_owner_user_id: string;
          public_data: Json;
          slug: string | null;
          updated_at: string | null;
          updated_by: string | null;
        };
        Insert: {
          created_at?: string | null;
          created_by?: string | null;
          email?: string | null;
          id?: string;
          is_personal_account?: boolean;
          name: string;
          picture_url?: string | null;
          primary_owner_user_id?: string;
          public_data?: Json;
          slug?: string | null;
          updated_at?: string | null;
          updated_by?: string | null;
        };
        Update: {
          created_at?: string | null;
          created_by?: string | null;
          email?: string | null;
          id?: string;
          is_personal_account?: boolean;
          name?: string;
          picture_url?: string | null;
          primary_owner_user_id?: string;
          public_data?: Json;
          slug?: string | null;
          updated_at?: string | null;
          updated_by?: string | null;
        };
        Relationships: [];
      };
      accounts_memberships: {
        Row: {
          account_id: string;
          account_role: string;
          created_at: string;
          created_by: string | null;
          updated_at: string;
          updated_by: string | null;
          user_id: string;
        };
        Insert: {
          account_id: string;
          account_role: string;
          created_at?: string;
          created_by?: string | null;
          updated_at?: string;
          updated_by?: string | null;
          user_id: string;
        };
        Update: {
          account_id?: string;
          account_role?: string;
          created_at?: string;
          created_by?: string | null;
          updated_at?: string;
          updated_by?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'accounts_memberships_account_id_fkey';
            columns: ['account_id'];
            isOneToOne: false;
            referencedRelation: 'accounts';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'accounts_memberships_account_id_fkey';
            columns: ['account_id'];
            isOneToOne: false;
            referencedRelation: 'user_account_workspace';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'accounts_memberships_account_id_fkey';
            columns: ['account_id'];
            isOneToOne: false;
            referencedRelation: 'user_accounts';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'accounts_memberships_account_role_fkey';
            columns: ['account_role'];
            isOneToOne: false;
            referencedRelation: 'roles';
            referencedColumns: ['name'];
          },
        ];
      };
      billing_customers: {
        Row: {
          account_id: string;
          customer_id: string;
          email: string | null;
          id: number;
          provider: Database['public']['Enums']['billing_provider'];
        };
        Insert: {
          account_id: string;
          customer_id: string;
          email?: string | null;
          id?: number;
          provider: Database['public']['Enums']['billing_provider'];
        };
        Update: {
          account_id?: string;
          customer_id?: string;
          email?: string | null;
          id?: number;
          provider?: Database['public']['Enums']['billing_provider'];
        };
        Relationships: [
          {
            foreignKeyName: 'billing_customers_account_id_fkey';
            columns: ['account_id'];
            isOneToOne: false;
            referencedRelation: 'accounts';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'billing_customers_account_id_fkey';
            columns: ['account_id'];
            isOneToOne: false;
            referencedRelation: 'user_account_workspace';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'billing_customers_account_id_fkey';
            columns: ['account_id'];
            isOneToOne: false;
            referencedRelation: 'user_accounts';
            referencedColumns: ['id'];
          },
        ];
      };
      config: {
        Row: {
          billing_provider: Database['public']['Enums']['billing_provider'];
          enable_account_billing: boolean;
          enable_team_account_billing: boolean;
          enable_team_accounts: boolean;
        };
        Insert: {
          billing_provider?: Database['public']['Enums']['billing_provider'];
          enable_account_billing?: boolean;
          enable_team_account_billing?: boolean;
          enable_team_accounts?: boolean;
        };
        Update: {
          billing_provider?: Database['public']['Enums']['billing_provider'];
          enable_account_billing?: boolean;
          enable_team_account_billing?: boolean;
          enable_team_accounts?: boolean;
        };
        Relationships: [];
      };
      invitations: {
        Row: {
          account_id: string;
          created_at: string;
          email: string;
          expires_at: string;
          id: number;
          invite_token: string;
          invited_by: string;
          role: string;
          updated_at: string;
        };
        Insert: {
          account_id: string;
          created_at?: string;
          email: string;
          expires_at?: string;
          id?: number;
          invite_token: string;
          invited_by: string;
          role: string;
          updated_at?: string;
        };
        Update: {
          account_id?: string;
          created_at?: string;
          email?: string;
          expires_at?: string;
          id?: number;
          invite_token?: string;
          invited_by?: string;
          role?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'invitations_account_id_fkey';
            columns: ['account_id'];
            isOneToOne: false;
            referencedRelation: 'accounts';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'invitations_account_id_fkey';
            columns: ['account_id'];
            isOneToOne: false;
            referencedRelation: 'user_account_workspace';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'invitations_account_id_fkey';
            columns: ['account_id'];
            isOneToOne: false;
            referencedRelation: 'user_accounts';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'invitations_role_fkey';
            columns: ['role'];
            isOneToOne: false;
            referencedRelation: 'roles';
            referencedColumns: ['name'];
          },
        ];
      };
      nonces: {
        Row: {
          client_token: string;
          created_at: string;
          description: string | null;
          expires_at: string;
          id: string;
          last_verification_at: string | null;
          last_verification_ip: unknown | null;
          last_verification_user_agent: string | null;
          metadata: Json | null;
          nonce: string;
          purpose: string;
          revoked: boolean;
          revoked_reason: string | null;
          scopes: string[] | null;
          tags: string[] | null;
          used_at: string | null;
          user_id: string | null;
          verification_attempts: number;
        };
        Insert: {
          client_token: string;
          created_at?: string;
          description?: string | null;
          expires_at: string;
          id?: string;
          last_verification_at?: string | null;
          last_verification_ip?: unknown | null;
          last_verification_user_agent?: string | null;
          metadata?: Json | null;
          nonce: string;
          purpose: string;
          revoked?: boolean;
          revoked_reason?: string | null;
          scopes?: string[] | null;
          tags?: string[] | null;
          used_at?: string | null;
          user_id?: string | null;
          verification_attempts?: number;
        };
        Update: {
          client_token?: string;
          created_at?: string;
          description?: string | null;
          expires_at?: string;
          id?: string;
          last_verification_at?: string | null;
          last_verification_ip?: unknown | null;
          last_verification_user_agent?: string | null;
          metadata?: Json | null;
          nonce?: string;
          purpose?: string;
          revoked?: boolean;
          revoked_reason?: string | null;
          scopes?: string[] | null;
          tags?: string[] | null;
          used_at?: string | null;
          user_id?: string | null;
          verification_attempts?: number;
        };
        Relationships: [];
      };
      notifications: {
        Row: {
          account_id: string;
          body: string;
          channel: Database['public']['Enums']['notification_channel'];
          created_at: string;
          dismissed: boolean;
          expires_at: string | null;
          id: number;
          link: string | null;
          type: Database['public']['Enums']['notification_type'];
        };
        Insert: {
          account_id: string;
          body: string;
          channel?: Database['public']['Enums']['notification_channel'];
          created_at?: string;
          dismissed?: boolean;
          expires_at?: string | null;
          id?: never;
          link?: string | null;
          type?: Database['public']['Enums']['notification_type'];
        };
        Update: {
          account_id?: string;
          body?: string;
          channel?: Database['public']['Enums']['notification_channel'];
          created_at?: string;
          dismissed?: boolean;
          expires_at?: string | null;
          id?: never;
          link?: string | null;
          type?: Database['public']['Enums']['notification_type'];
        };
        Relationships: [
          {
            foreignKeyName: 'notifications_account_id_fkey';
            columns: ['account_id'];
            isOneToOne: false;
            referencedRelation: 'accounts';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'notifications_account_id_fkey';
            columns: ['account_id'];
            isOneToOne: false;
            referencedRelation: 'user_account_workspace';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'notifications_account_id_fkey';
            columns: ['account_id'];
            isOneToOne: false;
            referencedRelation: 'user_accounts';
            referencedColumns: ['id'];
          },
        ];
      };
      order_items: {
        Row: {
          created_at: string;
          id: string;
          order_id: string;
          price_amount: number | null;
          product_id: string;
          quantity: number;
          updated_at: string;
          variant_id: string;
        };
        Insert: {
          created_at?: string;
          id: string;
          order_id: string;
          price_amount?: number | null;
          product_id: string;
          quantity?: number;
          updated_at?: string;
          variant_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          order_id?: string;
          price_amount?: number | null;
          product_id?: string;
          quantity?: number;
          updated_at?: string;
          variant_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'order_items_order_id_fkey';
            columns: ['order_id'];
            isOneToOne: false;
            referencedRelation: 'orders';
            referencedColumns: ['id'];
          },
        ];
      };
      orders: {
        Row: {
          account_id: string;
          billing_customer_id: number;
          billing_provider: Database['public']['Enums']['billing_provider'];
          created_at: string;
          currency: string;
          id: string;
          status: Database['public']['Enums']['payment_status'];
          total_amount: number;
          updated_at: string;
        };
        Insert: {
          account_id: string;
          billing_customer_id: number;
          billing_provider: Database['public']['Enums']['billing_provider'];
          created_at?: string;
          currency: string;
          id: string;
          status: Database['public']['Enums']['payment_status'];
          total_amount: number;
          updated_at?: string;
        };
        Update: {
          account_id?: string;
          billing_customer_id?: number;
          billing_provider?: Database['public']['Enums']['billing_provider'];
          created_at?: string;
          currency?: string;
          id?: string;
          status?: Database['public']['Enums']['payment_status'];
          total_amount?: number;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'orders_account_id_fkey';
            columns: ['account_id'];
            isOneToOne: false;
            referencedRelation: 'accounts';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'orders_account_id_fkey';
            columns: ['account_id'];
            isOneToOne: false;
            referencedRelation: 'user_account_workspace';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'orders_account_id_fkey';
            columns: ['account_id'];
            isOneToOne: false;
            referencedRelation: 'user_accounts';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'orders_billing_customer_id_fkey';
            columns: ['billing_customer_id'];
            isOneToOne: false;
            referencedRelation: 'billing_customers';
            referencedColumns: ['id'];
          },
        ];
      };
      role_permissions: {
        Row: {
          id: number;
          permission: Database['public']['Enums']['app_permissions'];
          role: string;
        };
        Insert: {
          id?: number;
          permission: Database['public']['Enums']['app_permissions'];
          role: string;
        };
        Update: {
          id?: number;
          permission?: Database['public']['Enums']['app_permissions'];
          role?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'role_permissions_role_fkey';
            columns: ['role'];
            isOneToOne: false;
            referencedRelation: 'roles';
            referencedColumns: ['name'];
          },
        ];
      };
      roles: {
        Row: {
          hierarchy_level: number;
          name: string;
        };
        Insert: {
          hierarchy_level: number;
          name: string;
        };
        Update: {
          hierarchy_level?: number;
          name?: string;
        };
        Relationships: [];
      };
      subscription_items: {
        Row: {
          created_at: string;
          id: string;
          interval: string;
          interval_count: number;
          price_amount: number | null;
          product_id: string;
          quantity: number;
          subscription_id: string;
          type: Database['public']['Enums']['subscription_item_type'];
          updated_at: string;
          variant_id: string;
        };
        Insert: {
          created_at?: string;
          id: string;
          interval: string;
          interval_count: number;
          price_amount?: number | null;
          product_id: string;
          quantity?: number;
          subscription_id: string;
          type: Database['public']['Enums']['subscription_item_type'];
          updated_at?: string;
          variant_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          interval?: string;
          interval_count?: number;
          price_amount?: number | null;
          product_id?: string;
          quantity?: number;
          subscription_id?: string;
          type?: Database['public']['Enums']['subscription_item_type'];
          updated_at?: string;
          variant_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'subscription_items_subscription_id_fkey';
            columns: ['subscription_id'];
            isOneToOne: false;
            referencedRelation: 'subscriptions';
            referencedColumns: ['id'];
          },
        ];
      };
      subscriptions: {
        Row: {
          account_id: string;
          active: boolean;
          billing_customer_id: number;
          billing_provider: Database['public']['Enums']['billing_provider'];
          cancel_at_period_end: boolean;
          created_at: string;
          currency: string;
          id: string;
          period_ends_at: string;
          period_starts_at: string;
          status: Database['public']['Enums']['subscription_status'];
          trial_ends_at: string | null;
          trial_starts_at: string | null;
          updated_at: string;
        };
        Insert: {
          account_id: string;
          active: boolean;
          billing_customer_id: number;
          billing_provider: Database['public']['Enums']['billing_provider'];
          cancel_at_period_end: boolean;
          created_at?: string;
          currency: string;
          id: string;
          period_ends_at: string;
          period_starts_at: string;
          status: Database['public']['Enums']['subscription_status'];
          trial_ends_at?: string | null;
          trial_starts_at?: string | null;
          updated_at?: string;
        };
        Update: {
          account_id?: string;
          active?: boolean;
          billing_customer_id?: number;
          billing_provider?: Database['public']['Enums']['billing_provider'];
          cancel_at_period_end?: boolean;
          created_at?: string;
          currency?: string;
          id?: string;
          period_ends_at?: string;
          period_starts_at?: string;
          status?: Database['public']['Enums']['subscription_status'];
          trial_ends_at?: string | null;
          trial_starts_at?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'subscriptions_account_id_fkey';
            columns: ['account_id'];
            isOneToOne: false;
            referencedRelation: 'accounts';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'subscriptions_account_id_fkey';
            columns: ['account_id'];
            isOneToOne: false;
            referencedRelation: 'user_account_workspace';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'subscriptions_account_id_fkey';
            columns: ['account_id'];
            isOneToOne: false;
            referencedRelation: 'user_accounts';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'subscriptions_billing_customer_id_fkey';
            columns: ['billing_customer_id'];
            isOneToOne: false;
            referencedRelation: 'billing_customers';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      user_account_workspace: {
        Row: {
          id: string | null;
          name: string | null;
          picture_url: string | null;
          subscription_status:
            | Database['public']['Enums']['subscription_status']
            | null;
        };
        Relationships: [];
      };
      user_accounts: {
        Row: {
          id: string | null;
          name: string | null;
          picture_url: string | null;
          role: string | null;
          slug: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'accounts_memberships_account_role_fkey';
            columns: ['role'];
            isOneToOne: false;
            referencedRelation: 'roles';
            referencedColumns: ['name'];
          },
        ];
      };
    };
    Functions: {
      accept_invitation: {
        Args: {
          token: string;
          user_id: string;
        };
        Returns: string;
      };
      add_invitations_to_account: {
        Args: {
          account_slug: string;
          invitations: Database['public']['CompositeTypes']['invitation'][];
        };
        Returns: Database['public']['Tables']['invitations']['Row'][];
      };
      can_action_account_member: {
        Args: {
          target_team_account_id: string;
          target_user_id: string;
        };
        Returns: boolean;
      };
      create_invitation: {
        Args: {
          account_id: string;
          email: string;
          role: string;
        };
        Returns: {
          account_id: string;
          created_at: string;
          email: string;
          expires_at: string;
          id: number;
          invite_token: string;
          invited_by: string;
          role: string;
          updated_at: string;
        };
      };
      create_nonce: {
        Args: {
          p_user_id?: string;
          p_purpose?: string;
          p_expires_in_seconds?: number;
          p_metadata?: Json;
          p_description?: string;
          p_tags?: string[];
          p_scopes?: string[];
          p_revoke_previous?: boolean;
        };
        Returns: Json;
      };
      create_team_account: {
        Args: {
          account_name: string;
        };
        Returns: {
          created_at: string | null;
          created_by: string | null;
          email: string | null;
          id: string;
          is_personal_account: boolean;
          name: string;
          picture_url: string | null;
          primary_owner_user_id: string;
          public_data: Json;
          slug: string | null;
          updated_at: string | null;
          updated_by: string | null;
        };
      };
      get_account_invitations: {
        Args: {
          account_slug: string;
        };
        Returns: {
          id: number;
          email: string;
          account_id: string;
          invited_by: string;
          role: string;
          created_at: string;
          updated_at: string;
          expires_at: string;
          inviter_name: string;
          inviter_email: string;
        }[];
      };
      get_account_members: {
        Args: {
          account_slug: string;
        };
        Returns: {
          id: string;
          user_id: string;
          account_id: string;
          role: string;
          role_hierarchy_level: number;
          primary_owner_user_id: string;
          name: string;
          email: string;
          picture_url: string;
          created_at: string;
          updated_at: string;
        }[];
      };
      get_config: {
        Args: Record<PropertyKey, never>;
        Returns: Json;
      };
      get_nonce_status: {
        Args: {
          p_id: string;
        };
        Returns: Json;
      };
      get_upper_system_role: {
        Args: Record<PropertyKey, never>;
        Returns: string;
      };
      has_active_subscription: {
        Args: {
          target_account_id: string;
        };
        Returns: boolean;
      };
      has_more_elevated_role: {
        Args: {
          target_user_id: string;
          target_account_id: string;
          role_name: string;
        };
        Returns: boolean;
      };
      has_permission: {
        Args: {
          user_id: string;
          account_id: string;
          permission_name: Database['public']['Enums']['app_permissions'];
        };
        Returns: boolean;
      };
      has_role_on_account: {
        Args: {
          account_id: string;
          account_role?: string;
        };
        Returns: boolean;
      };
      has_same_role_hierarchy_level: {
        Args: {
          target_user_id: string;
          target_account_id: string;
          role_name: string;
        };
        Returns: boolean;
      };
      install_extensions: {
        Args: Record<PropertyKey, never>;
        Returns: undefined;
      };
      is_aal2: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
      is_account_owner: {
        Args: {
          account_id: string;
        };
        Returns: boolean;
      };
      is_account_team_member: {
        Args: {
          target_account_id: string;
        };
        Returns: boolean;
      };
      is_mfa_compliant: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
      is_set: {
        Args: {
          field_name: string;
        };
        Returns: boolean;
      };
      is_super_admin: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
      is_team_member: {
        Args: {
          account_id: string;
          user_id: string;
        };
        Returns: boolean;
      };
      revoke_nonce: {
        Args: {
          p_id: string;
          p_reason?: string;
        };
        Returns: boolean;
      };
      team_account_workspace: {
        Args: {
          account_slug: string;
        };
        Returns: {
          id: string;
          name: string;
          picture_url: string;
          slug: string;
          role: string;
          role_hierarchy_level: number;
          primary_owner_user_id: string;
          subscription_status: Database['public']['Enums']['subscription_status'];
          permissions: Database['public']['Enums']['app_permissions'][];
        }[];
      };
      transfer_team_account_ownership: {
        Args: {
          target_account_id: string;
          new_owner_id: string;
        };
        Returns: undefined;
      };
      upsert_order: {
        Args: {
          target_account_id: string;
          target_customer_id: string;
          target_order_id: string;
          status: Database['public']['Enums']['payment_status'];
          billing_provider: Database['public']['Enums']['billing_provider'];
          total_amount: number;
          currency: string;
          line_items: Json;
        };
        Returns: {
          account_id: string;
          billing_customer_id: number;
          billing_provider: Database['public']['Enums']['billing_provider'];
          created_at: string;
          currency: string;
          id: string;
          status: Database['public']['Enums']['payment_status'];
          total_amount: number;
          updated_at: string;
        };
      };
      upsert_subscription: {
        Args: {
          target_account_id: string;
          target_customer_id: string;
          target_subscription_id: string;
          active: boolean;
          status: Database['public']['Enums']['subscription_status'];
          billing_provider: Database['public']['Enums']['billing_provider'];
          cancel_at_period_end: boolean;
          currency: string;
          period_starts_at: string;
          period_ends_at: string;
          line_items: Json;
          trial_starts_at?: string;
          trial_ends_at?: string;
        };
        Returns: {
          account_id: string;
          active: boolean;
          billing_customer_id: number;
          billing_provider: Database['public']['Enums']['billing_provider'];
          cancel_at_period_end: boolean;
          created_at: string;
          currency: string;
          id: string;
          period_ends_at: string;
          period_starts_at: string;
          status: Database['public']['Enums']['subscription_status'];
          trial_ends_at: string | null;
          trial_starts_at: string | null;
          updated_at: string;
        };
      };
      verify_nonce: {
        Args: {
          p_token: string;
          p_purpose: string;
          p_user_id?: string;
          p_required_scopes?: string[];
          p_max_verification_attempts?: number;
          p_ip?: unknown;
          p_user_agent?: string;
        };
        Returns: Json;
      };
    };
    Enums: {
      app_permissions:
        | 'roles.manage'
        | 'billing.manage'
        | 'settings.manage'
        | 'members.manage'
        | 'invites.manage';
      billing_provider: 'stripe' | 'lemon-squeezy' | 'paddle';
      notification_channel: 'in_app' | 'email';
      notification_type: 'info' | 'warning' | 'error';
      payment_status: 'pending' | 'succeeded' | 'failed';
      subscription_item_type: 'flat' | 'per_seat' | 'metered';
      subscription_status:
        | 'active'
        | 'trialing'
        | 'past_due'
        | 'canceled'
        | 'unpaid'
        | 'incomplete'
        | 'incomplete_expired'
        | 'paused';
    };
    CompositeTypes: {
      invitation: {
        email: string | null;
        role: string | null;
      };
    };
  };
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null;
          avif_autodetection: boolean | null;
          created_at: string | null;
          file_size_limit: number | null;
          id: string;
          name: string;
          owner: string | null;
          owner_id: string | null;
          public: boolean | null;
          updated_at: string | null;
        };
        Insert: {
          allowed_mime_types?: string[] | null;
          avif_autodetection?: boolean | null;
          created_at?: string | null;
          file_size_limit?: number | null;
          id: string;
          name: string;
          owner?: string | null;
          owner_id?: string | null;
          public?: boolean | null;
          updated_at?: string | null;
        };
        Update: {
          allowed_mime_types?: string[] | null;
          avif_autodetection?: boolean | null;
          created_at?: string | null;
          file_size_limit?: number | null;
          id?: string;
          name?: string;
          owner?: string | null;
          owner_id?: string | null;
          public?: boolean | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      migrations: {
        Row: {
          executed_at: string | null;
          hash: string;
          id: number;
          name: string;
        };
        Insert: {
          executed_at?: string | null;
          hash: string;
          id: number;
          name: string;
        };
        Update: {
          executed_at?: string | null;
          hash?: string;
          id?: number;
          name?: string;
        };
        Relationships: [];
      };
      objects: {
        Row: {
          bucket_id: string | null;
          created_at: string | null;
          id: string;
          last_accessed_at: string | null;
          metadata: Json | null;
          name: string | null;
          owner: string | null;
          owner_id: string | null;
          path_tokens: string[] | null;
          updated_at: string | null;
          user_metadata: Json | null;
          version: string | null;
        };
        Insert: {
          bucket_id?: string | null;
          created_at?: string | null;
          id?: string;
          last_accessed_at?: string | null;
          metadata?: Json | null;
          name?: string | null;
          owner?: string | null;
          owner_id?: string | null;
          path_tokens?: string[] | null;
          updated_at?: string | null;
          user_metadata?: Json | null;
          version?: string | null;
        };
        Update: {
          bucket_id?: string | null;
          created_at?: string | null;
          id?: string;
          last_accessed_at?: string | null;
          metadata?: Json | null;
          name?: string | null;
          owner?: string | null;
          owner_id?: string | null;
          path_tokens?: string[] | null;
          updated_at?: string | null;
          user_metadata?: Json | null;
          version?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'objects_bucketId_fkey';
            columns: ['bucket_id'];
            isOneToOne: false;
            referencedRelation: 'buckets';
            referencedColumns: ['id'];
          },
        ];
      };
      s3_multipart_uploads: {
        Row: {
          bucket_id: string;
          created_at: string;
          id: string;
          in_progress_size: number;
          key: string;
          owner_id: string | null;
          upload_signature: string;
          user_metadata: Json | null;
          version: string;
        };
        Insert: {
          bucket_id: string;
          created_at?: string;
          id: string;
          in_progress_size?: number;
          key: string;
          owner_id?: string | null;
          upload_signature: string;
          user_metadata?: Json | null;
          version: string;
        };
        Update: {
          bucket_id?: string;
          created_at?: string;
          id?: string;
          in_progress_size?: number;
          key?: string;
          owner_id?: string | null;
          upload_signature?: string;
          user_metadata?: Json | null;
          version?: string;
        };
        Relationships: [
          {
            foreignKeyName: 's3_multipart_uploads_bucket_id_fkey';
            columns: ['bucket_id'];
            isOneToOne: false;
            referencedRelation: 'buckets';
            referencedColumns: ['id'];
          },
        ];
      };
      s3_multipart_uploads_parts: {
        Row: {
          bucket_id: string;
          created_at: string;
          etag: string;
          id: string;
          key: string;
          owner_id: string | null;
          part_number: number;
          size: number;
          upload_id: string;
          version: string;
        };
        Insert: {
          bucket_id: string;
          created_at?: string;
          etag: string;
          id?: string;
          key: string;
          owner_id?: string | null;
          part_number: number;
          size?: number;
          upload_id: string;
          version: string;
        };
        Update: {
          bucket_id?: string;
          created_at?: string;
          etag?: string;
          id?: string;
          key?: string;
          owner_id?: string | null;
          part_number?: number;
          size?: number;
          upload_id?: string;
          version?: string;
        };
        Relationships: [
          {
            foreignKeyName: 's3_multipart_uploads_parts_bucket_id_fkey';
            columns: ['bucket_id'];
            isOneToOne: false;
            referencedRelation: 'buckets';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 's3_multipart_uploads_parts_upload_id_fkey';
            columns: ['upload_id'];
            isOneToOne: false;
            referencedRelation: 's3_multipart_uploads';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      can_insert_object: {
        Args: {
          bucketid: string;
          name: string;
          owner: string;
          metadata: Json;
        };
        Returns: undefined;
      };
      extension: {
        Args: {
          name: string;
        };
        Returns: string;
      };
      filename: {
        Args: {
          name: string;
        };
        Returns: string;
      };
      foldername: {
        Args: {
          name: string;
        };
        Returns: string[];
      };
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>;
        Returns: {
          size: number;
          bucket_id: string;
        }[];
      };
      list_multipart_uploads_with_delimiter: {
        Args: {
          bucket_id: string;
          prefix_param: string;
          delimiter_param: string;
          max_keys?: number;
          next_key_token?: string;
          next_upload_token?: string;
        };
        Returns: {
          key: string;
          id: string;
          created_at: string;
        }[];
      };
      list_objects_with_delimiter: {
        Args: {
          bucket_id: string;
          prefix_param: string;
          delimiter_param: string;
          max_keys?: number;
          start_after?: string;
          next_token?: string;
        };
        Returns: {
          name: string;
          id: string;
          metadata: Json;
          updated_at: string;
        }[];
      };
      operation: {
        Args: Record<PropertyKey, never>;
        Returns: string;
      };
      search: {
        Args: {
          prefix: string;
          bucketname: string;
          limits?: number;
          levels?: number;
          offsets?: number;
          search?: string;
          sortcolumn?: string;
          sortorder?: string;
        };
        Returns: {
          name: string;
          id: string;
          updated_at: string;
          created_at: string;
          last_accessed_at: string;
          metadata: Json;
        }[];
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, 'public'>];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema['Tables'] & PublicSchema['Views'])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
        Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
      Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] &
        PublicSchema['Views'])
    ? (PublicSchema['Tables'] &
        PublicSchema['Views'])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema['Enums']
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
    ? PublicSchema['Enums'][PublicEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema['CompositeTypes']
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema['CompositeTypes']
    ? PublicSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;
