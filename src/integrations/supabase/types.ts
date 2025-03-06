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
        Relationships: [
          {
            foreignKeyName: "accessories_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "accessories_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "storage_locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "accessories_manufacturer_id_fkey"
            columns: ["manufacturer_id"]
            isOneToOne: false
            referencedRelation: "manufacturers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "accessories_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
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
        Relationships: [
          {
            foreignKeyName: "accessory_transactions_accessory_id_fkey"
            columns: ["accessory_id"]
            isOneToOne: false
            referencedRelation: "accessories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "accessory_transactions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      cellular_device_transactions: {
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
        Relationships: [
          {
            foreignKeyName: "cellular_device_transactions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      cellular_devices: {
        Row: {
          color: string | null
          created_at: string | null
          created_by: string
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
          updated_by: string
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          created_by: string
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
          updated_by: string
        }
        Update: {
          color?: string | null
          created_at?: string | null
          created_by?: string
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
          updated_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "cellular_devices_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
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
          {
            foreignKeyName: "cellular_devices_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "users"
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
        Relationships: [
          {
            foreignKeyName: "customers_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
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
        Relationships: [
          {
            foreignKeyName: "part_transactions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "part_transactions_part_id_fkey"
            columns: ["part_id"]
            isOneToOne: false
            referencedRelation: "parts"
            referencedColumns: ["id"]
          },
        ]
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
            foreignKeyName: "parts_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
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
          {
            foreignKeyName: "parts_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "users"
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
            foreignKeyName: "purchase_order_devices_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
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
          {
            foreignKeyName: "purchase_order_devices_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      purchase_order_devices_planned: {
        Row: {
          color: string | null
          created_at: string | null
          created_by: string
          device_type: string
          grade_id: number | null
          id: string
          manufacturer_id: string
          model_name: string
          purchase_order_id: string
          quantity: number
          storage_gb: number | null
          updated_at: string | null
          updated_by: string
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          created_by: string
          device_type: string
          grade_id?: number | null
          id?: string
          manufacturer_id: string
          model_name: string
          purchase_order_id: string
          quantity?: number
          storage_gb?: number | null
          updated_at?: string | null
          updated_by: string
        }
        Update: {
          color?: string | null
          created_at?: string | null
          created_by?: string
          device_type?: string
          grade_id?: number | null
          id?: string
          manufacturer_id?: string
          model_name?: string
          purchase_order_id?: string
          quantity?: number
          storage_gb?: number | null
          updated_at?: string | null
          updated_by?: string
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
          created_by: string
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
          updated_by: string
        }
        Insert: {
          cellular_device_id?: string | null
          created_at?: string | null
          created_by: string
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
          updated_by: string
        }
        Update: {
          cellular_device_id?: string | null
          created_at?: string | null
          created_by?: string
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
          updated_by?: string
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
            foreignKeyName: "sales_order_devices_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
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
          {
            foreignKeyName: "sales_order_devices_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      sales_orders: {
        Row: {
          created_at: string | null
          created_by: string
          customer_id: string
          id: string
          notes: string | null
          order_date: string
          order_number: string
          shipping_carrier: string | null
          status: Database["public"]["Enums"]["order_status"]
          total_boxes: number | null
          total_pallets: number | null
          tracking_number: string | null
          updated_at: string | null
          updated_by: string
        }
        Insert: {
          created_at?: string | null
          created_by: string
          customer_id: string
          id?: string
          notes?: string | null
          order_date?: string
          order_number: string
          shipping_carrier?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          total_boxes?: number | null
          total_pallets?: number | null
          tracking_number?: string | null
          updated_at?: string | null
          updated_by: string
        }
        Update: {
          created_at?: string | null
          created_by?: string
          customer_id?: string
          id?: string
          notes?: string | null
          order_date?: string
          order_number?: string
          shipping_carrier?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          total_boxes?: number | null
          total_pallets?: number | null
          tracking_number?: string | null
          updated_at?: string | null
          updated_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "sales_orders_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_orders_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_orders_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "users"
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
        Relationships: [
          {
            foreignKeyName: "serial_device_transactions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "serial_device_transactions_device_id_fkey"
            columns: ["device_id"]
            isOneToOne: false
            referencedRelation: "serial_devices"
            referencedColumns: ["id"]
          },
        ]
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
            foreignKeyName: "serial_devices_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
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
          {
            foreignKeyName: "serial_devices_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
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
        Relationships: [
          {
            foreignKeyName: "suppliers_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
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
        Args: {
          p_manufacturer_id: string
          p_search?: string
        }
        Returns: {
          model_name: string
        }[]
      }
      fn_split_to_array: {
        Args: {
          p_string: string
        }
        Returns: string[]
      }
      get_cellular_device_details: {
        Args: {
          device_id: string
        }
        Returns: {
          imei: string
          manufacturer: string
          model_name: string
        }[]
      }
      get_device_details_by_tac: {
        Args: {
          tac_code: string
        }
        Returns: {
          manufacturer: string
          model_name: string
          model_no: string
        }[]
      }
      test_get_cellular_device_details: {
        Args: {
          test_id: string
        }
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
      order_status:
        | "draft"
        | "pending"
        | "processing"
        | "confirmed"
        | "complete"
        | "cancelled"
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
