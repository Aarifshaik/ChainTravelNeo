import { supabase } from "./supabase";



//insert location data
type InsertLocationResult = {
    success: boolean;
    data?: any;
    error?: any;
};


export async function insertLocationData(
  vehicleId: string | null,
  latitude: number,
  longitude: number,
  accuracy: number | null = null,
  speed: number | null = null,
  heading: number | null = null
  ): Promise<InsertLocationResult> {
  try {
    const { data, error } = await supabase.from('location_tracking').insert([
      {
        vehicle_id: vehicleId,
        latitude: latitude,
        longitude: longitude,
        accuracy: accuracy,
        speed: speed,
        heading: heading,
      },
    ]);

    if (error) {
      console.error('Error inserting location data:', error);
      return { success: false, error };
    }

    console.log('Location data inserted successfully:', data);
    return { success: true, data };
  } catch (err) {
    console.error('Unexpected error:', err);
    return { success: false, error: err };
  }
}



  //fetch location data


type FetchLocationResult = {
  success: boolean;
  data?: any;
  error?: any;
};

export async function fetchLocationData(
  vehicleId: string | null,
  limit: number = 10 // Limit number of records fetched (default is 10)
): Promise<FetchLocationResult> {
  try {
    const { data, error } = await supabase
      .from('location_tracking')
      .select('*')
      .eq('vehicle_id', vehicleId) // Filter by vehicle_id
      .order('timestamp', { ascending: false }) // Order by timestamp (most recent first)
      .limit(limit); // Limit the number of records fetched

    if (error) {
      console.error('Error fetching location data:', error);
      return { success: false, error };
    }

    console.log('Location data fetched successfully:', data);
    return { success: true, data };
  } catch (err) {
    console.error('Unexpected error:', err);
    return { success: false, error: err };
  }
}




//update location data


type UpdateLocationResult = {
  success: boolean;
  data?: any;
  error?: any;
};

export async function updateLocationData(
  locationId: number, // The row ID of the location to be updated
  vehicleId: string | null,
  latitude: number,
  longitude: number,
  accuracy: number | null = null,
  speed: number | null = null,
  heading: number | null = null
): Promise<UpdateLocationResult> {
  try {
    const { data, error } = await supabase
      .from('location_tracking')
      .update({
        vehicle_id: vehicleId,
        latitude: latitude,
        longitude: longitude,
        accuracy: accuracy,
        speed: speed,
        heading: heading,
      })
      .eq('id', locationId); // Filter by the specific row ID

    if (error) {
      console.error('Error updating location data:', error);
      return { success: false, error };
    }

    console.log('Location data updated successfully:', data);
    return { success: true, data };
  } catch (err) {
    console.error('Unexpected error:', err);
    return { success: false, error: err };
  }
}