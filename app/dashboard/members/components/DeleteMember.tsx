'use client';

import { Button } from '@/components/ui/button';
import { TrashIcon } from '@radix-ui/react-icons';
import { deleteMemberById } from '../actions';
import { useTransition } from 'react';
import { toast } from '@/components/ui/use-toast';

const DeleteMember = ({ user_id }: { user_id: string }) => {
  const [isPending, startTransition] = useTransition();
  const onSubmit = async () => {
    startTransition(async () => {
      const result = await deleteMemberById(user_id);
      const parsedResult = result ? JSON.parse(result) : null;
      const { error } = parsedResult || {};

      if (error) {
        toast({
          title: 'Fail to delete',
          description: (
            <pre className='mt-2 w-[340px] rounded-md bg-slate-950 p-4'>
              <code className='text-white'>{error.message}</code>
            </pre>
          ),
        });
      } else {
        toast({
          title: 'Successfully delete 🎉',
        });
      }
    });
  };

  return (
    <form action={onSubmit}>
      <Button variant='outline' className='gap-2'>
        <TrashIcon />
        Delete
      </Button>
    </form>
  );
};

export default DeleteMember;
