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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      inquiries: {
        Row: {
          company: string | null
          created_at: string
          email: string
          file_name: string | null
          file_url: string | null
          id: string
          kind: string
          message: string
          name: string
          phone: string | null
          photo_url: string | null
          sector: string | null
          status: string
          user_id: string | null
        }
        Insert: {
          company?: string | null
          created_at?: string
          email: string
          file_name?: string | null
          file_url?: string | null
          id?: string
          kind?: string
          message: string
          name: string
          phone?: string | null
          photo_url?: string | null
          sector?: string | null
          status?: string
          user_id?: string | null
        }
        Update: {
          company?: string | null
          created_at?: string
          email?: string
          file_name?: string | null
          file_url?: string | null
          id?: string
          kind?: string
          message?: string
          name?: string
          phone?: string | null
          photo_url?: string | null
          sector?: string | null
          status?: string
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          company: string
          created_at: string
          email: string
          full_name: string
          id: string
          phone: string
          updated_at: string
        }
        Insert: {
          company?: string
          created_at?: string
          email?: string
          full_name?: string
          id: string
          phone?: string
          updated_at?: string
        }
        Update: {
          company?: string
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          phone?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      portfolio_projects: {
        Row: {
          client_name: string | null
          created_at: string
          description_ar: string
          description_en: string
          id: string
          image_url: string
          is_hidden: boolean
          location: string | null
          order_index: number
          sector: string | null
          title_ar: string
          title_en: string
          updated_at: string
          year: string | null
        }
        Insert: {
          client_name?: string | null
          created_at?: string
          description_ar: string
          description_en: string
          id?: string
          image_url: string
          is_hidden?: boolean
          location?: string | null
          order_index?: number
          sector?: string | null
          title_ar: string
          title_en: string
          updated_at?: string
          year?: string | null
        }
        Update: {
          client_name?: string | null
          created_at?: string
          description_ar?: string
          description_en?: string
          id?: string
          image_url?: string
          is_hidden?: boolean
          location?: string | null
          order_index?: number
          sector?: string | null
          title_ar?: string
          title_en?: string
          updated_at?: string
          year?: string | null
        }
        Relationships: []
      }
      smart_products: {
        Row: {
          available_colors: unknown
          available_gangs: unknown
          base_price_egp: number
          category: string
          category_name_ar: string
          category_name_en: string
          created_at: string
          description_ar: string
          description_en: string
          features_ar: unknown
          features_en: unknown
          id: string
          images: unknown
          in_stock: boolean
          is_deal: boolean
          is_hidden: boolean
          is_popular: boolean
          order_index: number
          original_price_egp: number | null
          protocol: string
          rating: number
          reviews_count: number
          slug: string
          specs: unknown
          stock_quantity: number
          title_ar: string
          title_en: string
          updated_at: string
          variants: unknown
        }
        Insert: {
          available_colors?: unknown
          available_gangs?: unknown
          base_price_egp: number
          category: string
          category_name_ar: string
          category_name_en: string
          created_at?: string
          description_ar: string
          description_en: string
          features_ar?: unknown
          features_en?: unknown
          id?: string
          images?: unknown
          in_stock?: boolean
          is_deal?: boolean
          is_hidden?: boolean
          is_popular?: boolean
          order_index?: number
          original_price_egp?: number | null
          protocol: string
          rating?: number
          reviews_count?: number
          slug: string
          specs?: unknown
          stock_quantity?: number
          title_ar: string
          title_en: string
          updated_at?: string
          variants?: unknown
        }
        Update: {
          available_colors?: unknown
          available_gangs?: unknown
          base_price_egp?: number
          category?: string
          category_name_ar?: string
          category_name_en?: string
          created_at?: string
          description_ar?: string
          description_en?: string
          features_ar?: unknown
          features_en?: unknown
          id?: string
          images?: unknown
          in_stock?: boolean
          is_deal?: boolean
          is_hidden?: boolean
          is_popular?: boolean
          order_index?: number
          original_price_egp?: number | null
          protocol?: string
          rating?: number
          reviews_count?: number
          slug?: string
          specs?: unknown
          stock_quantity?: number
          title_ar?: string
          title_en?: string
          updated_at?: string
          variants?: unknown
        }
        Relationships: []
      }
      cart_items: {
        Row: {
          color: string | null
          created_at: string
          gang_count: number | null
          id: string
          image: string
          item_id: string
          original_price_egp: number | null
          price_egp: number
          product_id: string
          protocol: string | null
          quantity: number
          title_ar: string
          title_en: string
          updated_at: string
          user_id: string
          variant_label_ar: string | null
          variant_label_en: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string
          gang_count?: number | null
          id?: string
          image: string
          item_id: string
          original_price_egp?: number | null
          price_egp: number
          product_id: string
          protocol?: string | null
          quantity?: number
          title_ar: string
          title_en: string
          updated_at?: string
          user_id: string
          variant_label_ar?: string | null
          variant_label_en?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string
          gang_count?: number | null
          id?: string
          image?: string
          item_id?: string
          original_price_egp?: number | null
          price_egp?: number
          product_id?: string
          protocol?: string | null
          quantity?: number
          title_ar?: string
          title_en?: string
          updated_at?: string
          user_id?: string
          variant_label_ar?: string | null
          variant_label_en?: string | null
        }
        Relationships: []
      }
      services: {
        Row: {
          id: string
          name_ar: string
          name_en: string
          slug: string
          description_ar: string
          description_en: string
          icon: string
          is_active: boolean
          order_index: number
          created_at: string
        }
        Insert: {
          id?: string
          name_ar: string
          name_en: string
          slug: string
          description_ar: string
          description_en: string
          icon?: string
          is_active?: boolean
          order_index?: number
          created_at?: string
        }
        Update: {
          id?: string
          name_ar?: string
          name_en?: string
          slug?: string
          description_ar?: string
          description_en?: string
          icon?: string
          is_active?: boolean
          order_index?: number
          created_at?: string
        }
        Relationships: []
      }
      project_requests: {
        Row: {
          id: string
          reference_number: string
          guest_access_token: string
          customer_id: string | null
          full_name: string
          email: string
          phone: string
          whatsapp: string | null
          user_type: string
          university: string | null
          department: string | null
          project_title: string
          project_category: string
          project_description: string
          objectives: string | null
          required_features: string | null
          current_stage: string
          existing_technologies: string | null
          technical_challenges: string | null
          conditional_details: Json | null
          deadline: string | null
          urgency: string
          budget_min: number | null
          budget_max: number | null
          budget_currency: string | null
          preferred_contact_method: string | null
          additional_notes: string | null
          status: string
          assigned_admin_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          reference_number: string
          guest_access_token?: string
          customer_id?: string | null
          full_name: string
          email: string
          phone: string
          whatsapp?: string | null
          user_type?: string
          university?: string | null
          department?: string | null
          project_title: string
          project_category: string
          project_description: string
          objectives?: string | null
          required_features?: string | null
          current_stage?: string
          existing_technologies?: string | null
          technical_challenges?: string | null
          conditional_details?: Json | null
          deadline?: string | null
          urgency?: string
          budget_min?: number | null
          budget_max?: number | null
          budget_currency?: string | null
          preferred_contact_method?: string | null
          additional_notes?: string | null
          status?: string
          assigned_admin_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          reference_number?: string
          guest_access_token?: string
          customer_id?: string | null
          full_name?: string
          email?: string
          phone?: string
          whatsapp?: string | null
          user_type?: string
          university?: string | null
          department?: string | null
          project_title?: string
          project_category?: string
          project_description?: string
          objectives?: string | null
          required_features?: string | null
          current_stage?: string
          existing_technologies?: string | null
          technical_challenges?: string | null
          conditional_details?: Json | null
          deadline?: string | null
          urgency?: string
          budget_min?: number | null
          budget_max?: number | null
          budget_currency?: string | null
          preferred_contact_method?: string | null
          additional_notes?: string | null
          status?: string
          assigned_admin_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      project_request_services: {
        Row: {
          id: string
          project_request_id: string
          service_id: string | null
          service_slug: string
          created_at: string
        }
        Insert: {
          id?: string
          project_request_id: string
          service_id?: string | null
          service_slug: string
          created_at?: string
        }
        Update: {
          id?: string
          project_request_id?: string
          service_id?: string | null
          service_slug?: string
          created_at?: string
        }
        Relationships: []
      }
      project_files: {
        Row: {
          id: string
          project_request_id: string
          uploaded_by: string | null
          uploader_role: string
          file_name: string
          file_path: string
          mime_type: string | null
          file_size: number | null
          file_category: string | null
          created_at: string
        }
        Insert: {
          id?: string
          project_request_id: string
          uploaded_by?: string | null
          uploader_role?: string
          file_name: string
          file_path: string
          mime_type?: string | null
          file_size?: number | null
          file_category?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          project_request_id?: string
          uploaded_by?: string | null
          uploader_role?: string
          file_name?: string
          file_path?: string
          mime_type?: string | null
          file_size?: number | null
          file_category?: string | null
          created_at?: string
        }
        Relationships: []
      }
      project_messages: {
        Row: {
          id: string
          project_request_id: string
          sender_id: string | null
          sender_name: string
          sender_role: string
          message: string
          is_internal: boolean
          attachment_url: string | null
          attachment_name: string | null
          created_at: string
        }
        Insert: {
          id?: string
          project_request_id: string
          sender_id?: string | null
          sender_name: string
          sender_role?: string
          message: string
          is_internal?: boolean
          attachment_url?: string | null
          attachment_name?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          project_request_id?: string
          sender_id?: string | null
          sender_name?: string
          sender_role?: string
          message?: string
          is_internal?: boolean
          attachment_url?: string | null
          attachment_name?: string | null
          created_at?: string
        }
        Relationships: []
      }
      project_status_history: {
        Row: {
          id: string
          project_request_id: string
          previous_status: string | null
          new_status: string
          notes: string | null
          changed_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          project_request_id: string
          previous_status?: string | null
          new_status: string
          notes?: string | null
          changed_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          project_request_id?: string
          previous_status?: string | null
          new_status?: string
          notes?: string | null
          changed_by?: string | null
          created_at?: string
        }
        Relationships: []
      }
      project_quotes: {
        Row: {
          id: string
          project_request_id: string
          quote_number: string
          scope: string
          deliverables: string
          estimated_cost: number
          currency: string
          estimated_duration: string
          terms: string | null
          quote_status: string
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_request_id: string
          quote_number: string
          scope: string
          deliverables: string
          estimated_cost: number
          currency?: string
          estimated_duration: string
          terms?: string | null
          quote_status?: string
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_request_id?: string
          quote_number?: string
          scope?: string
          deliverables?: string
          estimated_cost?: number
          currency?: string
          estimated_duration?: string
          terms?: string | null
          quote_status?: string
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      project_milestones: {
        Row: {
          id: string
          project_request_id: string
          title: string
          description: string | null
          status: string
          due_date: string | null
          completed_at: string | null
          order_index: number
          created_at: string
        }
        Insert: {
          id?: string
          project_request_id: string
          title: string
          description?: string | null
          status?: string
          due_date?: string | null
          completed_at?: string | null
          order_index?: number
          created_at?: string
        }
        Update: {
          id?: string
          project_request_id?: string
          title?: string
          description?: string | null
          status?: string
          due_date?: string | null
          completed_at?: string | null
          order_index?: number
          created_at?: string
        }
        Relationships: []
      }
      project_showcase: {
        Row: {
          id: string
          title_ar: string
          title_en: string
          description_ar: string
          description_en: string
          category: string
          technologies: string[]
          image_path: string | null
          video_url: string | null
          is_published: boolean
          order_index: number
          created_at: string
        }
        Insert: {
          id?: string
          title_ar: string
          title_en: string
          description_ar: string
          description_en: string
          category: string
          technologies?: string[]
          image_path?: string | null
          video_url?: string | null
          is_published?: boolean
          order_index?: number
          created_at?: string
        }
        Update: {
          id?: string
          title_ar?: string
          title_en?: string
          description_ar?: string
          description_en?: string
          category?: string
          technologies?: string[]
          image_path?: string | null
          video_url?: string | null
          is_published?: boolean
          order_index?: number
          created_at?: string
        }
        Relationships: []
      }
      admin_notifications: {
        Row: {
          id: string
          recipient_id: string | null
          project_request_id: string | null
          notification_type: string
          title: string
          content: string | null
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          recipient_id?: string | null
          project_request_id?: string | null
          notification_type: string
          title: string
          content?: string | null
          is_read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          recipient_id?: string | null
          project_request_id?: string | null
          notification_type?: string
          title?: string
          content?: string | null
          is_read?: boolean
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      decrement_smart_product_stock: {
        Args: {
          order_items: Json
        }
        Returns: Json
      }
      set_smart_product_stock: {
        Args: {
          p_product_id: string
          p_quantity: number
        }
        Returns: Json
      }
      verify_guest_project: {
        Args: {
          p_reference: string
          p_token: string
        }
        Returns: Json
      }
      guest_send_message: {
        Args: {
          p_reference: string
          p_token: string
          p_sender_name: string
          p_message: string
          p_attachment_url?: string
          p_attachment_name?: string
        }
        Returns: Json
      }
    }
    Enums: {
      app_role: "admin" | "user"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
