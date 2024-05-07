'use client';
import { Button, Drawer, Layout, Menu } from 'antd';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { FaHome, FaChartBar } from 'react-icons/fa';
import { MenuOutlined } from '@ant-design/icons';
import './SideBar.css';

const menuItems = [
  {
    key: 'home',
    label: (
      <Link href="/">
        Home
      </Link>
    ),
    icon: <FaHome />,
  },
  {
    key: 'chart',
    label: (
      <Link href="/chart">
        Charts
      </Link>
    ),
    icon: <FaChartBar />
  },
];

const CustomMenu = ({ mode }: { mode: 'horizontal' | 'inline' }) => {
  const pathname = usePathname();
  return (
    <Menu mode={mode} selectedKeys={[pathname == '/' ? 'home' : pathname.replace('/', '')]} items={menuItems}/>
  );
};

export const SideBar = () => {
  const [visible, setVisible] = useState(false);
  const showSideBar = () => {
    setVisible(!visible);
  };

  return (
    <Layout.Header className="nav-header" style={{ backgroundColor: 'white' }}>
      <div className="logo">
        <h3 className="brand-font">Brand Here</h3>
      </div>
      <div className="navbar-menu">
        <div className="leftMenu">
          <CustomMenu mode="horizontal" />
        </div>
        <Button className="menuButton" type="text" onClick={showSideBar}>
          <MenuOutlined />
        </Button>

        <Drawer
          title="Brand Here"
          placement="left"
          closable={true}
          onClose={showSideBar}
          open={visible} // Replace 'visible' with 'open'
          style={{ zIndex: 1000 }}
        >
          <CustomMenu mode="inline" />
        </Drawer>
      </div>
    </Layout.Header>
  );
};
