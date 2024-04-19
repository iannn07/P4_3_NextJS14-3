'use server';

import { readUserSession } from '@/lib/actions';
import { createSupabaseAdmin } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

export async function createMember(data: {
  email: string;
  password: string;
  name: string;
  role: 'user' | 'admin';
  status: 'active' | 'resigned';
  confirm: string;
}) {
  const {data: userSession} = await readUserSession();

  if (userSession.session?.user.user_metadata.role !== 'admin') {
    return JSON.stringify({ error: 'Unauthorized' });
  }

  try {
    const supabase = await createSupabaseAdmin();
    
    const result = await supabase.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: true,
      user_metadata: {
        role: data.role,
      },
    });

    const memberData = {
      name: data.name,
      id: result.data.user?.id,
    };

    const permissionData = {
      role: data.role,
      member_id: result.data.user?.id,
      status: data.status,
    };

    const [member, permission] = await Promise.all([
      await supabase.from('members').insert(memberData),
      await supabase.from('permission').insert(permissionData),
    ]);

    console.log(member, permission);

    revalidatePath('/dashboard/members');

    return JSON.stringify({ member, permission });
  } catch (error) {
    return JSON.stringify(error);
  }
}
export async function updateMemberById(id: string) {
  console.log('update member');
}
export async function deleteMemberById(id: string) {}
export async function readMembers() {}
