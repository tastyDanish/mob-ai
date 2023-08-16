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
      game: {
        Row: {
          bottom_words: string[] | null
          created_at: string
          end_time: string
          id: number
          img_url: string | null
          top_words: string[] | null
        }
        Insert: {
          bottom_words?: string[] | null
          created_at?: string
          end_time: string
          id?: number
          img_url?: string | null
          top_words?: string[] | null
        }
        Update: {
          bottom_words?: string[] | null
          created_at?: string
          end_time?: string
          id?: number
          img_url?: string | null
          top_words?: string[] | null
        }
        Relationships: []
      }
      words: {
        Row: {
          count: number
          created_at: string
          id: number
          word: string
        }
        Insert: {
          count?: number
          created_at?: string
          id?: number
          word?: string
        }
        Update: {
          count?: number
          created_at?: string
          id?: number
          word?: string
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
