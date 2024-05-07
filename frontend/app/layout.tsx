'use client';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Provider } from 'react-redux';
import { store } from '@/lib/redux/store';
import { useAppSelector } from '@/lib/redux';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { ConfigProvider, Layout, MenuProps } from 'antd';
import { Details } from '@/components/Details';
import { FaChartBar, FaHome } from 'react-icons/fa';
import { Suspense, useState } from 'react';
import { useRouter } from 'next/navigation';
import { SideBar } from '@/components/SideBar';
import { ErrorBoundary } from 'next/dist/client/components/error-boundary';
import CustomError from './error';
import Loading from './loading';

const { Header, Content, Footer } = Layout;

const inter = Inter({ subsets: ['latin'] });

const metadata: Metadata = {
  title: 'GT Map',
  description: 'Daily tracking map',
};

const ContentWithDetails = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  const showDetails = useAppSelector((state) => state.page.showDetails);
  const childrenClass = showDetails
    ? 'w-[calc(100%-526px-75px)]'
    : 'w-[calc(100%-75px)]';

  const [current, setCurrent] = useState('home');
  const router = useRouter();

  const onClick: MenuProps['onClick'] = ({ key }) => {
    setCurrent(key);
    if (key === 'home') router.push('/');
    else router.push(`/${key}`);
  };

  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: 'white' }}>
      <SideBar />
      <Content className="flex min-h-full flex-row md:w-full">
        <div className={`${childrenClass} flex-grow`}>{children}</div>
        {showDetails && <Details />}
      </Content>
    </Layout>
  );
};

type MenuItem = Required<MenuProps>['items'][number];

const items: MenuItem[] = [
  {
    label: 'Home',
    key: 'home',
    icon: <FaHome />,
  },
  {
    label: 'Chart',
    key: 'charts',
    icon: <FaChartBar />,
  },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={[inter.className, 'min-h-screen'].join(' ')}>
        <Suspense fallback={<Loading />}>
          <ConfigProvider
            theme={{
              token: {
                fontFamily: 'Montserrat, sans-serif',
              },
            }}
          >
            <ErrorBoundary errorComponent={CustomError}>
              <Provider store={store}>
                <AntdRegistry>
                  <ContentWithDetails>{children}</ContentWithDetails>
                </AntdRegistry>
              </Provider>
            </ErrorBoundary>
          </ConfigProvider>
        </Suspense>
      </body>
    </html>
  );
}
