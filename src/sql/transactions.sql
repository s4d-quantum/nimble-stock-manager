

-- This file contains SQL that should be executed in the Supabase SQL Editor.
-- These functions help with transaction management from the client.

-- Function to add devices to a sales order with proper transaction handling
CREATE OR REPLACE FUNCTION add_devices_to_sales_order(
  p_sales_order_id UUID,
  p_device_ids UUID[]
)
RETURNS VOID AS $$
DECLARE
  device_id UUID;
BEGIN
  -- Start a transaction
  BEGIN
    -- Loop through each device ID provided
    FOREACH device_id IN ARRAY p_device_ids
    LOOP
      -- Add to sales_order_devices
      INSERT INTO sales_order_devices (
        sales_order_id, 
        cellular_device_id
      )
      VALUES (
        p_sales_order_id, 
        device_id
      );

      -- Update the status of the device in cellular_devices
      UPDATE cellular_devices
      SET 
        status = 'sold',
        updated_at = NOW() 
      WHERE id = device_id;
    END LOOP;

    -- Optionally: Update device count on sales_order
    -- This could be done via a trigger as well
    
  EXCEPTION
    WHEN OTHERS THEN
      -- Rollback the transaction in case of any error
      RAISE;
  END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

