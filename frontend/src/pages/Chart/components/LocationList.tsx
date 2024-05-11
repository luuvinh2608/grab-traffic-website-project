import { Pagination, Col, Row } from 'antd'
import { useEffect, useState } from 'react'
import { useMediaQuery } from 'react-responsive'

const data = Array.from({ length: 10 }, (_, i) => ({
  title: `Location ${i}`,
  description: 'This is the description of the location'
}))

export const LocationList = () => {
  const isMobile = useMediaQuery({ query: '(max-width: 767px)' })
  const isTablet = useMediaQuery({ query: '(max-width: 1024px)' })
  const [itemsPerPage, setItemsPerPage] = useState<number>(4)
  const [currentPage, setCurrentPage] = useState<number>(1)

  useEffect(() => {
    if (isMobile) {
      setItemsPerPage(1)
    } else if (isTablet) {
      setItemsPerPage(2)
    } else {
      setItemsPerPage(4)
    }
  }, [isMobile, isTablet])

  return (
    <div className="col-span-full flex w-full flex-col items-center">
      <div className="flex w-full items-center justify-between">
        <h2 className="text-sm font-bold uppercase md:text-lg ">Related Locations</h2>
        <Pagination
          responsive={true}
          defaultCurrent={1}
          current={currentPage}
          onChange={(page) => setCurrentPage(page)}
          total={data.length}
          pageSize={itemsPerPage}
          simple={isMobile}
          showSizeChanger={false}
        />
      </div>
      <Row gutter={16} className="mx-auto mt-4 w-full">
        {data &&
          data.length > 0 &&
          data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((item, _) => (
            <Col span={24 / itemsPerPage} key={item.title}>
              <div className="mx-auto flex flex-col items-center justify-between rounded-md border border-slate-200 bg-white">
                <img
                  src="https://images.unsplash.com/photo-1579353977828-2a4eab540b9a"
                  alt="camera"
                  className="h-2/3 w-full rounded-t-md object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-bold">{item.title}</h3>
                  <p className="leading-1 line-clamp-1 text-sm text-gray-500">{item.description}</p>
                </div>
              </div>
            </Col>
          ))}
      </Row>
    </div>
  )
}
