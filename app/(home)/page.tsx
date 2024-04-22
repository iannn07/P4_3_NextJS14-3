import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

export default function Home() {
  return (
    <div className='flex flex-col justify-center items-center h-screen'>
      <Image
        src='/Home.png'
        alt='Next.js Logo'
        className='mb-10 rounded-xl'
        width={800}
        height={800}
        priority
      />
      <Link href='/auth'>Click here to the app</Link>
    </div>
  );
}
