export interface TodoItem {
  id: string;
  user_id: string;
  text: string;
  is_completed: boolean;
  created_at: string;
  sort_order?: number;
}
