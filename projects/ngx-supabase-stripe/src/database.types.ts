export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_stripe_checkout_session: {
        Args: { session_id: string }
        Returns: {
          id: string
          customer: string
          payment_intent: string
          subscription: string
          attrs: Json
        }[]
      }
      get_stripe_community_products: {
        Args: { p_community_id: string }
        Returns: {
          id: string
          name: string
          description: string
          price: number
          image_url: string
          video: string
          payment_provider_product_id: string
          created_at: string
          updated_at: string
        }[]
      }
      get_stripe_customer: {
        Args: { customer_email: string }
        Returns: {
          id: string
          email: string
          name: string
          description: string
          created: string
          attrs: Json
        }[]
      }
      get_stripe_customer_payment_intents: {
        Args: { customer_id: string }
        Returns: {
          id: string
          customer: string
          amount: number
          currency: string
          payment_method: string
          created: string
          attrs: Json
        }[]
      }
      get_stripe_customer_subscriptions: {
        Args: { customer_id: string }
        Returns: {
          id: string
          customer: string
          currency: string
          current_period_start: string
          current_period_end: string
          attrs: Json
        }[]
      }
      get_stripe_prices: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          active: boolean
          currency: string
          product: string
          unit_amount: number
          type: string
          attrs: Json
        }[]
      }
      get_stripe_product: {
        Args: { product_id: string }
        Returns: {
          id: string
          name: string
          active: boolean
          default_price: string
          description: string
          attrs: Json
        }[]
      }
      get_stripe_products: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          name: string
          active: boolean
          default_price: string
          description: string
          attrs: Json
        }[]
      }
      get_stripe_subscription: {
        Args: { subscription_id: string }
        Returns: {
          id: string
          customer: string
          currency: string
          current_period_start: string
          current_period_end: string
          attrs: Json
        }[]
      }
      get_stripe_subscriptions: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          customer: string
          currency: string
          current_period_start: string
          current_period_end: string
          attrs: Json
        }[]
      }
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  stripe: {
    Tables: {
      accounts: {
        Row: {
          attrs: Json | null
          business_type: string | null
          country: string | null
          created: string | null
          email: string | null
          id: string | null
          type: string | null
        }
        Insert: {
          attrs?: Json | null
          business_type?: string | null
          country?: string | null
          created?: string | null
          email?: string | null
          id?: string | null
          type?: string | null
        }
        Update: {
          attrs?: Json | null
          business_type?: string | null
          country?: string | null
          created?: string | null
          email?: string | null
          id?: string | null
          type?: string | null
        }
        Relationships: []
      }
      checkout_sessions: {
        Row: {
          attrs: Json | null
          customer: string | null
          id: string | null
          payment_intent: string | null
          subscription: string | null
        }
        Insert: {
          attrs?: Json | null
          customer?: string | null
          id?: string | null
          payment_intent?: string | null
          subscription?: string | null
        }
        Update: {
          attrs?: Json | null
          customer?: string | null
          id?: string | null
          payment_intent?: string | null
          subscription?: string | null
        }
        Relationships: []
      }
      customers: {
        Row: {
          attrs: Json | null
          created: string | null
          description: string | null
          email: string | null
          id: string | null
          name: string | null
        }
        Insert: {
          attrs?: Json | null
          created?: string | null
          description?: string | null
          email?: string | null
          id?: string | null
          name?: string | null
        }
        Update: {
          attrs?: Json | null
          created?: string | null
          description?: string | null
          email?: string | null
          id?: string | null
          name?: string | null
        }
        Relationships: []
      }
      payment_intents: {
        Row: {
          amount: number | null
          attrs: Json | null
          created: string | null
          currency: string | null
          customer: string | null
          id: string | null
          payment_method: string | null
        }
        Insert: {
          amount?: number | null
          attrs?: Json | null
          created?: string | null
          currency?: string | null
          customer?: string | null
          id?: string | null
          payment_method?: string | null
        }
        Update: {
          amount?: number | null
          attrs?: Json | null
          created?: string | null
          currency?: string | null
          customer?: string | null
          id?: string | null
          payment_method?: string | null
        }
        Relationships: []
      }
      prices: {
        Row: {
          active: boolean | null
          attrs: Json | null
          created: string | null
          currency: string | null
          id: string | null
          product: string | null
          type: string | null
          unit_amount: number | null
        }
        Insert: {
          active?: boolean | null
          attrs?: Json | null
          created?: string | null
          currency?: string | null
          id?: string | null
          product?: string | null
          type?: string | null
          unit_amount?: number | null
        }
        Update: {
          active?: boolean | null
          attrs?: Json | null
          created?: string | null
          currency?: string | null
          id?: string | null
          product?: string | null
          type?: string | null
          unit_amount?: number | null
        }
        Relationships: []
      }
      products: {
        Row: {
          active: boolean | null
          attrs: Json | null
          created: string | null
          default_price: string | null
          description: string | null
          id: string | null
          name: string | null
          updated: string | null
        }
        Insert: {
          active?: boolean | null
          attrs?: Json | null
          created?: string | null
          default_price?: string | null
          description?: string | null
          id?: string | null
          name?: string | null
          updated?: string | null
        }
        Update: {
          active?: boolean | null
          attrs?: Json | null
          created?: string | null
          default_price?: string | null
          description?: string | null
          id?: string | null
          name?: string | null
          updated?: string | null
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          attrs: Json | null
          currency: string | null
          current_period_end: string | null
          current_period_start: string | null
          customer: string | null
          id: string | null
        }
        Insert: {
          attrs?: Json | null
          currency?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          customer?: string | null
          id?: string | null
        }
        Update: {
          attrs?: Json | null
          currency?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          customer?: string | null
          id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_stripe_checkout_session: {
        Args: { session_id: string }
        Returns: {
          id: string
          customer: string
          payment_intent: string
          subscription: string
          attrs: Json
        }[]
      }
      get_stripe_community_products: {
        Args: { p_community_id: string }
        Returns: {
          id: string
          name: string
          description: string
          price: number
          image_url: string
          video: string
          payment_provider_product_id: string
          created_at: string
          updated_at: string
        }[]
      }
      get_stripe_customer: {
        Args: { customer_email: string }
        Returns: {
          id: string
          email: string
          name: string
          description: string
          created: string
          attrs: Json
        }[]
      }
      get_stripe_customer_payment_intents: {
        Args: { customer_id: string }
        Returns: {
          id: string
          customer: string
          amount: number
          currency: string
          payment_method: string
          created: string
          attrs: Json
        }[]
      }
      get_stripe_customer_subscriptions: {
        Args: { customer_id: string }
        Returns: {
          id: string
          customer: string
          currency: string
          current_period_start: string
          current_period_end: string
          attrs: Json
        }[]
      }
      get_stripe_prices: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          active: boolean
          currency: string
          product: string
          unit_amount: number
          type: string
          attrs: Json
        }[]
      }
      get_stripe_product: {
        Args: { product_id: string }
        Returns: {
          id: string
          name: string
          active: boolean
          default_price: string
          description: string
          attrs: Json
        }[]
      }
      get_stripe_products: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          name: string
          active: boolean
          default_price: string
          description: string
          attrs: Json
        }[]
      }
      get_stripe_subscription: {
        Args: { subscription_id: string }
        Returns: {
          id: string
          customer: string
          currency: string
          current_period_start: string
          current_period_end: string
          attrs: Json
        }[]
      }
      get_stripe_subscriptions: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          customer: string
          currency: string
          current_period_start: string
          current_period_end: string
          attrs: Json
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public" | "stripe">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
