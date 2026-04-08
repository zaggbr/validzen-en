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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      categories: {
        Row: {
          color: string
          description_en: string
          description_pt: string
          icon: string
          id: string
          name_en: string
          name_pt: string
          slug: string
          sort_order: number
        }
        Insert: {
          color?: string
          description_en?: string
          description_pt?: string
          icon?: string
          id?: string
          name_en?: string
          name_pt?: string
          slug: string
          sort_order?: number
        }
        Update: {
          color?: string
          description_en?: string
          description_pt?: string
          icon?: string
          id?: string
          name_en?: string
          name_pt?: string
          slug?: string
          sort_order?: number
        }
        Relationships: []
      }
      daily_quiz_usage: {
        Row: {
          id: string
          quiz_date: string
          session_id: string | null
          specific_quiz_count: number
          user_id: string | null
        }
        Insert: {
          id?: string
          quiz_date?: string
          session_id?: string | null
          specific_quiz_count?: number
          user_id?: string | null
        }
        Update: {
          id?: string
          quiz_date?: string
          session_id?: string | null
          specific_quiz_count?: number
          user_id?: string | null
        }
        Relationships: []
      }
      dimensions: {
        Row: {
          color: string
          description_en: string
          description_pt: string
          icon: string
          id: string
          interpretation_high_en: string
          interpretation_high_pt: string
          interpretation_low_en: string
          interpretation_low_pt: string
          interpretation_moderate_en: string
          interpretation_moderate_pt: string
          layer: number
          name_en: string
          name_pt: string
          recommended_post_slugs: string[]
          slug: string
        }
        Insert: {
          color?: string
          description_en?: string
          description_pt?: string
          icon?: string
          id?: string
          interpretation_high_en?: string
          interpretation_high_pt?: string
          interpretation_low_en?: string
          interpretation_low_pt?: string
          interpretation_moderate_en?: string
          interpretation_moderate_pt?: string
          layer?: number
          name_en?: string
          name_pt?: string
          recommended_post_slugs?: string[]
          slug: string
        }
        Update: {
          color?: string
          description_en?: string
          description_pt?: string
          icon?: string
          id?: string
          interpretation_high_en?: string
          interpretation_high_pt?: string
          interpretation_low_en?: string
          interpretation_low_pt?: string
          interpretation_moderate_en?: string
          interpretation_moderate_pt?: string
          layer?: number
          name_en?: string
          name_pt?: string
          recommended_post_slugs?: string[]
          slug?: string
        }
        Relationships: []
      }
      posts: {
        Row: {
          alternate_slug: string | null
          author_avatar: string
          author_bio: string
          author_credentials: string
          author_name: string
          category: string
          category_slug: string
          content: string
          created_at: string
          excerpt: string
          faq: Json
          featured_image: string
          id: string
          is_premium: boolean
          is_sensitive: boolean
          layer: number
          locale: string
          meta_description: string
          meta_title: string
          published_at: string
          quiz_slug: string | null
          reading_time: number
          related_post_slugs: string[]
          slug: string
          tags: string[]
          title: string
          updated_at: string
          video_url: string | null
        }
        Insert: {
          alternate_slug?: string | null
          author_avatar?: string
          author_bio?: string
          author_credentials?: string
          author_name?: string
          category?: string
          category_slug?: string
          content?: string
          created_at?: string
          excerpt?: string
          faq?: Json
          featured_image?: string
          id?: string
          is_premium?: boolean
          is_sensitive?: boolean
          layer?: number
          locale?: string
          meta_description?: string
          meta_title?: string
          published_at?: string
          quiz_slug?: string | null
          reading_time?: number
          related_post_slugs?: string[]
          slug: string
          tags?: string[]
          title: string
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          alternate_slug?: string | null
          author_avatar?: string
          author_bio?: string
          author_credentials?: string
          author_name?: string
          category?: string
          category_slug?: string
          content?: string
          created_at?: string
          excerpt?: string
          faq?: Json
          featured_image?: string
          id?: string
          is_premium?: boolean
          is_sensitive?: boolean
          layer?: number
          locale?: string
          meta_description?: string
          meta_title?: string
          published_at?: string
          quiz_slug?: string | null
          reading_time?: number
          related_post_slugs?: string[]
          slug?: string
          tags?: string[]
          title?: string
          updated_at?: string
          video_url?: string | null
        }
        Relationships: []
      }
      premium_assessment_posts: {
        Row: {
          assessment_slug: string
          id: string
          post_slug: string
        }
        Insert: {
          assessment_slug: string
          id?: string
          post_slug: string
        }
        Update: {
          assessment_slug?: string
          id?: string
          post_slug?: string
        }
        Relationships: []
      }
      premium_assessment_questions: {
        Row: {
          assessment_slug: string
          dimension: string
          id: string
          options_en: Json
          options_pt: Json
          order_num: number
          question_text_en: string
          question_text_pt: string
          section: string
          weight: number
        }
        Insert: {
          assessment_slug: string
          dimension?: string
          id?: string
          options_en?: Json
          options_pt?: Json
          order_num?: number
          question_text_en?: string
          question_text_pt?: string
          section?: string
          weight?: number
        }
        Update: {
          assessment_slug?: string
          dimension?: string
          id?: string
          options_en?: Json
          options_pt?: Json
          order_num?: number
          question_text_en?: string
          question_text_pt?: string
          section?: string
          weight?: number
        }
        Relationships: []
      }
      premium_assessment_results: {
        Row: {
          answers: Json
          assessment_slug: string
          completed_at: string
          id: string
          interpretation: Json
          overall_score: number | null
          scores: Json
          session_id: string | null
          top_dimensions: Json
          user_id: string | null
        }
        Insert: {
          answers?: Json
          assessment_slug: string
          completed_at?: string
          id?: string
          interpretation?: Json
          overall_score?: number | null
          scores?: Json
          session_id?: string | null
          top_dimensions?: Json
          user_id?: string | null
        }
        Update: {
          answers?: Json
          assessment_slug?: string
          completed_at?: string
          id?: string
          interpretation?: Json
          overall_score?: number | null
          scores?: Json
          session_id?: string | null
          top_dimensions?: Json
          user_id?: string | null
        }
        Relationships: []
      }
      premium_assessments: {
        Row: {
          created_at: string
          description_en: string
          description_pt: string
          estimated_time: number
          id: string
          is_active: boolean
          is_premium: boolean
          question_count: number
          slug: string
          theme: string
          title_en: string
          title_pt: string
        }
        Insert: {
          created_at?: string
          description_en?: string
          description_pt?: string
          estimated_time?: number
          id?: string
          is_active?: boolean
          is_premium?: boolean
          question_count?: number
          slug: string
          theme?: string
          title_en?: string
          title_pt?: string
        }
        Update: {
          created_at?: string
          description_en?: string
          description_pt?: string
          estimated_time?: number
          id?: string
          is_active?: boolean
          is_premium?: boolean
          question_count?: number
          slug?: string
          theme?: string
          title_en?: string
          title_pt?: string
        }
        Relationships: []
      }
      quiz_questions: {
        Row: {
          dimension: string
          id: string
          options: Json
          options_en: Json
          options_pt: Json
          order_num: number
          question_text: string
          question_text_en: string
          question_text_pt: string
          question_type: string
          quiz_slug: string
          weight: number
        }
        Insert: {
          dimension: string
          id?: string
          options?: Json
          options_en?: Json
          options_pt?: Json
          order_num?: number
          question_text: string
          question_text_en?: string
          question_text_pt?: string
          question_type?: string
          quiz_slug: string
          weight?: number
        }
        Update: {
          dimension?: string
          id?: string
          options?: Json
          options_en?: Json
          options_pt?: Json
          order_num?: number
          question_text?: string
          question_text_en?: string
          question_text_pt?: string
          question_type?: string
          quiz_slug?: string
          weight?: number
        }
        Relationships: [
          {
            foreignKeyName: "quiz_questions_quiz_slug_fkey"
            columns: ["quiz_slug"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["slug"]
          },
        ]
      }
      quiz_results: {
        Row: {
          answers: Json
          completed_at: string
          id: string
          locale: string
          overall_score: number | null
          quiz_slug: string
          recommended_post_slugs: string[]
          scores: Json
          session_id: string | null
          severity: string | null
          top_dimensions: string[]
          user_id: string | null
        }
        Insert: {
          answers?: Json
          completed_at?: string
          id?: string
          locale?: string
          overall_score?: number | null
          quiz_slug: string
          recommended_post_slugs?: string[]
          scores?: Json
          session_id?: string | null
          severity?: string | null
          top_dimensions?: string[]
          user_id?: string | null
        }
        Update: {
          answers?: Json
          completed_at?: string
          id?: string
          locale?: string
          overall_score?: number | null
          quiz_slug?: string
          recommended_post_slugs?: string[]
          scores?: Json
          session_id?: string | null
          severity?: string | null
          top_dimensions?: string[]
          user_id?: string | null
        }
        Relationships: []
      }
      quizzes: {
        Row: {
          description: string
          description_en: string
          description_pt: string
          dimensions: string[]
          estimated_time: number
          id: string
          is_active: boolean
          locale: string
          post_slug: string | null
          question_count: number
          slug: string
          title: string
          title_en: string
          title_pt: string
          type: string
        }
        Insert: {
          description?: string
          description_en?: string
          description_pt?: string
          dimensions?: string[]
          estimated_time?: number
          id?: string
          is_active?: boolean
          locale?: string
          post_slug?: string | null
          question_count?: number
          slug: string
          title: string
          title_en?: string
          title_pt?: string
          type?: string
        }
        Update: {
          description?: string
          description_en?: string
          description_pt?: string
          dimensions?: string[]
          estimated_time?: number
          id?: string
          is_active?: boolean
          locale?: string
          post_slug?: string | null
          question_count?: number
          slug?: string
          title?: string
          title_en?: string
          title_pt?: string
          type?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          id: string
          is_premium: boolean
          last_quiz_at: string | null
          posts_viewed_count: number
          preferred_locale: string
          premium_until: string | null
          quiz_count: number
          quizzes_completed_count: number
          stripe_customer_id: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id: string
          is_premium?: boolean
          last_quiz_at?: string | null
          posts_viewed_count?: number
          preferred_locale?: string
          premium_until?: string | null
          quiz_count?: number
          quizzes_completed_count?: number
          stripe_customer_id?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          is_premium?: boolean
          last_quiz_at?: string | null
          posts_viewed_count?: number
          preferred_locale?: string
          premium_until?: string | null
          quiz_count?: number
          quizzes_completed_count?: number
          stripe_customer_id?: string | null
        }
        Relationships: []
      }
      user_progress: {
        Row: {
          bookmarked: boolean
          id: string
          post_slug: string
          quiz_completed: boolean
          read_percentage: number
          updated_at: string
          user_id: string
          video_watched: boolean
        }
        Insert: {
          bookmarked?: boolean
          id?: string
          post_slug: string
          quiz_completed?: boolean
          read_percentage?: number
          updated_at?: string
          user_id: string
          video_watched?: boolean
        }
        Update: {
          bookmarked?: boolean
          id?: string
          post_slug?: string
          quiz_completed?: boolean
          read_percentage?: number
          updated_at?: string
          user_id?: string
          video_watched?: boolean
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
