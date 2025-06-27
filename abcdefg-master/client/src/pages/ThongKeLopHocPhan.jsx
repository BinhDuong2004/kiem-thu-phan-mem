import { DatePicker, Select, Table } from "antd"
import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import { getHocKi, getHocPhan, GetThongKeLopHocPhan } from "../utils/api";

function ThongKeLopHocPhan() {
  const [year, setYear] = useState(dayjs());
  const [hocKyData, setHocKyData] = useState([]);
  const [hocPhanData, setHocPhanData] = useState([]);
  const [hocKy, setHocKy] = useState(null);
  const [hocPhan, setHocPhan] = useState(null);
  const [data, setData] = useState([]);

  const tableData = useMemo(() => {
    const temp = {}

    for (const item of data) {
      if (item.namHoc !== year.year()) continue
      if (hocKy && item.hocKiId !== hocKy) continue
      if (hocPhan && item.id !== hocPhan) continue
      if (!temp[item.id]) temp[item.id] = { ...item, soLopHocPhan: 0 }
      temp[item.id].soLopHocPhan += item.soLopHocPhan || 0
    }
    return Object.values(temp)
  }, [data, hocKy, hocPhan, year])

  useEffect(function () {
    getHocKi().then(data => setHocKyData(data))
    getHocPhan().then(data => setHocPhanData(data))
    GetThongKeLopHocPhan().then(data => setData(data))
  }, [])
  // {
  //     "id": 401,
  //     "maHocPhan": "HP001",
  //     "tenHocPhan": "Hệ điều hành",
  //     "soTinChi": 2,
  //     "hocKiId": 62,
  //     "tenHocKi": "Học kỳ 2 - 2020",
  //     "namHoc": 2021,
  //     "soLopHocPhan": 5
  // }
  const columns = [
    { title: 'STT', dataIndex: 'stt', key: 'stt', render: (_, __, i) => i + 1 },
    { title: 'Mã học phần', dataIndex: 'maHocPhan', key: 'maHocPhan' },
    { title: 'Tên học phần', dataIndex: 'tenHocPhan', key: 'tenHocPhan' },
    { title: 'Số lớp học phần', dataIndex: 'soLopHocPhan', key: 'soLopHocPhan' },
  ];

  // console.log(data)

  return (
    <div>
      <h1 className="text-2xl mb-5 font-bold uppercase">Thống kê lớp học phần</h1>
      <div className="flex gap-5">
        <DatePicker className="w-50" picker="year"
          value={year}
          onChange={e => {
            setYear(e)
            setHocKy(null);
            setHocPhan(null);
          }} />
        <Select placeholder="Chọn học kỳ" className="w-50"
          value={hocKy}
          onChange={e => {
            setHocKy(e)
            setHocPhan(null);
          }}
          options={hocKyData
            .filter(item => dayjs(item.thoiGianBatDau).year() === year.year())
            .map(item => ({ label: item.tenHocKi, value: item.id }))} />
        <Select placeholder="Chọn học phần" className="w-50"
          value={hocPhan}
          onChange={e => setHocPhan(e)}
          options={hocPhanData.map(item => ({ label: item.tenHocPhan, value: item.id }))} />
      </div>
      <Table className="my-2" size="small" pagination={{ pageSize: 10 }}
        columns={columns}
        dataSource={tableData} />
    </div>
  )
}

export default ThongKeLopHocPhan
// This file is intentionally left blank as a placeholder for future implementation.