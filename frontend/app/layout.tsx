'use client';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { SideBar } from '@/components';
import { Provider } from 'react-redux';
import { store } from '@/libs/redux/store';
import { useAppDispatch } from '@/libs/redux';
import { toggleSideBar } from '@/libs/redux/slicePages';

const inter = Inter({ subsets: ['latin'] });

const metadata: Metadata = {
  title: 'GT Map',
  description: 'Daily tracking map',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={[inter.className, 'min-h-screen'].join(' ')}>
        <Provider store={store}>
          <div className="flex flex-row">
            <SideBar />
            <div className="flex min-h-screen w-screen flex-grow flex-col md:w-full">
              {children}
            </div>
          </div>
        </Provider>
      </body>
    </html>
  );
}
