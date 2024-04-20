import React from 'react';
import DialogForm from '../DialogForm';
import { Button } from '@/components/ui/button';
import { Pencil1Icon } from '@radix-ui/react-icons';
import EditForm from './EditorForm';

export default function EditMember({ isAdmin }: { isAdmin: boolean }) {
  return (
    <DialogForm
      id='update-trigger'
      title='Edit Member'
      Trigger={
        <Button variant='outline'>
          <Pencil1Icon />
          Edit
        </Button>
      }
      form={<EditForm isAdmin={isAdmin} />}
    />
  );
}
