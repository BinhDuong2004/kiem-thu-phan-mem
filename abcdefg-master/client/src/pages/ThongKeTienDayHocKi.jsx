import { DatePicker, Select, Table, Button } from "antd"
import dayjs from "dayjs"
import { useEffect, useMemo, useState } from "react"

import { getHocKi, getTienDayToanTruong } from "../utils/api"
import { exportToExcel } from "../utils/fileExports"

function ThongKeTienDayHocKi() {
  const [data, setData] = useState([])
  const [nam, setNam] = useState(dayjs())
  const [hocKi, setHocKi] = useState([])
  const [selectHocKi, setSelectHocKi] = useState(null)

  const hocKiData = useMemo(function () {
    setSelectHocKi()
    return hocKi.filter(item => dayjs(item.thoiGianBatDau).year() === nam.year())
  }, [hocKi, nam])
  const allData = useMemo(function () {
    const temp = {}
    for (const i of data) {
      if (i.hocKiId != selectHocKi) continue
      if (!temp[i.id]) temp[i.id] = { ...i, tongTienDay: 0 }
      temp[i.id].tongTienDay = i.soTietThuc * (i.heSoHocPhan + i.heSoLop) * i.dinhMucTinChi * i.heSoBangCap
    }
    return Object.values(temp)
  }, [data, selectHocKi])

  useEffect(function () {
    getTienDayToanTruong().then(setData)
    getHocKi().then(data => {
      setHocKi(data)
      console.log(data)
    })
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
      <h1 className="text-2xl mb-5 font-bold uppercase">Thống kê tiền dạy theo học kì</h1>
      <div>

        <DatePicker
          picker="year"
          value={nam}
          onChange={e => setNam(e)} />
        <Select className="w-50" placeholder="Học kì"
          value={selectHocKi}
          onChange={e => setSelectHocKi(e)}
          options={hocKiData.map(item => ({ label: item.tenHocKi, value: item.id }))} />
        <Button className="ml-2" type="primary"
          onClick={() => exportToExcel(allData, `thong-ke-tien-day-hoc-ki-${selectHocKi}.xlsx`)}>
          Xuất Excel
        </Button>
      </div>

      <Table className="my-2" size="small" pagination={{ pageSize: 10 }}
        columns={columns}
        dataSource={allData} />
    </div>
  )
}

export default ThongKeTienDayHocKi