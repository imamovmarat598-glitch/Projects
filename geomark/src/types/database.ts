export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      photos: {
        Row: {
          id: string
          short_id: string
          filename: string
          original_filename: string
          file_size: number
          mime_type: string
          width: number | null
          height: number | null
          latitude: number | null
          longitude: number | null
          altitude: number | null
          accuracy: number | null
          address: string | null
          city: string | null
          country: string | null
          taken_at: string | null
          device_model: string | null
          device_id: string | null
          ip_address: string | null
          user_agent: string | null
          is_public: boolean
          expires_at: string | null
          auto_delete: '1h' | '24h' | '7d' | 'never'
          view_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          short_id: string
          filename: string
          original_filename: string
          file_size: number
          mime_type: string
          width?: number | null
          height?: number | null
          latitude?: number | null
          longitude?: number | null
          altitude?: number | null
          accuracy?: number | null
          address?: string | null
          city?: string | null
          country?: string | null
          taken_at?: string | null
          device_model?: string | null
          device_id?: string | null
          ip_address?: string | null
          user_agent?: string | null
          is_public?: boolean
          expires_at?: string | null
          auto_delete?: '1h' | '24h' | '7d' | 'never'
          view_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          short_id?: string
          filename?: string
          original_filename?: string
          file_size?: number
          mime_type?: string
          width?: number | null
          height?: number | null
          latitude?: number | null
          longitude?: number | null
          altitude?: number | null
          accuracy?: number | null
          address?: string | null
          city?: string | null
          country?: string | null
          taken_at?: string | null
          device_model?: string | null
          device_id?: string | null
          ip_address?: string | null
          user_agent?: string | null
          is_public?: boolean
          expires_at?: string | null
          auto_delete?: '1h' | '24h' | '7d' | 'never'
          view_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      metadata_logs: {
        Row: {
          id: string
          photo_id: string | null
          latitude: number
          longitude: number
          ip_address: string
          device_id: string | null
          user_agent: string | null
          created_at: string
          expires_at: string
        }
        Insert: {
          id?: string
          photo_id?: string | null
          latitude: number
          longitude: number
          ip_address: string
          device_id?: string | null
          user_agent?: string | null
          created_at?: string
          expires_at?: string
        }
        Update: {
          id?: string
          photo_id?: string | null
          latitude?: number
          longitude?: number
          ip_address?: string
          device_id?: string | null
          user_agent?: string | null
          created_at?: string
          expires_at?: string
        }
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
  }
}

export type Photo = Database['public']['Tables']['photos']['Row']
export type PhotoInsert = Database['public']['Tables']['photos']['Insert']
export type PhotoUpdate = Database['public']['Tables']['photos']['Update']
