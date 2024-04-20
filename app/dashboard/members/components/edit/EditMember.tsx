import React from 'react';
import DialogForm from '../DialogForm';
import { Button } from '@/components/ui/button';
import { Pencil1Icon } from '@radix-ui/react-icons';
import EditForm from './EditorForm';
import { Permission } from '@/lib/types';

export default function EditMember({
  isAdmin,
  permission,
}: {
  isAdmin: boolean;
  permission: Permission;
}) {
  return (
    <DialogForm
      id='update-trigger'
      title='Edit Member'
      Trigger={
        <Button variant='outline' className='gap-2'>
          <Pencil1Icon />
          Edit
        </Button>
      }
      form={<EditForm isAdmin={isAdmin} permission={permission} />}
    />
  );
}
