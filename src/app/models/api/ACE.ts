export enum AceType {
  group= "group",
  user = "user"
}


export interface ACE {
  ace_id: string;
  ace_type: AceType;
  path: string;
  propagate: boolean;
  allowed: boolean;
  user_id?: string;
  group_id?: string;
  role_id: string;
  created_at: string;
  updated_at: string;
}
