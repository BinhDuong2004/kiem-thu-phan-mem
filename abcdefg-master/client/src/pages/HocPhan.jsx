import { faPen, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Input, InputNumber, message, Modal, Popconfirm, Table } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";

import { getHocPhan } from "../utils/api";

const url = "http://localhost:5096/HocPhan"
async function createHocPhan({ maHocPhan, tenHocPhan, soTinChi, }) {
  const result = await axios.post(url, { maHocPhan, tenHocPhan, soTinChi, })
  return result.data
}

async function updateHocPhan({ id, maHocPhan, tenHocPhan, soTinChi, }) {
  const result = await axios.put(`${url}/${id}`, { maHocPhan, tenHocPhan, soTinChi, })
  return result.data
}

async function deleteHocPhan(id) {
  const result = await axios.delete(`${url}/${id}`)
  return result.data
}
const defaultValue = { maHocPhan: "", tenHocPhan: "", soTinChi: 0 }

function HocPhan() {
  const [pageState, setPageState] = useState({ createForm: false, updateForm: false, data: [] })
  const [createForm, setCreateForm] = useState({ ...defaultValue })
  const [updateForm, setUpdateForm] = useState({ id: -1, ...defaultValue })

  async function updateHocPhanData(data) {
    const result = data ?? await getHocPhan()
    setPageState(e => ({ ...e, data: result }))
  }

  useEffect(function () { updateHocPhanData() }, [])

  const columns = [
    { title: 'STT', dataIndex: 'stt', key: 'stt', render: (_, __, i) => i + 1 },
    { title: 'Mã học phần', dataIndex: 'maHocPhan', key: 'maHocPhan', },
    { title: 'Tên học phần', dataIndex: 'tenHocPhan', key: 'tenHocPhan', },
    { title: 'Số tín chỉ', dataIndex: 'soTinChi', key: 'soTinChi', },
    { title: 'Số tiết', render: (_, entry) => entry.soTinChi * 15 },
    {
      title: '', key: "action", render: (_, entry) => {
        return (
          <div className="flex gap-5">
            <Button color="blue" variant="solid" icon={<FontAwesomeIcon icon={faPen} />}
              onClick={() => {
                setPageState(e => ({ ...e, updateForm: true }))
                setUpdateForm({
                  id: entry.id,
                  maHocPhan: entry.maHocPhan,
                  tenHocPhan: entry.tenHocPhan,
                  soTinChi: entry.soTinChi
                })
              }} />
            <Popconfirm title="Bạn có chắc là xóa học phần này không?" okText="Xóa" cancelText="Hủy"
              onConfirm={async () => updateHocPhanData(await deleteHocPhan(entry.id)
                .then(i => {
                  message.info("Xóa học phần thành công!")
                  return i
                }).catch(e => {
                  message.error("Xóa học phần thất bại!")
                  return []
                }))} >

              <Button color="red" variant="solid" icon={<FontAwesomeIcon icon={faTrash} />} />
            </Popconfirm>
          </div>
        )
      }
    },
  ];
  return (
    <div className="m-5 flex flex-col">
      <div className="flex justify-between mb-5">
        <h1 className="text-2xl font-bold uppercase">Quản lý học phần</h1>

        <Button variant="solid" color="green" icon={<FontAwesomeIcon icon={faPlus} />}
          onClick={() => setPageState(e => ({ ...e, createForm: true }))}>
          Thêm học phần
        </Button>
      </div>

      <Table size="small" columns={columns} dataSource={pageState.data} />

      <Modal title="Thêm học phần"
        open={pageState.createForm}
        onCancel={() => setPageState(e => ({ ...e, createForm: false }))}
        footer={[
          <Button variant="solid" color="blue" onClick={async () => {
            if (createForm.maHocPhan == '') return message.error("Mã học phần không được để trống!")
            if (createForm.tenHocPhan == '') return message.error("Tên học phần không được để trống!")
            if (pageState.data.find(i => i.maHocPhan === createForm.maHocPhan || i.tenHocPhan === createForm.tenHocPhan)) return message.error("Học phần đã tồn tại!")
            if (createForm.soTinChi == 0) return message.error("Số tín chỉ không được để trống!")
            if (createForm.soTinChi < 0) return message.error("Số tín chỉ không được âm!")

            const result = await createHocPhan(createForm)
              .then(i => {
                message.info("Thêm học phần thành công!")
                return i
              }).catch(e => {
                message.error("Thêm học phần thất bại!")
                return []
              })

            setPageState(e => ({ ...e, createForm: false, data: [...result] }))
            setCreateForm({ ...defaultValue })
          }} >
            Gửi
          </Button>
        ]} >
        <form>
          <div className="mb-5 flex flex-col gap-1">
            <label>Mã học phần</label>
            <Input
              value={createForm.maHocPhan}
              onChange={e => setCreateForm(data => ({ ...data, maHocPhan: e.target.value }))} />
          </div>
          <div className="mb-5 flex flex-col gap-1">
            <label>Tên học phần</label>
            <Input
              value={createForm.tenHocPhan}
              onChange={e => setCreateForm(data => ({ ...data, tenHocPhan: e.target.value }))} />
          </div>
          <div className="mb-5 flex flex-col gap-1">
            <label>Số tín chỉ (1 tín chỉ = 15 tiết học)</label>
            <InputNumber
              value={createForm.soTinChi}
              onChange={e => setCreateForm(data => ({ ...data, soTinChi: e }))} />
          </div>
        </form>
      </Modal>
      <Modal title="Sửa bằng cấp"
        open={pageState.updateForm}
        onCancel={() => setPageState(e => ({ ...e, updateForm: false }))}
        footer={[
          <Button variant="solid" color="blue" onClick={async () => {
            // console.log(createForm)
            if (updateForm.maHocPhan == '') return message.error("Mã học phần không được để trống!")
            if (updateForm.tenHocPhan == '') return message.error("Tên học phần không được để trống!")
            if (updateForm.soTinChi == 0) return message.error("Số tín chỉ không được để trống!")
            if (updateForm.soTinChi < 0) return message.error("Số tín chỉ không được âm!")
            const result = await updateHocPhan(updateForm)
              .then(i => {
                message.info("Sửa học phần thành công!")
                return i
              }).catch(e => {
                message.error("Sửa học phần thất bại!")
                return []
              })
            // console.log(result)
            setPageState(e => ({ ...e, updateForm: false, data: [...result] }))
            setUpdateForm({ ...defaultValue })
          }} >
            Gửi
          </Button>
        ]} >
        <form>
          <div className="mb-5 flex flex-col gap-1">
            <label>Mã học phần</label>
            <Input
              value={updateForm.maHocPhan}
              onChange={e => setUpdateForm(data => ({ ...data, maHocPhan: e.target.value }))} />
          </div>
          <div className="mb-5 flex flex-col gap-1">
            <label>Tên học phần</label>
            <Input
              value={updateForm.tenHocPhan}
              onChange={e => setUpdateForm(data => ({ ...data, tenHocPhan: e.target.value }))} />
          </div>
          <div className="mb-5 flex flex-col gap-1">
            <label>Số tín chỉ (1 tín chỉ = 15 tiết học)</label>
            <InputNumber
              value={updateForm.soTinChi}
              onChange={e => setUpdateForm(data => ({ ...data, soTinChi: e }))} />
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default HocPhan