export type Permission = {
  id: string;
  created_at: string;
  role: 'admin' | 'user';
  status: 'active' | 'resigned';
  member_id: string;
  members: {
    id: string;
    created_at: string;
    name: string;
    email: string;
  };
};
