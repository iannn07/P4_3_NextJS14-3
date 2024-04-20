import React from 'react';
import MemberTable from './components/MemberTable';
import SearchMembers from './components/SearchMembers';
import CreateMember from './components/create/CreateMember';
import useUserStore from '@/lib/store/user';
import { readUserSession } from '@/lib/actions';

export default async function Members() {
  // This method is faster rather than using Zustand yk
  const { data: userSession } = await readUserSession();

  // const user = useUserStore.getState().user;
  const user = userSession.session?.user;
  const isAdmin =
    user?.user_metadata.role === 'admin' || user?.email === 'admin@gmail.com';

  return (
    <div className='space-y-5 w-full overflow-y-auto px-3'>
      <h1 className='text-3xl font-bold'>Members</h1>
      {isAdmin && (
        <div className='flex gap-2'>
          <SearchMembers />
          <CreateMember />
        </div>
      )}
      <MemberTable />
    </div>
  );
}
