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
      banners: {
        Row: {
          created_at: string | null
          deleted_at: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          sort_order: number | null
          text: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          sort_order?: number | null
          text?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          sort_order?: number | null
          text?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string | null
          deleted_at: string | null
          id: string
          is_active: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      config: {
        Row: {
          about_text: string | null
          address: string | null
          banners: Json | null
          benefits: Json | null
          business_name: string | null
          created_at: string | null
          cta_text: string | null
          cta_title: string | null
          email: string | null
          footer_credits: string | null
          footer_description: string | null
          footer_policy: string | null
          hero_image: string | null
          hero_subtitle: string | null
          hero_tag: string | null
          hero_title: string | null
          hours: string | null
          id: number
          logo_url: string | null
          meta_description: string | null
          meta_keywords: string | null
          phone: string | null
          section_subtitles: Json | null
          section_tags: Json | null
          section_titles: Json | null
          slogan: string | null
          social: Json | null
          stats: Json | null
          testimonials: Json | null
          updated_at: string | null
          whatsapp: string | null
          whatsapp_message: string | null
        }
        Insert: {
          about_text?: string | null
          address?: string | null
          banners?: Json | null
          benefits?: Json | null
          business_name?: string | null
          created_at?: string | null
          cta_text?: string | null
          cta_title?: string | null
          email?: string | null
          footer_credits?: string | null
          footer_description?: string | null
          footer_policy?: string | null
          hero_image?: string | null
          hero_subtitle?: string | null
          hero_tag?: string | null
          hero_title?: string | null
          hours?: string | null
          id?: number
          logo_url?: string | null
          meta_description?: string | null
          meta_keywords?: string | null
          phone?: string | null
          section_subtitles?: Json | null
          section_tags?: Json | null
          section_titles?: Json | null
          slogan?: string | null
          social?: Json | null
          stats?: Json | null
          testimonials?: Json | null
          updated_at?: string | null
          whatsapp?: string | null
          whatsapp_message?: string | null
        }
        Update: {
          about_text?: string | null
          address?: string | null
          banners?: Json | null
          benefits?: Json | null
          business_name?: string | null
          created_at?: string | null
          cta_text?: string | null
          cta_title?: string | null
          email?: string | null
          footer_credits?: string | null
          footer_description?: string | null
          footer_policy?: string | null
          hero_image?: string | null
          hero_subtitle?: string | null
          hero_tag?: string | null
          hero_title?: string | null
          hours?: string | null
          id?: number
          logo_url?: string | null
          meta_description?: string | null
          meta_keywords?: string | null
          phone?: string | null
          section_subtitles?: Json | null
          section_tags?: Json | null
          section_titles?: Json | null
          slogan?: string | null
          social?: Json | null
          stats?: Json | null
          testimonials?: Json | null
          updated_at?: string | null
          whatsapp?: string | null
          whatsapp_message?: string | null
        }
        Relationships: []
      }
      gallery: {
        Row: {
          alt: string | null
          created_at: string | null
          deleted_at: string | null
          id: string
          image_url: string | null
        }
        Insert: {
          alt?: string | null
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          image_url?: string | null
        }
        Update: {
          alt?: string | null
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          image_url?: string | null
        }
        Relationships: []
      }
      products: {
        Row: {
          category: string
          created_at: string | null
          deleted_at: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      trash: {
        Row: {
          created_at: string | null
          data: Json
          deleted_at: string | null
          id: string
          original_id: string | null
          original_table: string
        }
        Insert: {
          created_at?: string | null
          data: Json
          deleted_at?: string | null
          id?: string
          original_id?: string | null
          original_table: string
        }
        Update: {
          created_at?: string | null
          data?: Json
          deleted_at?: string | null
          id?: string
          original_id?: string | null
          original_table?: string
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
