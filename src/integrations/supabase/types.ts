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
      accessories: {
        Row: {
          created_at: string | null
          created_by: string
          description: string | null
          id: string
          location_id: string | null
          manufacturer_id: string
          name: string
          quantity: number
          sku: string
          updated_at: string | null
          updated_by: string
        }
        Insert: {
          created_at?: string | null
          created_by: string
          description?: string | null
          id?: string
          location_id?: string | null
          manufacturer_id: string
          name: string
          quantity?: number
          sku: string
          updated_at?: string | null
          updated_by: string
        }
        Update: {
          created_at?: string | null
          created_by?: string
          description?: string | null
          id?: string
          location_id?: string | null
          manufacturer_id?: string
          name?: string
          quantity?: number
          sku?: string
          updated_at?: string | null
          updated_by?: string
        }
        Relationships: []
      }
      accessory_transactions: {
        Row: {
          accessory_id: string
          created_at: string | null
          created_by: string
          id: string
          new_quantity: number
          notes: string | null
          previous_quantity: number
          quantity: number
          reference_id: string
          transaction_type: Database["public"]["Enums"]["transaction_type"]
        }
        Insert: {
          accessory_id: string
          created_at?: string | null
          created_by: string
          id?: string
          new_quantity: number
          notes?: string | null
          previous_quantity: number
          quantity: number
          reference_id: string
          transaction_type: Database["public"]["Enums"]["transaction_type"]
        }
        Update: {
          accessory_id?: string
          created_at?: string | null
          created_by?: string
          id?: string
          new_quantity?: number
          notes?: string | null
          previous_quantity?: number
          quantity?: number
          reference_id?: string
          transaction_type?: Database["public"]["Enums"]["transaction_type"]
        }
        Relationships: []
      }
      canonical_models: {
        Row: {
          device_type: string | null
          id: string
          name: string
          notes: string | null
        }
        Insert: {
          device_type?: string | null
          id?: string
          name: string
          notes?: string | null
        }
        Update: {
          device_type?: string | null
          id?: string
          name?: string
          notes?: string | null
        }
        Relationships: []
      }
      cellular_device_transactions: {
        Row: {
          created_at: string | null
          created_by: string | null
          device_id: string
          id: string
          new_status: Database["public"]["Enums"]["device_status"]
          notes: string | null
          previous_status: Database["public"]["Enums"]["device_status"] | null
          reference_id: string
          transaction_type: Database["public"]["Enums"]["transaction_type"]
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          device_id: string
          id?: string
          new_status: Database["public"]["Enums"]["device_status"]
          notes?: string | null
          previous_status?: Database["public"]["Enums"]["device_status"] | null
          reference_id: string
          transaction_type: Database["public"]["Enums"]["transaction_type"]
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          device_id?: string
          id?: string
          new_status?: Database["public"]["Enums"]["device_status"]
          notes?: string | null
          previous_status?: Database["public"]["Enums"]["device_status"] | null
          reference_id?: string
          transaction_type?: Database["public"]["Enums"]["transaction_type"]
        }
        Relationships: []
      }
      cellular_devices: {
        Row: {
          color: string | null
          created_at: string | null
          grade_id: number | null
          id: string
          imei: string
          location_id: string | null
          qc_comments: string | null
          qc_completed: boolean
          qc_required: boolean
          qc_status: string | null
          repair_completed: boolean
          repair_required: boolean
          status: Database["public"]["Enums"]["device_status"]
          storage_gb: number | null
          supplier_id: string | null
          tac_id: string
          updated_at: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          grade_id?: number | null
          id?: string
          imei: string
          location_id?: string | null
          qc_comments?: string | null
          qc_completed?: boolean
          qc_required?: boolean
          qc_status?: string | null
          repair_completed?: boolean
          repair_required?: boolean
          status?: Database["public"]["Enums"]["device_status"]
          storage_gb?: number | null
          supplier_id?: string | null
          tac_id: string
          updated_at?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          grade_id?: number | null
          id?: string
          imei?: string
          location_id?: string | null
          qc_comments?: string | null
          qc_completed?: boolean
          qc_required?: boolean
          qc_status?: string | null
          repair_completed?: boolean
          repair_required?: boolean
          status?: Database["public"]["Enums"]["device_status"]
          storage_gb?: number | null
          supplier_id?: string | null
          tac_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cellular_devices_grade_id_fkey"
            columns: ["grade_id"]
            isOneToOne: false
            referencedRelation: "product_grades"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cellular_devices_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "storage_locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cellular_devices_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cellular_devices_tac_id_fkey"
            columns: ["tac_id"]
            isOneToOne: false
            referencedRelation: "tac_codes"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          address_line1: string | null
          address_line2: string | null
          city: string | null
          country: string | null
          created_at: string | null
          created_by: string | null
          customer_code: string
          email: string | null
          id: string
          name: string
          phone: string | null
          postcode: string | null
          updated_at: string | null
          vat_number: string | null
        }
        Insert: {
          address_line1?: string | null
          address_line2?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          created_by?: string | null
          customer_code: string
          email?: string | null
          id?: string
          name: string
          phone?: string | null
          postcode?: string | null
          updated_at?: string | null
          vat_number?: string | null
        }
        Update: {
          address_line1?: string | null
          address_line2?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          created_by?: string | null
          customer_code?: string
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          postcode?: string | null
          updated_at?: string | null
          vat_number?: string | null
        }
        Relationships: []
      }
      device_configurations: {
        Row: {
          available_colors: string[] | null
          created_at: string | null
          id: string
          manufacturer: string
          model_name: string
          release_year: number | null
          storage_options: string[] | null
          updated_at: string | null
        }
        Insert: {
          available_colors?: string[] | null
          created_at?: string | null
          id?: string
          manufacturer: string
          model_name: string
          release_year?: number | null
          storage_options?: string[] | null
          updated_at?: string | null
        }
        Update: {
          available_colors?: string[] | null
          created_at?: string | null
          id?: string
          manufacturer?: string
          model_name?: string
          release_year?: number | null
          storage_options?: string[] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      device_models: {
        Row: {
          common_model_no: string
          id: number
          manufacturer: string
          model_name: string
        }
        Insert: {
          common_model_no: string
          id: number
          manufacturer: string
          model_name: string
        }
        Update: {
          common_model_no?: string
          id?: number
          manufacturer?: string
          model_name?: string
        }
        Relationships: []
      }
      device_variants: {
        Row: {
          device_model_id: number
          id: number
          model_no: string
          tac_code: string
        }
        Insert: {
          device_model_id: number
          id: number
          model_no: string
          tac_code: string
        }
        Update: {
          device_model_id?: number
          id?: number
          model_no?: string
          tac_code?: string
        }
        Relationships: [
          {
            foreignKeyName: "device_variants_device_model_id_fkey"
            columns: ["device_model_id"]
            isOneToOne: false
            referencedRelation: "device_models"
            referencedColumns: ["id"]
          },
        ]
      }
      manufacturer_synonyms: {
        Row: {
          canonical_name: string
          id: string
          raw_name: string
        }
        Insert: {
          canonical_name: string
          id?: string
          raw_name: string
        }
        Update: {
          canonical_name?: string
          id?: string
          raw_name?: string
        }
        Relationships: []
      }
      manufacturers: {
        Row: {
          created_at: string | null
          id: string
          manufacturer_id: string | null
          name: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          manufacturer_id?: string | null
          name: string
        }
        Update: {
          created_at?: string | null
          id?: string
          manufacturer_id?: string | null
          name?: string
        }
        Relationships: []
      }
      part_transactions: {
        Row: {
          created_at: string | null
          created_by: string
          id: string
          new_quantity: number
          notes: string | null
          part_id: string
          previous_quantity: number
          quantity: number
          reference_id: string
          transaction_type: Database["public"]["Enums"]["transaction_type"]
        }
        Insert: {
          created_at?: string | null
          created_by: string
          id?: string
          new_quantity: number
          notes?: string | null
          part_id: string
          previous_quantity: number
          quantity: number
          reference_id: string
          transaction_type: Database["public"]["Enums"]["transaction_type"]
        }
        Update: {
          created_at?: string | null
          created_by?: string
          id?: string
          new_quantity?: number
          notes?: string | null
          part_id?: string
          previous_quantity?: number
          quantity?: number
          reference_id?: string
          transaction_type?: Database["public"]["Enums"]["transaction_type"]
        }
        Relationships: []
      }
      parts: {
        Row: {
          color: string | null
          created_at: string | null
          created_by: string
          description: string | null
          id: string
          location_id: string | null
          manufacturer_id: string
          name: string
          quantity: number
          sku: string
          updated_at: string | null
          updated_by: string
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          created_by: string
          description?: string | null
          id?: string
          location_id?: string | null
          manufacturer_id: string
          name: string
          quantity?: number
          sku: string
          updated_at?: string | null
          updated_by: string
        }
        Update: {
          color?: string | null
          created_at?: string | null
          created_by?: string
          description?: string | null
          id?: string
          location_id?: string | null
          manufacturer_id?: string
          name?: string
          quantity?: number
          sku?: string
          updated_at?: string | null
          updated_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "parts_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "storage_locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "parts_manufacturer_id_fkey"
            columns: ["manufacturer_id"]
            isOneToOne: false
            referencedRelation: "manufacturers"
            referencedColumns: ["id"]
          },
        ]
      }
      product_grades: {
        Row: {
          description: string | null
          grade: string
          id: number
        }
        Insert: {
          description?: string | null
          grade: string
          id?: never
        }
        Update: {
          description?: string | null
          grade?: string
          id?: never
        }
        Relationships: []
      }
      purchase_order_devices: {
        Row: {
          cellular_device_id: string | null
          created_at: string | null
          created_by: string
          id: string
          purchase_order_id: string
          qc_completed: boolean
          qc_required: boolean
          repair_completed: boolean
          repair_required: boolean
          return_tag: boolean
          serial_device_id: string | null
          tray_id: string | null
          unit_confirmed: boolean
          updated_at: string | null
          updated_by: string
        }
        Insert: {
          cellular_device_id?: string | null
          created_at?: string | null
          created_by: string
          id?: string
          purchase_order_id: string
          qc_completed?: boolean
          qc_required?: boolean
          repair_completed?: boolean
          repair_required?: boolean
          return_tag?: boolean
          serial_device_id?: string | null
          tray_id?: string | null
          unit_confirmed?: boolean
          updated_at?: string | null
          updated_by: string
        }
        Update: {
          cellular_device_id?: string | null
          created_at?: string | null
          created_by?: string
          id?: string
          purchase_order_id?: string
          qc_completed?: boolean
          qc_required?: boolean
          repair_completed?: boolean
          repair_required?: boolean
          return_tag?: boolean
          serial_device_id?: string | null
          tray_id?: string | null
          unit_confirmed?: boolean
          updated_at?: string | null
          updated_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "purchase_order_devices_cellular_device_id_fkey"
            columns: ["cellular_device_id"]
            isOneToOne: false
            referencedRelation: "cellular_devices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_order_devices_purchase_order_id_fkey"
            columns: ["purchase_order_id"]
            isOneToOne: false
            referencedRelation: "purchase_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_order_devices_serial_device_id_fkey"
            columns: ["serial_device_id"]
            isOneToOne: false
            referencedRelation: "serial_devices"
            referencedColumns: ["id"]
          },
        ]
      }
      purchase_order_devices_planned: {
        Row: {
          color: string | null
          created_at: string | null
          device_type: string
          grade_id: number | null
          id: string
          manufacturer_id: string
          model_name: string
          purchase_order_id: string
          quantity: number
          storage_gb: number | null
          updated_at: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          device_type: string
          grade_id?: number | null
          id?: string
          manufacturer_id: string
          model_name: string
          purchase_order_id: string
          quantity?: number
          storage_gb?: number | null
          updated_at?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          device_type?: string
          grade_id?: number | null
          id?: string
          manufacturer_id?: string
          model_name?: string
          purchase_order_id?: string
          quantity?: number
          storage_gb?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "purchase_order_devices_planned_grade_id_fkey"
            columns: ["grade_id"]
            isOneToOne: false
            referencedRelation: "product_grades"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_order_devices_planned_manufacturer_id_fkey"
            columns: ["manufacturer_id"]
            isOneToOne: false
            referencedRelation: "manufacturers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_order_devices_planned_purchase_order_id_fkey"
            columns: ["purchase_order_id"]
            isOneToOne: false
            referencedRelation: "purchase_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      purchase_orders: {
        Row: {
          created_at: string | null
          created_by: string | null
          has_return_tag: boolean
          id: string
          notes: string | null
          order_date: string
          po_number: string
          priority: number | null
          purchase_return: boolean
          qc_completed: boolean
          repair_completed: boolean
          requires_qc: boolean
          requires_repair: boolean
          status: Database["public"]["Enums"]["order_status"]
          supplier_id: string
          unit_confirmed: boolean
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          has_return_tag?: boolean
          id?: string
          notes?: string | null
          order_date?: string
          po_number: string
          priority?: number | null
          purchase_return?: boolean
          qc_completed?: boolean
          repair_completed?: boolean
          requires_qc?: boolean
          requires_repair?: boolean
          status?: Database["public"]["Enums"]["order_status"]
          supplier_id: string
          unit_confirmed?: boolean
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          has_return_tag?: boolean
          id?: string
          notes?: string | null
          order_date?: string
          po_number?: string
          priority?: number | null
          purchase_return?: boolean
          qc_completed?: boolean
          repair_completed?: boolean
          requires_qc?: boolean
          requires_repair?: boolean
          status?: Database["public"]["Enums"]["order_status"]
          supplier_id?: string
          unit_confirmed?: boolean
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "purchase_orders_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      sales_order_devices: {
        Row: {
          cellular_device_id: string | null
          created_at: string | null
          id: string
          qc_comments: string | null
          qc_completed: boolean
          qc_required: boolean
          qc_status: string | null
          repair_completed: boolean
          repair_required: boolean
          sales_order_id: string
          serial_device_id: string | null
          updated_at: string | null
        }
        Insert: {
          cellular_device_id?: string | null
          created_at?: string | null
          id?: string
          qc_comments?: string | null
          qc_completed?: boolean
          qc_required?: boolean
          qc_status?: string | null
          repair_completed?: boolean
          repair_required?: boolean
          sales_order_id: string
          serial_device_id?: string | null
          updated_at?: string | null
        }
        Update: {
          cellular_device_id?: string | null
          created_at?: string | null
          id?: string
          qc_comments?: string | null
          qc_completed?: boolean
          qc_required?: boolean
          qc_status?: string | null
          repair_completed?: boolean
          repair_required?: boolean
          sales_order_id?: string
          serial_device_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sales_order_devices_cellular_device_id_fkey"
            columns: ["cellular_device_id"]
            isOneToOne: false
            referencedRelation: "cellular_devices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_order_devices_sales_order_id_fkey"
            columns: ["sales_order_id"]
            isOneToOne: false
            referencedRelation: "sales_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_order_devices_serial_device_id_fkey"
            columns: ["serial_device_id"]
            isOneToOne: false
            referencedRelation: "serial_devices"
            referencedColumns: ["id"]
          },
        ]
      }
      sales_orders: {
        Row: {
          created_at: string | null
          customer_id: string
          id: string
          notes: string | null
          order_date: string
          order_number: string
          priority: number | null
          shipping_carrier: string | null
          status: Database["public"]["Enums"]["order_status"]
          total_boxes: number | null
          total_pallets: number | null
          tracking_number: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          customer_id: string
          id?: string
          notes?: string | null
          order_date?: string
          order_number: string
          priority?: number | null
          shipping_carrier?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          total_boxes?: number | null
          total_pallets?: number | null
          tracking_number?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          customer_id?: string
          id?: string
          notes?: string | null
          order_date?: string
          order_number?: string
          priority?: number | null
          shipping_carrier?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          total_boxes?: number | null
          total_pallets?: number | null
          tracking_number?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sales_orders_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      serial_device_transactions: {
        Row: {
          created_at: string | null
          created_by: string
          device_id: string
          id: string
          new_status: Database["public"]["Enums"]["device_status"]
          notes: string | null
          previous_status: Database["public"]["Enums"]["device_status"] | null
          reference_id: string
          transaction_type: Database["public"]["Enums"]["transaction_type"]
        }
        Insert: {
          created_at?: string | null
          created_by: string
          device_id: string
          id?: string
          new_status: Database["public"]["Enums"]["device_status"]
          notes?: string | null
          previous_status?: Database["public"]["Enums"]["device_status"] | null
          reference_id: string
          transaction_type: Database["public"]["Enums"]["transaction_type"]
        }
        Update: {
          created_at?: string | null
          created_by?: string
          device_id?: string
          id?: string
          new_status?: Database["public"]["Enums"]["device_status"]
          notes?: string | null
          previous_status?: Database["public"]["Enums"]["device_status"] | null
          reference_id?: string
          transaction_type?: Database["public"]["Enums"]["transaction_type"]
        }
        Relationships: []
      }
      serial_devices: {
        Row: {
          color: string | null
          created_at: string | null
          created_by: string
          grade_id: number | null
          id: string
          location_id: string | null
          manufacturer_id: string
          model_name: string
          qc_comments: string | null
          qc_completed: boolean
          qc_required: boolean
          qc_status: string | null
          repair_completed: boolean
          repair_required: boolean
          serial_number: string
          status: Database["public"]["Enums"]["device_status"]
          supplier_id: string | null
          updated_at: string | null
          updated_by: string
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          created_by: string
          grade_id?: number | null
          id?: string
          location_id?: string | null
          manufacturer_id: string
          model_name: string
          qc_comments?: string | null
          qc_completed?: boolean
          qc_required?: boolean
          qc_status?: string | null
          repair_completed?: boolean
          repair_required?: boolean
          serial_number: string
          status?: Database["public"]["Enums"]["device_status"]
          supplier_id?: string | null
          updated_at?: string | null
          updated_by: string
        }
        Update: {
          color?: string | null
          created_at?: string | null
          created_by?: string
          grade_id?: number | null
          id?: string
          location_id?: string | null
          manufacturer_id?: string
          model_name?: string
          qc_comments?: string | null
          qc_completed?: boolean
          qc_required?: boolean
          qc_status?: string | null
          repair_completed?: boolean
          repair_required?: boolean
          serial_number?: string
          status?: Database["public"]["Enums"]["device_status"]
          supplier_id?: string | null
          updated_at?: string | null
          updated_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "serial_devices_grade_id_fkey"
            columns: ["grade_id"]
            isOneToOne: false
            referencedRelation: "product_grades"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "serial_devices_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "storage_locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "serial_devices_manufacturer_id_fkey"
            columns: ["manufacturer_id"]
            isOneToOne: false
            referencedRelation: "manufacturers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "serial_devices_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      storage_config: {
        Row: {
          created_at: string
          id: number
          storage_gb: number | null
        }
        Insert: {
          created_at?: string
          id?: number
          storage_gb?: number | null
        }
        Update: {
          created_at?: string
          id?: number
          storage_gb?: number | null
        }
        Relationships: []
      }
      storage_locations: {
        Row: {
          created_at: string | null
          created_by: string
          description: string | null
          id: string
          location_code: string
        }
        Insert: {
          created_at?: string | null
          created_by: string
          description?: string | null
          id?: string
          location_code: string
        }
        Update: {
          created_at?: string | null
          created_by?: string
          description?: string | null
          id?: string
          location_code?: string
        }
        Relationships: [
          {
            foreignKeyName: "storage_locations_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      suppliers: {
        Row: {
          address_line1: string | null
          address_line2: string | null
          city: string | null
          country: string | null
          created_at: string | null
          created_by: string | null
          email: string | null
          id: string
          name: string
          phone: string | null
          postcode: string | null
          supplier_code: string
          updated_at: string | null
          vat_number: string | null
        }
        Insert: {
          address_line1?: string | null
          address_line2?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          created_by?: string | null
          email?: string | null
          id?: string
          name: string
          phone?: string | null
          postcode?: string | null
          supplier_code: string
          updated_at?: string | null
          vat_number?: string | null
        }
        Update: {
          address_line1?: string | null
          address_line2?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          created_by?: string | null
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          postcode?: string | null
          supplier_code?: string
          updated_at?: string | null
          vat_number?: string | null
        }
        Relationships: []
      }
      tac_codes: {
        Row: {
          available_colors: string[] | null
          created_at: string | null
          id: string
          manufacturer: string
          manufacturer_id: string | null
          model_name: string
          model_no: string | null
          storage_options: string[] | null
          tac_code: string
          updated_at: string | null
        }
        Insert: {
          available_colors?: string[] | null
          created_at?: string | null
          id?: string
          manufacturer: string
          manufacturer_id?: string | null
          model_name: string
          model_no?: string | null
          storage_options?: string[] | null
          tac_code: string
          updated_at?: string | null
        }
        Update: {
          available_colors?: string[] | null
          created_at?: string | null
          id?: string
          manufacturer?: string
          manufacturer_id?: string | null
          model_name?: string
          model_no?: string | null
          storage_options?: string[] | null
          tac_code?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string | null
          full_name: string
          id: string
          old_user_id: number | null
          phone: string | null
          role: string
          updated_at: string | null
          user_email: string | null
        }
        Insert: {
          created_at?: string | null
          full_name: string
          id?: string
          old_user_id?: number | null
          phone?: string | null
          role?: string
          updated_at?: string | null
          user_email?: string | null
        }
        Update: {
          created_at?: string | null
          full_name?: string
          id?: string
          old_user_id?: number | null
          phone?: string | null
          role?: string
          updated_at?: string | null
          user_email?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_devices_to_sales_order: {
        Args:
          | { p_sales_order_id: string; p_device_ids: string[] }
          | {
              p_sales_order_id: string
              p_device_ids: string[]
              p_user_id: string
            }
        Returns: undefined
      }
      begin_transaction: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      commit_transaction: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      fn_book_device_with_supplier: {
        Args: {
          device_id: string
          device_type: string
          supplier_id: string
          user_id: string
        }
        Returns: undefined
      }
      fn_create_accessory_transaction: {
        Args: {
          accessory_id: string
          trans_type: Database["public"]["Enums"]["transaction_type"]
          ref_id: string
          qty: number
          prev_qty: number
          new_qty: number
          notes: string
          user_id: string
        }
        Returns: string
      }
      fn_create_cellular_transaction: {
        Args: {
          device_id: string
          trans_type: Database["public"]["Enums"]["transaction_type"]
          ref_id: string
          prev_status: Database["public"]["Enums"]["device_status"]
          new_status: Database["public"]["Enums"]["device_status"]
          notes: string
          user_id: string
        }
        Returns: string
      }
      fn_create_part_transaction: {
        Args: {
          part_id: string
          trans_type: Database["public"]["Enums"]["transaction_type"]
          ref_id: string
          qty: number
          prev_qty: number
          new_qty: number
          notes: string
          user_id: string
        }
        Returns: string
      }
      fn_create_serial_transaction: {
        Args: {
          device_id: string
          trans_type: Database["public"]["Enums"]["transaction_type"]
          ref_id: string
          prev_status: Database["public"]["Enums"]["device_status"]
          new_status: Database["public"]["Enums"]["device_status"]
          notes: string
          user_id: string
        }
        Returns: string
      }
      fn_search_models_by_manufacturer: {
        Args: { p_manufacturer: string; p_search?: string }
        Returns: {
          model_name: string
        }[]
      }
      fn_search_models_by_manufacturer_name: {
        Args: { p_manufacturer_name: string; p_search?: string }
        Returns: {
          model_name: string
        }[]
      }
      fn_split_to_array: {
        Args: { p_string: string }
        Returns: string[]
      }
      get_cellular_device_details: {
        Args: { device_id: string }
        Returns: {
          imei: string
          manufacturer: string
          model_name: string
        }[]
      }
      get_device_details_by_tac: {
        Args: { tac_code: string }
        Returns: {
          manufacturer: string
          model_name: string
          model_no: string
        }[]
      }
      rollback_transaction: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      test_get_cellular_device_details: {
        Args: { test_id: string }
        Returns: string
      }
    }
    Enums: {
      device_status:
        | "in_stock"
        | "sold"
        | "returned"
        | "quarantine"
        | "repair"
        | "qc_required"
        | "qc_failed"
        | "allocated"
      order_status:
        | "draft"
        | "pending"
        | "processing"
        | "confirmed"
        | "complete"
        | "cancelled"
      Priority: "Lowest" | "Low" | "Medium" | "High" | "Urgent"
      transaction_type:
        | "purchase"
        | "sale"
        | "return_in"
        | "return_out"
        | "repair"
        | "qc"
        | "transfer"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

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

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
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

export const Constants = {
  public: {
    Enums: {
      device_status: [
        "in_stock",
        "sold",
        "returned",
        "quarantine",
        "repair",
        "qc_required",
        "qc_failed",
        "allocated",
      ],
      order_status: [
        "draft",
        "pending",
        "processing",
        "confirmed",
        "complete",
        "cancelled",
      ],
      Priority: ["Lowest", "Low", "Medium", "High", "Urgent"],
      transaction_type: [
        "purchase",
        "sale",
        "return_in",
        "return_out",
        "repair",
        "qc",
        "transfer",
      ],
    },
  },
} as const
