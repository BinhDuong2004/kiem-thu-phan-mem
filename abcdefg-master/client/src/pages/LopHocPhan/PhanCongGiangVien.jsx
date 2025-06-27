import { faChalkboardTeacher } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, message, Select, Table, Tag } from "antd";
import axios from "axios";
import { useContext, useEffect, useState } from "react";

import { faSave } from "@fortawesome/free-regular-svg-icons";
import { getGiangVien, getLopHocPhan } from "../../utils/api";
import { DataContext } from "./context";

const url = "http://localhost:5096/LopHocPhan"
async function updateLop({ id, tenLopHocPhan, hocPhanId, hocKiId, giangVienId }) {
  const result = await axios.put(`${url}/${id}`, { tenLopHocPhan, hocPhanId, hocKiId, giangVienId })
  return result.data
}

const updateDefaultValue = { tenLopHocPhan: "", hocPhanId: 0, hocKiId: 0, giangVienId: null }
function PhanCongGiangVien() {
  const [
    { lopHocPhanData, giangVienData },
    dispatch
  ] = useContext(DataContext)
  // const [pageState, setPageState] = useState({ lopHocPhanData: [], giangVienData: [] })
  const [updateForm, setUpdateForm] = useState({ id: -1, ...updateDefaultValue })

  async function updateLopHocPhanData(data) {
    const result = data ?? await getLopHocPhan()
    dispatch({ type: "updateLopHocPhanData", payload: result })
  }

  useEffect(function () {
    getLopHocPhan().then(data => dispatch({ type: "updateLopHocPhanData", payload: data }))
    getGiangVien().then(data => dispatch({ type: "updateGiangVienData", payload: data }))
  }, [dispatch])

  const columns = [
    { title: 'STT', dataIndex: 'stt', key: 'stt', render: (_, __, i) => i + 1 },
    { title: 'Tên lớp chưa phân công', dataIndex: 'tenLopHocPhan', key: 'tenLopHocPhan', },
    { title: 'Số sinh viên đã đăng kí', dataIndex: 'soSinhVienDangKi', key: 'soSinhVienDangKi', },
    { title: 'Học phần', dataIndex: 'tenHocPhan', key: 'tenHocPhan', },
    { title: 'Học kì', dataIndex: 'tenHocKi', key: 'tenHocKi', },
    {
      title: 'Giảng viên', dataIndex: 'hoTen', key: 'hoTen',
      render: (_, item) => {
        if (item.id != updateForm.id) return _ || <Tag color="red">Chưa phân công</Tag>
        return (
          <Select className="w-full"
            value={updateForm.giangVienId}
            onChange={e => setUpdateForm(data => ({ ...data, giangVienId: e }))}
            options={giangVienData.map(i => ({ value: i.id, label: i.hoTen }))} />)
      }
    },
    {
      key: "action", render: (_, entry) => (
        entry.id != updateForm.id ?
          <Button color="geekblue" variant="solid" icon={<FontAwesomeIcon icon={faChalkboardTeacher} />}
            onClick={() => {
              console.log(entry)
              setUpdateForm({
                id: entry.id,
                tenLopHocPhan: entry.tenLopHocPhan,
                giangVienId: entry.giangVienId,
                hocKiId: entry.hocKiId,
                hocPhanId: entry.hocPhanId,
              })
            }} /> :
          <Button color="blue" variant="solid" icon={<FontAwesomeIcon icon={faSave} />}
            onClick={async () => {
              await updateLop(updateForm).then(data => {
                message.info("Phân công giảng viên thành công!")
                updateLopHocPhanData(data)
              }).catch(e => {
                message.error("Phân công giảng viên thất bại!")
              })
              setUpdateForm({ id: -1, ...updateDefaultValue })
            }} />
      )
    },
  ];
  return (
    <div className="m-5 flex flex-col">
      <div className="flex justify-between mb-5">
        <h1 className="text-2xl font-bold uppercase">Phân công giảng viên</h1>
      </div>

      <Table size="small" columns={columns} pagination={{ pageSize: 8 }}
        dataSource={lopHocPhanData.filter(i => i.giangVienId == 0)} />
    </div>
  )
}

export default PhanCongGiangVien