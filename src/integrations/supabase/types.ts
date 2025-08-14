export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      ad_templates: {
        Row: {
          campaign_template_id: string | null
          created_at: string
          headline: string | null
          hook_type: string | null
          id: string
          is_active: boolean | null
          objective: string | null
          offer_type: string | null
          performance_score: number | null
          platform: string | null
          primary_text: string
          target_market: string | null
          tone: string | null
          updated_at: string
        }
        Insert: {
          campaign_template_id?: string | null
          created_at?: string
          headline?: string | null
          hook_type?: string | null
          id?: string
          is_active?: boolean | null
          objective?: string | null
          offer_type?: string | null
          performance_score?: number | null
          platform?: string | null
          primary_text: string
          target_market?: string | null
          tone?: string | null
          updated_at?: string
        }
        Update: {
          campaign_template_id?: string | null
          created_at?: string
          headline?: string | null
          hook_type?: string | null
          id?: string
          is_active?: boolean | null
          objective?: string | null
          offer_type?: string | null
          performance_score?: number | null
          platform?: string | null
          primary_text?: string
          target_market?: string | null
          tone?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ad_templates_campaign_template_id_fkey"
            columns: ["campaign_template_id"]
            isOneToOne: false
            referencedRelation: "campaign_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      campaign_templates: {
        Row: {
          canonical_name: string
          category: string
          created_at: string
          description: string
          id: string
          is_active: boolean | null
          name: string
          seasonal_timing: string | null
          sort_order: number | null
          target_audience: string | null
          updated_at: string
        }
        Insert: {
          canonical_name: string
          category: string
          created_at?: string
          description: string
          id?: string
          is_active?: boolean | null
          name: string
          seasonal_timing?: string | null
          sort_order?: number | null
          target_audience?: string | null
          updated_at?: string
        }
        Update: {
          canonical_name?: string
          category?: string
          created_at?: string
          description?: string
          id?: string
          is_active?: boolean | null
          name?: string
          seasonal_timing?: string | null
          sort_order?: number | null
          target_audience?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      campaigns: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          offer_type: string | null
          tone_style: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          offer_type?: string | null
          tone_style?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          offer_type?: string | null
          tone_style?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      compliance_checks: {
        Row: {
          compliance_status: string
          content_id: string | null
          content_type: string
          created_at: string
          fixed_text: string | null
          id: string
          original_text: string
          updated_at: string
          user_id: string
          violations: Json | null
        }
        Insert: {
          compliance_status: string
          content_id?: string | null
          content_type: string
          created_at?: string
          fixed_text?: string | null
          id?: string
          original_text: string
          updated_at?: string
          user_id: string
          violations?: Json | null
        }
        Update: {
          compliance_status?: string
          content_id?: string | null
          content_type?: string
          created_at?: string
          fixed_text?: string | null
          id?: string
          original_text?: string
          updated_at?: string
          user_id?: string
          violations?: Json | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      saved_ad_content: {
        Row: {
          campaign_id: string | null
          content: string
          content_type: string
          created_at: string
          id: string
          is_favorite: boolean | null
          metadata: Json | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          campaign_id?: string | null
          content: string
          content_type: string
          created_at?: string
          id?: string
          is_favorite?: boolean | null
          metadata?: Json | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          campaign_id?: string | null
          content?: string
          content_type?: string
          created_at?: string
          id?: string
          is_favorite?: boolean | null
          metadata?: Json | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_ad_content_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      top_performing_ads: {
        Row: {
          campaign_canonical_name: string
          content_hash: string | null
          cost_per_result: string | null
          created_at: string | null
          headline: string | null
          hook_type: string | null
          id: string
          insights: string | null
          media_url: string | null
          platform: string[] | null
          primary_text: string
          result: string | null
          target_location: string | null
          target_market: string | null
          tone: string | null
        }
        Insert: {
          campaign_canonical_name: string
          content_hash?: string | null
          cost_per_result?: string | null
          created_at?: string | null
          headline?: string | null
          hook_type?: string | null
          id?: string
          insights?: string | null
          media_url?: string | null
          platform?: string[] | null
          primary_text: string
          result?: string | null
          target_location?: string | null
          target_market?: string | null
          tone?: string | null
        }
        Update: {
          campaign_canonical_name?: string
          content_hash?: string | null
          cost_per_result?: string | null
          created_at?: string | null
          headline?: string | null
          hook_type?: string | null
          id?: string
          insights?: string | null
          media_url?: string | null
          platform?: string[] | null
          primary_text?: string
          result?: string | null
          target_location?: string | null
          target_market?: string | null
          tone?: string | null
        }
        Relationships: []
      }
      user_onboarding: {
        Row: {
          brand_colors: string | null
          brand_words: string | null
          business_name: string | null
          campaign_types: string[] | null
          client_words: string | null
          coaching_style: string | null
          competitor_urls: string | null
          completed_at: string | null
          created_at: string
          failed_solutions: string | null
          id: string
          instagram_reel_url: string | null
          logo_url: string | null
          magic_wand_result: string | null
          main_problem: string | null
          meta_account: string | null
          offer_type: string | null
          seasonal_launch_options: string[] | null
          step_completed: number | null
          target_market: string | null
          updated_at: string
          user_id: string
          voice_tone_style: string | null
          website_tone_scan: string | null
          website_url: string | null
          words_to_avoid: string | null
        }
        Insert: {
          brand_colors?: string | null
          brand_words?: string | null
          business_name?: string | null
          campaign_types?: string[] | null
          client_words?: string | null
          coaching_style?: string | null
          competitor_urls?: string | null
          completed_at?: string | null
          created_at?: string
          failed_solutions?: string | null
          id?: string
          instagram_reel_url?: string | null
          logo_url?: string | null
          magic_wand_result?: string | null
          main_problem?: string | null
          meta_account?: string | null
          offer_type?: string | null
          seasonal_launch_options?: string[] | null
          step_completed?: number | null
          target_market?: string | null
          updated_at?: string
          user_id: string
          voice_tone_style?: string | null
          website_tone_scan?: string | null
          website_url?: string | null
          words_to_avoid?: string | null
        }
        Update: {
          brand_colors?: string | null
          brand_words?: string | null
          business_name?: string | null
          campaign_types?: string[] | null
          client_words?: string | null
          coaching_style?: string | null
          competitor_urls?: string | null
          completed_at?: string | null
          created_at?: string
          failed_solutions?: string | null
          id?: string
          instagram_reel_url?: string | null
          logo_url?: string | null
          magic_wand_result?: string | null
          main_problem?: string | null
          meta_account?: string | null
          offer_type?: string | null
          seasonal_launch_options?: string[] | null
          step_completed?: number | null
          target_market?: string | null
          updated_at?: string
          user_id?: string
          voice_tone_style?: string | null
          website_tone_scan?: string | null
          website_url?: string | null
          words_to_avoid?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
