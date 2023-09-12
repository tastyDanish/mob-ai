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
          game_round: number | null
          id: number
          img_url: string | null
          top_words: string[] | null
        }
        Insert: {
          bottom_words?: string[] | null
          created_at?: string
          game_round?: number | null
          id?: number
          img_url?: string | null
          top_words?: string[] | null
        }
        Update: {
          bottom_words?: string[] | null
          created_at?: string
          game_round?: number | null
          id?: number
          img_url?: string | null
          top_words?: string[] | null
        }
        Relationships: []
      }
      seed: {
        Row: {
          id: number
          phrase: string | null
        }
        Insert: {
          id?: number
          phrase?: string | null
        }
        Update: {
          id?: number
          phrase?: string | null
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
      add_word:
        | {
            Args: {
              new_word: string
            }
            Returns: string
          }
        | {
            Args: {
              new_word: string
              is_positive: boolean
            }
            Returns: string
          }
      advance_game_round: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      hello_world: {
        Args: Record<PropertyKey, never>
        Returns: string
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
