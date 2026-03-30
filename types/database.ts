export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          first_name: string | null;
          last_name: string | null;
          full_name: string;
          birth_date: string | null;
          phone_number: string | null;
          role: "member" | "host" | "admin";
          avatar_url: string;
          created_at: string;
        };
        Insert: {
          id: string;
          first_name?: string | null;
          last_name?: string | null;
          full_name: string;
          birth_date?: string | null;
          phone_number?: string | null;
          role?: "member" | "host" | "admin";
          avatar_url?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          first_name?: string | null;
          last_name?: string | null;
          full_name?: string;
          birth_date?: string | null;
          phone_number?: string | null;
          role?: "member" | "host" | "admin";
          avatar_url?: string;
          created_at?: string;
        };
      };
      activities: {
        Row: {
          id: string;
          title: string;
          summary: string;
          starts_at: string;
          city: string;
          age_range: "18-25" | "25-35" | "35-50" | "50+" | null;
          hero_image_url: string;
          host_user_id: string | null;
          requires_approval: boolean;
          max_participants: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          summary: string;
          starts_at: string;
          city: string;
          age_range?: "18-25" | "25-35" | "35-50" | "50+" | null;
          hero_image_url: string;
          host_user_id?: string | null;
          requires_approval?: boolean;
          max_participants?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          summary?: string;
          starts_at?: string;
          city?: string;
          age_range?: "18-25" | "25-35" | "35-50" | "50+" | null;
          hero_image_url?: string;
          host_user_id?: string | null;
          requires_approval?: boolean;
          max_participants?: number;
          created_at?: string;
        };
      };
      activity_participants: {
        Row: {
          id: string;
          activity_id: string;
          user_id: string;
          status: "pending" | "confirmed" | "cancelled";
          request_message: string | null;
          phone_number: string | null;
          whatsapp_opt_in: boolean;
          joined_at: string;
        };
        Insert: {
          id?: string;
          activity_id: string;
          user_id: string;
          status?: "pending" | "confirmed" | "cancelled";
          request_message?: string | null;
          phone_number?: string | null;
          whatsapp_opt_in?: boolean;
          joined_at?: string;
        };
        Update: {
          id?: string;
          activity_id?: string;
          user_id?: string;
          status?: "pending" | "confirmed" | "cancelled";
          request_message?: string | null;
          phone_number?: string | null;
          whatsapp_opt_in?: boolean;
          joined_at?: string;
        };
      };
      user_connections: {
        Row: {
          id: string;
          user_id: string;
          connected_user_id: string;
          shared_activities_count: number;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          connected_user_id: string;
          shared_activities_count?: number;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          connected_user_id?: string;
          shared_activities_count?: number;
          updated_at?: string;
        };
      };
      connection_activities: {
        Row: {
          id: string;
          user_id: string;
          connected_user_id: string;
          activity_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          connected_user_id: string;
          activity_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          connected_user_id?: string;
          activity_id?: string;
          created_at?: string;
        };
      };
    };
    Views: {
      activity_cards: {
        Row: {
          id: string;
          title: string;
          summary: string;
          starts_at: string;
          city: string;
          age_range: "18-25" | "25-35" | "35-50" | "50+" | null;
          hero_image_url: string;
          host_user_id: string | null;
          requires_approval: boolean;
          participant_count: number;
          max_participants: number;
        };
      };
    };
  };
};
