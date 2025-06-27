import { Select, Table, Button } from "antd"
import { useEffect, useMemo, useState } from "react"

import { getKhoa, getTienDayToanTruong } from "../utils/api"
import { exportToExcel } from "../utils/fileExports"



function ThongKeTienDayKhoa() {
  const [data, setData] = useState([])
  const [khoa, setKhoa] = useState([])
  const [select, setSelect] = useState()

  const allData = useMemo(function () {
    const temp = {}
    for (const i of data) {
      if (i.khoaId != select) continue
      if (!temp[i.id]) temp[i.id] = { ...i, tongTienDay: 0 }
      temp[i.id].tongTienDay = i.soTietThuc * (i.heSoHocPhan + i.heSoLop) * i.dinhMucTinChi * i.heSoBangCap
    }
    return Object.values(temp)
  }, [data, select])

  useEffect(function () {
    getTienDayToanTruong().then(setData)
    getKhoa().then(data => {
      setKhoa(data)
      setSelect(data[0]?.id)
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
      <h1 className="text-2xl mb-5 font-bold uppercase">Thống kê theo khoa</h1>
      <div>
        <Select className="w-50" placeholder="Khoa"
          value={select}
          onChange={e => setSelect(e)}
          options={khoa.map(i => ({ value: i.id, label: i.tenKhoa }))} />
        <Button className="ml-2" type="primary"
          onClick={() => exportToExcel(allData, `thong-ke-tien-day-khoa-${select}.xlsx`)}>
          Xuất Excel
        </Button>
      </div>

      <Table className="my-2" size="small" pagination={{ pageSize: 10 }}
        columns={columns}
        dataSource={allData} />
    </div>
  )
}

export default ThongKeTienDayKhoa