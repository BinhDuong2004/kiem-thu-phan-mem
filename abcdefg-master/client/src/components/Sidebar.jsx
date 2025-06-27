import { faCalendar } from '@fortawesome/free-regular-svg-icons'
import { faChalkboardTeacher, faChartColumn, faChevronRight, faHouse, faMoneyBill } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Collapse, ConfigProvider } from 'antd'
import { useState } from 'react'
import { Link, useLocation } from 'react-router'

function Icon({ icon, className, ...props }) {
  return <FontAwesomeIcon icon={icon} className={[className, 'scale-150'].join(' ')} {...props} />
}

function SubLink({ to, active = false, content }) {
  return (
    <li className={[' list-disc text-lg', active && 'text-orange-400'].join(' ')}>
      <Link to={to} className='font-semibold' style={{ color: active ? "#FB8D18" : "#ffffff" }}>{content}</Link>
    </li>
  )
}

function Header({ pathname, links = [], icon, title }) {
  return (
    <div className='flex gap-5 items-center' style={{ color: links.includes(pathname) ? "#FB8D18" : "#ffffff" }}>
      {icon && <Icon icon={icon} />}
      <h1 className='font-bold text-lg' style={{ color: links?.includes(pathname) ? "#FB8D18" : "#ffffff" }}>{title}</h1>
    </div >
  )
}

const theme = {
  components: {
    Collapse: {
      contentBg: "#345A80",
      colorText: "white",
      colorTextHeading: "white",
      headerPadding: "20px 15px"
    }
  },
}

const items = {
  giaoVien: [
    { content: "Quản lý khoa", to: "/khoa" },
    { content: "Quản lý giảng viên", to: "/giang-vien" },
    { content: "Danh mục bằng cấp", to: "/bang-cap" },
    { content: "Thống kê giảng viên", to: "/thong-ke-giang-vien" },
  ],
  lopHocPhan: [
    { content: "Quản lý học kì", to: "/hoc-ki" },
    { content: "Quản lý học phần", to: "/hoc-phan" },
    { content: "Quản lý lớp học phần", to: "/lop-hoc-phan" },
    { content: "Thống kê số lớp", to: "/thong-ke-so-lop" }
  ],
  thietLapTienDay: [
    { content: "Cài đặt hệ số", to: "/cai-dat" },
    { content: "Tra cứu tiền dạy", to: "/tinh-tien-day" },
  ],
  thongKe: [
    { content: "Thống kê theo khoa", to: "/thong-ke-theo-khoa" },
    { content: "Thống kê theo năm", to: "/thong-ke-theo-nam" },
    { content: "Thống kê theo học kì", to: "/thong-ke-theo-hoc-ki" },

  ]
}

function SubLink2({ icon, to, content }) {
  return (
    <div className='flex gap-5 ps-5 items-center border-b-1 border-white py-5'>
      <Icon icon={icon} className='text-white' />
      <Link to={to} className='font-bold text-lg' style={{ color: "#ffffff" }}>{content}</Link>
    </div>
  )
}

function Sidebar() {
  const { pathname } = useLocation();
  const [selected, setSelected] = useState('')

  return (
    <div className="w-full h-full flex flex-col py-10" >
      {/* <img src={logo} /> */}
      <SubLink2 content="Trang chủ" to="/" icon={faHouse} />
      {/* Giang Vien */}
      <ConfigProvider theme={theme}>
        <Collapse accordion expandIconPosition='end' bordered={false}
          activeKey={selected}
          onChange={a => setSelected(a[0])}
          expandIcon={({ isActive }) => <FontAwesomeIcon icon={faChevronRight} className='scale-130' rotation={isActive ? 90 : 0} />}
          items={[
            {
              key: "2",
              label: <Header pathname={pathname} links={items.giaoVien.map(i => i.to)} icon={faChalkboardTeacher} title="Giảng viên" />,
              children: (
                <ul className='flex flex-col gap-2 ps-5 relative'>
                  {items.giaoVien.map((i, j) => <SubLink active={pathname === i.to} {...i} key={j} />)}
                </ul>
              ),
            },
            {
              key: "3",
              label: <Header pathname={pathname} links={items.lopHocPhan.map(i => i.to)} icon={faCalendar} title="Lớp học phần" />,
              children: (
                <ul className='flex flex-col gap-2 ps-5 relative'>
                  {items.lopHocPhan.map((i, j) => <SubLink active={pathname === i.to} {...i} key={j} />)}
                </ul>
              ),
            },
            {
              key: "4",
              label: <Header pathname={pathname} links={items.thietLapTienDay.map(i => i.to)} icon={faMoneyBill} title="Tiền dạy học" />,
              children: (
                <ul className='flex flex-col gap-2 ps-5 relative'>
                  {items.thietLapTienDay.map((i, j) => <SubLink active={pathname === i.to} {...i} key={j} />)}
                </ul>
              ),
            },
            {
              key: "5",
              label: <Header pathname={pathname} links={items.thongKe.map(i => i.to)} icon={faChartColumn} title="Thống kê" />,
              children: (
                <ul className='flex flex-col gap-2 ps-5 relative'>
                  {items.thongKe.map((i, j) => <SubLink active={pathname === i.to} {...i} key={j} />)}
                </ul>
              ),
            },
          ]} />
      </ConfigProvider>

      <div className='border-b-1 border-white' />
    </div >
  )
}

export default Sidebar