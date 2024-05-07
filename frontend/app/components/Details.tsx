'use client';
import { useAppDispatch, useAppSelector, setShowDetails } from '@/lib/redux';
import React, { useState, useRef } from 'react';
import { FaTimes, FaChevronRight } from 'react-icons/fa';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tabs, TabsProps, theme } from 'antd';
import StickyBox from 'react-sticky-box';
import Image from 'next/image';
import { AirQuality } from './AirQuality';
import { Weather } from './Weather';

const CustomTabPane: React.FC<{ key: string; children: React.ReactNode }> = ({
  key,
  children,
}) => {
  return (
    <div key={key} className="flex flex-col gap-4">
      {children}
    </div>
  );
};

const tabsItems = [
  {
    key: 'airq',
    label: 'Air Quality',
    children: (
      <CustomTabPane key="airq">
          <AirQuality />
          <Weather />
      </CustomTabPane>
    ),
  },
  {
    key: 'traffic',
    label: 'Traffic',
    children: (
      <CustomTabPane key="traffic">
        <div className="flex flex-col items-center">
          <Image
            src="https://images.unsplash.com/photo-1579353977828-2a4eab540b9a"
            width={400}
            height={200}
            quality={80}
            sizes="(max-width: 500px) 100vw, 500px"
            style={{ objectFit: 'cover' }}
            className="rounded-md"
            alt="camera image"
          />
        </div>
      </CustomTabPane>
    ),
  },
];

const CustomTabBar: TabsProps['renderTabBar'] = (props, DefaultTabBar) => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  return (
    <StickyBox offsetTop={64} offsetBottom={20} style={{ zIndex: 10 }}>
      <DefaultTabBar
        {...props}
        style={{ background: colorBgContainer }}
        className="inline-flex items-center justify-between whitespace-nowrap rounded-sm px-3 py-1.5 text-md ring-offset-background transition-all ease-in-out duration-300 ring-offset-2 ring-offset-opacity-50 ring-offset-solid ring-offset-opacity-50 ring-offset-solid uppercase font-bold"
      />
    </StickyBox>
  );
};

export const Details = () => {
  const dispatch = useAppDispatch();
  const { showDetails, district } = useAppSelector((state) => state.page);
  const className =
    'bg-white transition-[margin-right] ease-in-out duration-500 fixed md:static top-0 bottom-0 right-0 z-40 p-4 w-full sm:w-[526px] text-black';
  const appendClass = showDetails ? ' mr-0' : ' mr-[-250px]';
  return (
    <div className={`${className}${appendClass}`}>
      <div className="flex flex-col">
        <div className="flex justify-between">
          {/* dummy div to center the text */}
          <div></div>
          <div className="flex flex-col items-center justify-center">
            <h2 className="text-lg font-bold">{district}</h2>
            <p className="text-xs leading-3">11:09PM, Th04 06 2024</p>
          </div>
          <button
            onClick={() => {
              dispatch(setShowDetails({ showDetails: false, district: null }));
            }}
            className="text-xl font-bold"
          >
            <FaChevronRight />
          </button>
        </div>

        <Tabs
          defaultActiveKey="airq"
          centered
          items={tabsItems}
          renderTabBar={CustomTabBar}
        />
      </div>
    </div>
  );
};
