import { faPen, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Button, Input, message, Modal, Popconfirm, Table } from "antd"
import axios from "axios";
import { useEffect, useState } from "react";
import { getKhoa } from "../utils/api";

const url = "http://localhost:5096/Khoa"
// async function getKhoa() {
//   const result = await axios.get(url)
//   return result.data
// }

async function createKhoa({ maKhoa, tenKhoa, tenVietTat, moTaNhiemVu }) {
  const result = await axios.post(url, { maKhoa, tenKhoa, tenVietTat, moTaNhiemVu })
  return result.data
}

async function updateKhoa({ id, maKhoa, tenKhoa, tenVietTat, moTaNhiemVu }) {
  const result = await axios.put(`${url}/${id}`, { maKhoa, tenKhoa, tenVietTat, moTaNhiemVu })
  return result.data
}

async function deleteKhoa(id) {
  const result = await axios.delete(`${url}/${id}`)
  return result.data
}
const defaultValue = { maKhoa: "", tenKhoa: "", tenVietTat: "", moTaNhiemVu: "" }

function Khoa() {

  const [pageState, setPageState] = useState({ createForm: false, updateForm: false, data: [] })
  const [createForm, setCreateForm] = useState({ ...defaultValue })
  const [updateForm, setUpdateForm] = useState({ id: -1, ...defaultValue })

  async function updateKhoaData(data) {
    const result = data ?? await getKhoa()
    setPageState(e => ({ ...e, data: result }))
  }

  useEffect(function () { updateKhoaData() }, [])

  const columns = [
    { title: 'STT', dataIndex: 'stt', key: 'stt', render: (_, __, i) => i + 1 },
    { title: 'Mã khoa', dataIndex: 'maKhoa', key: 'maKhoa', },
    { title: 'Tên khoa', dataIndex: 'tenKhoa', key: 'tenKhoa', },
    { title: 'Tên viết tắt', dataIndex: 'tenVietTat', key: 'tenVietTat', },
    { title: 'Mô tả nhiệm vụ', dataIndex: 'moTaNhiemVu', key: 'moTaNhiemVu', },
    {
      title: '', key: "action", render: (_, entry) => {
        return (
          <div className="flex gap-5">
            <Button color="blue" variant="solid" icon={<FontAwesomeIcon icon={faPen} />}
              onClick={() => {
                setPageState(e => ({ ...e, updateForm: true }))
                setUpdateForm({
                  id: entry.id,
                  maKhoa: entry.maKhoa,
                  tenKhoa: entry.tenKhoa,
                  tenVietTat: entry.tenVietTat,
                  moTaNhiemVu: entry.moTaNhiemVu
                })
              }} />
            <Popconfirm title="Bạn có chắc là xóa khoa này không?" okText="Xóa" cancelText="Hủy"
              onConfirm={async () => {
                updateKhoaData(await deleteKhoa(entry.id)
                  .then(i => {
                    message.info("Xóa khoa thành công!")
                    return i
                  }).catch(e => {
                    message.error("Xóa khoa thất bại!")
                    return []
                  }))
              }}>
              <Button color="red" variant="solid" icon={<FontAwesomeIcon icon={faTrash} />} />
            </Popconfirm>
          </div >
        )
      }
    },
  ];
  return (
    <div className="m-5 flex flex-col">
      <div className="flex justify-between mb-5">
        <h1 className="text-2xl font-bold uppercase">Quản lý khoa</h1>

        <Button variant="solid" color="green" icon={<FontAwesomeIcon icon={faPlus} />}
          onClick={() => setPageState(e => ({ ...e, createForm: true }))}>
          Thêm khoa
        </Button>
      </div>

      <Table size="small" columns={columns} dataSource={pageState.data} />

      <Modal title="Thêm bằng cấp"
        open={pageState.createForm}
        onCancel={() => setPageState(e => ({ ...e, createForm: false }))}
        footer={[
          <Button variant="solid" color="blue" onClick={async () => {
            if (pageState.data.find(i => i.maKhoa === createForm.maKhoa)) return message.error("Mã khoa đã tồn tại!")
            if (createForm.maKhoa == '') return message.error("Mã khoa không được để trống!")
            if (createForm.tenKhoa == '') return message.error("Tên khoa không được để trống!")
            if (createForm.tenVietTat == '') return message.error("Tên viết tắt không được để trống!")
            if (createForm.moTaNhiemVu == '') return message.error("Mô tả nhiệm vụ không được để trống!")
            const result = await createKhoa(createForm)
              .then(i => {
                message.info("Thêm khoa thành công!")
                return i
              }).catch(e => {
                message.error("Thêm khoa thất bại!")
                return []
              })
            updateKhoaData(result)

            setPageState(e => ({ ...e, createForm: false, data: [...result] }))
            setCreateForm({ ...defaultValue })
          }} >
            Gửi
          </Button>
        ]} >
        <form>
          <div className="mb-5 flex flex-col gap-1">
            <label>Mã khoa</label>
            <Input
              value={createForm.maKhoa}
              onChange={e => setCreateForm(data => ({ ...data, maKhoa: e.target.value }))} />
          </div>
          <div className="mb-5 flex flex-col gap-1">
            <label>Tên khoa</label>
            <Input
              value={createForm.tenKhoa}
              onChange={e => setCreateForm(data => ({ ...data, tenKhoa: e.target.value }))} />
          </div>
          <div className="mb-5 flex flex-col gap-1">
            <label>Tên viết tắt</label>
            <Input
              value={createForm.tenVietTat}
              onChange={e => setCreateForm(data => ({ ...data, tenVietTat: e.target.value }))} />
          </div>
          <div className="mb-5 flex flex-col gap-1">
            <label>Mô tả khoa</label>
            <Input.TextArea
              autoSize={{ minRows: 3, maxRows: 5 }}
              value={createForm.moTaNhiemVu}
              onChange={e => setCreateForm(data => ({ ...data, moTaNhiemVu: e.target.value }))} />
          </div>
        </form>
      </Modal>
      <Modal title="Sửa bằng cấp"
        open={pageState.updateForm}
        onCancel={() => setPageState(e => ({ ...e, updateForm: false }))}
        footer={[
          <Button variant="solid" color="blue" onClick={async () => {
            // console.log(createForm)
            if (updateForm.tenKhoa == '') return message.error("Tên khoa không được để trống!")
            if (updateForm.tenVietTat == '') return message.error("Tên viết tắt không được để trống!")
            if (updateForm.moTaNhiemVu == '') return message.error("Mô tả nhiệm vụ không được để trống!")
            if (pageState.data.find(i => i.id != updateForm.id && i.tenKhoa === updateForm.tenKhoa)) return message.error("Tên khoa đã tồn tại!")

            const result = await updateKhoa(updateForm)
              .then(i => {
                message.info("Sửa khoa thành công!")
                return i
              }).catch(e => {
                message.error("Sửa khoa thất bại!")
                return []
              })

            setPageState(e => ({ ...e, updateForm: false, data: [...result] }))
            setCreateForm({ ...defaultValue })
          }} >
            Gửi
          </Button>
        ]} >
        <form>
          <div className="mb-5 flex flex-col gap-1">
            <label>Mã khoa</label>
            <Input
              disabled
              value={updateForm.maKhoa}
              onChange={e => setCreateForm(data => ({ ...data, maKhoa: e.target.value }))} />
          </div>
          <div className="mb-5 flex flex-col gap-1">
            <label>Tên khoa</label>
            <Input
              value={updateForm.tenKhoa}
              onChange={e => setUpdateForm(data => ({ ...data, tenKhoa: e.target.value }))} />
          </div>
          <div className="mb-5 flex flex-col gap-1">
            <label>Tên viết tắt</label>
            <Input
              value={updateForm.tenVietTat}
              onChange={e => setUpdateForm(data => ({ ...data, tenVietTat: e.target.value }))} />
          </div>
          <div className="mb-5 flex flex-col gap-1">
            <label>Mô tả khoa</label>
            <Input.TextArea
              autoSize={{ minRows: 3, maxRows: 5 }}
              value={updateForm.moTaNhiemVu}
              onChange={e => setUpdateForm(data => ({ ...data, moTaNhiemVu: e.target.value }))} />
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default Khoa