'use server';

import { readUserSession } from '@/lib/actions';
import {
  createSupabaseAdmin,
  createSupabaseServerClient,
} from '@/lib/supabase';
import { revalidatePath, unstable_noStore } from 'next/cache';

export async function createMember(data: {
  email: string;
  password: string;
  name: string;
  role: 'user' | 'admin';
  status: 'active' | 'resigned';
  confirm: string;
}) {
  const { data: userSession } = await readUserSession();

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
      email: data.email,
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

    console.log('Status:', { member, permission });

    revalidatePath('/dashboard/members');

    return JSON.stringify({ member, permission });
  } catch (error) {
    return JSON.stringify(error);
  }
}

export async function updateBasicMemberById(
  id: string,
  data: { name: string }
) {
  try {
    console.log(data);
    const supabase = await createSupabaseServerClient();

    const result = await supabase
      .from('members')
      .update({ name: data.name })
      .eq('id', id)
      .single();

    console.log(result);

    revalidatePath('/dashboard/members');

    return JSON.stringify(result);
  } catch (error) {
    return JSON.stringify(error);
  }
}

export async function updateAccountMemberById(
  user_id: string,
  data: {
    email: string;
    password?: string | undefined;
    confirm?: string | undefined;
  }
) {
  const { data: userSession } = await readUserSession();

  if (userSession.session?.user.user_metadata.role !== 'admin') {
    return JSON.stringify({ error: 'Unauthorized' });
  }

  try {
    console.log({ data });
    // Update Supabase User Metadata
    const supabaseAdmin = await createSupabaseAdmin();

    const userData: {
      email: string;
      password?: string | undefined;
      email_confirm: boolean;
    } = {
      email: data.email,
      email_confirm: true,
    };

    if (data.password) {
      userData.password = data.password;
    }

    const result = await supabaseAdmin.auth.admin.updateUserById(user_id, {
      ...userData,
    });

    // Update Supabase Member Data
    const supabase = await createSupabaseServerClient();

    const dbResult = await supabase
      .from('members')
      .update({ email: data.email })
      .eq('id', user_id)
      .single();

    console.log({ result, dbResult });

    revalidatePath('/dashboard/members');

    return JSON.stringify(dbResult);
  } catch (error) {
    return JSON.stringify(error);
  }
}

export async function updateAdvancedMemberById(
  id: string,
  user_id: string,
  data: { role: 'user' | 'admin'; status: 'active' | 'resigned' }
) {
  const { data: userSession } = await readUserSession();

  if (userSession.session?.user.user_metadata.role !== 'admin') {
    return JSON.stringify({ error: 'Unauthorized' });
  }

  try {
    console.log({ data });
    // Update Supabase User Metadata
    const supabaseAdmin = await createSupabaseAdmin();

    const result = await supabaseAdmin.auth.admin.updateUserById(user_id, {
      user_metadata: {
        role: data.role,
      },
    });

    // Update Supabase Member Data
    const supabase = await createSupabaseServerClient();

    const dbResult = await supabase
      .from('permission')
      .update({ role: data.role, status: data.status })
      .eq('id', id)
      .single();

    console.log({ result, dbResult });

    revalidatePath('/dashboard/members');

    return JSON.stringify(dbResult);
  } catch (error) {
    return JSON.stringify(error);
  }
}

export async function deleteMemberById(user_id: string) {
  const { data: userSession } = await readUserSession();

  if (userSession.session?.user.user_metadata.role !== 'admin') {
    return JSON.stringify({ error: 'Unauthorized' });
  }

  try {
    const supabase = await createSupabaseAdmin();
    const deleteResult = await supabase.auth.admin.deleteUser(user_id);

    const { data: memberData } = await supabase
      .from('members')
      .delete()
      .eq('id', user_id)
      .single();

    console.log({ deleteResult, memberData });

    revalidatePath('/dashboard/members');

    return JSON.stringify(memberData);
  } catch (error) {
    return JSON.stringify(error);
  }
}

export async function readMembers() {
  unstable_noStore();
  const supabase = await createSupabaseServerClient();
  const result = await supabase.from('permission').select('*, members(*)');

  return result;
}
