'use client';
import { useAppDispatch, useAppSelector } from '@/libs/redux';
import { setShowDetails } from '@/libs/redux/slicePages';
import React, { useState, useRef } from 'react';
import { FaTimes, FaChevronRight } from 'react-icons/fa';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const Details = () => {
  const dispatch = useAppDispatch();
  const { showDetails, district } = useAppSelector((state) => state.page);
  const className =
    'bg-white transition-[margin-right] ease-in-out duration-500 fixed md:static top-0 bottom-0 right-0 z-40 p-4 w-[526px] text-black';
  const appendClass = showDetails ? ' mr-0' : ' mr-[-250px]';
  return (
    <div className={`${className}${appendClass}`}>
      <div className="flex flex-col">
        <div className="mb-6 flex justify-between">
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
        <h3 className="text-lg font-bold uppercase">Air Quality</h3>
        <div className="flex flex-col rounded-md bg-green-500 p-4 text-white">
          <div className="flex items-end justify-center align-bottom">
            <h4 className="text-7xl font-semibold">
              50<span className="text-xl font-light">AQI</span>
            </h4>
          </div>
          <div className="ml-4 flex flex-row items-center justify-around rounded-md bg-white p-2 text-green-700">
            <p className="text-base font-semibold">PM2.5</p>
            <p className="text-base">11.9µg/m³</p>
          </div>
        </div>
        <Tabs defaultValue="airq" className="">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="airq">Air Quality</TabsTrigger>
            <TabsTrigger value="traffic">Traffic</TabsTrigger>
          </TabsList>
          <TabsContent value="airq">AIRQ CHART</TabsContent>
          <TabsContent value="traffic">TRAFFIC CHART</TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
