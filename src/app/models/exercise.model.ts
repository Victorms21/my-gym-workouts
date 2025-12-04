/**
 * Represents an exercise from the exercises catalog
 */
export interface Exercise {
  id: string;
  name: string;
  description?: string;
  muscle_group?: string;
  equipment?: string;
  instructions?: string;
  image_url?: string;
  created_at?: string;
  updated_at?: string;
}
