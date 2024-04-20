import { User } from '@supabase/supabase-js';
import { create } from 'zustand';

interface UserSessionState {
  user: User | null;
}

const useUserStore = create<UserSessionState>()((set) => ({
  user: null,
}));

export default useUserStore;
