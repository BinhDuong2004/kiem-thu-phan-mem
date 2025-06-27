import { DatePicker, Table, Button } from "antd"
import dayjs from "dayjs"
import { useEffect, useMemo, useState } from "react"

import { getTienDayToanTruong } from "../utils/api"
import { exportToExcel } from "../utils/fileExports"

function ThongKeTienDayNam() {
  const [data, setData] = useState([])
  const [nam, setNam] = useState(dayjs())

  const allData = useMemo(function () {
    const temp = {}
    for (const i of data) {
      if (i.namHoc !== nam.year()) continue
      if (!temp[i.id]) temp[i.id] = { ...i, tongTienDay: 0 }
      temp[i.id].tongTienDay = i.soTietThuc * (i.heSoHocPhan + i.heSoLop) * i.dinhMucTinChi * i.heSoBangCap
    }
    return Object.values(temp)
  }, [data, nam])

  useEffect(function () {
    getTienDayToanTruong().then(setData)
  }, [])

  const columns = [
    { title: 'STT', dataIndex: 'stt', key: 'stt', render: (_, __, i) => i + 1 },
    { title: 'Họ tên', dataIndex: 'hoTen', key: 'hoTen' },
    { title: 'Khoa', dataIndex: 'tenKhoa', key: 'tenKhoa' },
    { title: 'Bằng cấp', dataIndex: 'tenBangCap', key: 'tenBangCap' },
    {
      title: 'Tiền dạy', render: ({ soTietThuc, heSoBangCap, heSoHocPhan, heSoLop, dinhMucTinChi }) => {
        const tienDay = soTietThuc * (heSoHocPhan + heSoLop) * dinhMucTinChi * heSoBangCap
        return tienDay.toLocaleString('vi', { style: 'currency', currency: 'VND' })
      }
    }
  ]

  return (
    <div>
      <h1 className="text-2xl mb-5 font-bold uppercase">Thống kê tiền dạy theo năm học</h1>
      <div className="flex gap-2">
        <DatePicker
          picker="year"
          value={nam}
          onChange={e => setNam(e)} />
        <Button className="ml-2" type="primary"
          onClick={() => exportToExcel(allData, `thong-ke-tien-day-khoa-${nam.year()}.xlsx`)}>
          Xuất Excel
        </Button>
      </div>

      <Table className="my-2" size="small" pagination={{ pageSize: 10 }}
        columns={columns}
        dataSource={allData} />
    </div>
  )
}

export default ThongKeTienDayNam