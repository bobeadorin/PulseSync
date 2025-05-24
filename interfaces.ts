export interface PacientSession {
  id: number; // int8
  userId: string; // uuid as string
  created_at: string; // timestamptz as ISO string
  name: string; // text
  age: number; // int2 (smallint)
  session_data: any; // jsonb — you can specify a more precise type if you want
  session_start_time: string; // timestamptz or time with timezone as ISO string
  session_end_time: string; // timestamptz or time with timezone as ISO string
}
