import React from 'react';
import NavLinks from './NavLinks';

import { cn } from '@/lib/utils';
import ModeToggle from '../todo/components/ToggleDarkMode';
import { Button } from '@/components/ui/button';
import SignOut from './SignOut';
import Link from 'next/link';
import { readUserSession } from '@/lib/actions';

export default async function SideNav({ email }: { email?: string }) {
  const { data: userSession } = await readUserSession();
  const user = userSession.session?.user;
  const isAdmin =
    user?.user_metadata.role === 'admin' || user?.email === 'admin@gmail.com';

  return (
    <SideBar
      className=' hidden lg:block dark:bg-graident-dark flex-1'
      email={email!}
      isAdmin={isAdmin}
    />
  );
}

export const SideBar = ({
  className,
  email,
  isAdmin,
}: {
  className?: string;
  email?: string;
  isAdmin?: boolean;
}) => {
  return (
    <div className={className}>
      <div
        className={cn(
          'h-full w-full lg:w-96 lg:p-10 space-y-5 lg:border-r flex flex-col '
        )}
      >
        <div className='flex-1 space-y-5'>
          <div className='flex items-center gap-2 flex-1'>
            <Link href={'/dashboard'}>
              <h1 className='text-3xl font-bold'>Daily Todo</h1>
            </Link>

            <ModeToggle />
          </div>
          <div>
            <h1>
              You are logged in as <b>{email}</b>
            </h1>
          </div>
          <NavLinks isAdmin={isAdmin} />
        </div>
        <div className=''>
          <SignOut />
        </div>
      </div>
    </div>
  );
};
