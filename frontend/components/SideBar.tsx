'use client';
import { useAppDispatch, useAppSelector } from '@/libs/redux';
import { toggleSideBar } from '@/libs/redux/slicePages';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaHome, FaChartBar, FaTimes, FaBars } from 'react-icons/fa';

const MenuItem = ({
  icon,
  route,
}: {
  icon: React.ReactNode;
  route: string;
}) => {
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const colorClass =
    pathname === route
      ? 'bg-blue-500 text-white rounded-md'
      : 'text-slate-500 hover:bg-blue-700 hover:text-white rounded-md';
  return (
    <Link
      href={route}
      onClick={() => dispatch(toggleSideBar())}
      className={`text-md flex items-center gap-1 border-b-[1px] border-b-white/10 px-3 py-3 [&>*]:my-auto ${colorClass}`}
    >
      <div className="flex w-[24px] text-xl [&>*]:mx-auto">{icon}</div>
    </Link>
  );
};

// Overlay to prevent clicks in background, also serves as our close button
const ModalOverlay = () => {
  const dispatch = useAppDispatch();
  return (
    <div
      className={`fixed bottom-0 left-0 right-0 top-0 z-30 flex h-screen w-screen bg-black/50 md:hidden`}
      onClick={() => {
        dispatch(toggleSideBar());
      }}
    />
  );
};

export const SideBar = () => {
  const { showSideBar } = useAppSelector((state) => state.page);
  const dispatch = useAppDispatch();
  const className =
    'bg-white transition-[margin-left] ease-in-out duration-500 fixed md:static top-0 bottom-0 left-0 z-40 p-4 w-fit';
  const activeClass = showSideBar ? ' ml-0' : ' ml-[-250px] md:ml-0';

  return (
    <>
      <button
        className="fixed left-0 top-0 z-40 ml-4 mt-4 rounded-full bg-white p-2 shadow-sm md:hidden"
        onClick={() => {
          dispatch(toggleSideBar());
        }}
      >
        <div className="text-md text-slate-500">
          {showSideBar ? <FaTimes /> : <FaBars />}
        </div>
      </button>
      <div className={`${className}${activeClass}`}>
        <div className="flex flex-col items-center gap-3">
          <MenuItem route="/" icon={<FaHome />} />
          <MenuItem route="/charts" icon={<FaChartBar />} />
        </div>
      </div>
      {showSideBar ? <ModalOverlay /> : <></>}
    </>
  );
};
