'use client';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { SideBar } from '@/components/SideBar';
import { Provider } from 'react-redux';
import { store } from '@/libs/redux/store';
import { useAppDispatch, useAppSelector } from '@/libs/redux';
import { toggleSideBar } from '@/libs/redux/slicePages';
import { Details } from '@/components/Details';

const inter = Inter({ subsets: ['latin'] });

const metadata: Metadata = {
  title: 'GT Map',
  description: 'Daily tracking map',
};

const ContentWithDetails = ({ children }: { children: React.ReactNode }) => {
  const showDetails = useAppSelector((state) => state.page.showDetails);
  const childrenClass = showDetails
    ? 'w-[calc(100%-526px-75px)]'
    : 'w-[calc(100%-75px)]';

  return (
    <div className="flex min-h-screen w-screen flex-grow flex-row md:w-full">
      <div className={`${childrenClass} flex-grow`}>{children}</div>
      {showDetails && <Details />}
    </div>
  );
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
            <ContentWithDetails>{children}</ContentWithDetails>
          </div>
        </Provider>
      </body>
    </html>
  );
}
