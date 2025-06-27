import { faPen, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Input, InputNumber, message, Modal, Popconfirm, Table } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";

import { formatDate, formatNumber } from "../utils/dataFormat";
import { getBangCap } from "../utils/api";


const url = "http://localhost:5096/BangCap"
// async function getBangCap() {
//   const result = await axios.get(url)
//   return result.data
// }

async function createBangCap({ tenBangCap, tenVietTat, heSo }) {
  const result = await axios.post(url, { tenBangCap, tenVietTat, heSo })
  return result.data
}

async function updateBangCap({ id, tenBangCap, tenVietTat, heSo }) {
  const result = await axios.put(`${url}/${id}`, { tenBangCap, tenVietTat, heSo })
  return result.data
}

async function deleteBangCap(id) {
  const result = await axios.delete(`${url}/${id}`)
  return result.data
}

function BangCap() {
  const [pageState, setPageState] = useState({ createForm: false, updateForm: false, data: [] })
  const [createForm, setCreateForm] = useState({ tenBangCap: "", tenVietTat: "", heSo: "" })
  const [updateForm, setUpdateForm] = useState({ id: -1, tenBangCap: "", tenVietTat: "", heSo: "" })

  async function updateBangCapData(data) {
    const result = data ?? await getBangCap()
    setPageState(e => ({ ...e, data: result }))
  }

  useEffect(function () { updateBangCapData() }, [])

  const columns = [
    { title: 'STT', dataIndex: 'stt', key: 'stt', render: (_, __, i) => i + 1 },
    { title: 'Tên bằng cấp', dataIndex: 'tenBangCap', key: 'tenBangCap', },
    { title: 'Tên viết tắt', dataIndex: 'tenVietTat', key: 'tenVietTat', },
    { title: 'Hệ số bằng cấp', dataIndex: 'heSo', key: 'heSo', render: _ => formatNumber(_) },
    { title: 'Cập nhật cuối', dataIndex: 'thoiGianCapNhat', key: 'thoiGianCapNhat', render: (_) => formatDate(_) },
    {
      title: '', key: "action", render: (_, entry) => {
        return (
          <div className="flex gap-5">
            <Button color="blue" variant="solid" icon={<FontAwesomeIcon icon={faPen} />}
              onClick={() => {
                setPageState(e => ({ ...e, updateForm: true, }))
                setUpdateForm({
                  id: entry.id,
                  tenBangCap: entry.tenBangCap,
                  tenVietTat: entry.tenVietTat,
                  heSo: entry.heSo
                })
              }} />
            <Popconfirm title="Bạn có chắc là xóa bằng cấp này không?" okText="Xóa" cancelText="Hủy"
              onConfirm={async () => {
                updateBangCapData(await deleteBangCap(entry.id).then(i => {
                  message.info("Xóa bằng cấp thành công!")
                  return i
                }).catch(e => {
                  message.error("Xóa bằng cấp thất bại!")
                  return []
                }))
              }}>
              <Button color="red" variant="solid" icon={<FontAwesomeIcon icon={faTrash} />} />
            </Popconfirm>
          </div>
        )
      }
    },
  ];
  return (
    <div className="m-5 flex flex-col relative">
      <div className="flex justify-between mb-5">
        <h1 className="text-2xl font-bold uppercase">Quản lý bằng cấp</h1>

        <Button variant="solid" color="green" icon={<FontAwesomeIcon icon={faPlus} />}
          onClick={() => {
            setPageState(e => ({ ...e, createForm: true }))
            setCreateForm({ tenBangCap: "", tenVietTat: "", heSo: undefined })
          }}>
          Thêm bằng cấp
        </Button>
      </div>

      <Table size="small" columns={columns} dataSource={pageState.data} pagination={{ pageSize: 10, }} />

      <Modal title="Thêm bằng cấp"
        open={pageState.createForm}
        onCancel={() => setPageState(e => ({ ...e, createForm: false }))}
        footer={[
          <Button variant="solid" color="blue"
            onClick={async () => {
              if (createForm.tenBangCap == '') return message.error("Tên bằng cấp không được để trống!")
              if (createForm.tenVietTat == '') return message.error("Tên viết tắt không được để trống!")
              if (createForm.heSo < 1.0) return message.error("Hệ số bằng cấp không được để trống!")
              if (pageState.data.find(i => i.tenBangCap === createForm.tenBangCap || i.tenVietTat === createForm.tenVietTat)) return message.error("Tên bằng cấp đã tồn tại!")
              const result = await createBangCap(createForm)
                .then(i => {
                  message.info("Thêm bằng cấp thành công!")
                  return i
                }).catch(e => {
                  message.error("Thêm bằng cấp thất bại!")
                  return []
                })
              setPageState(e => ({ ...e, createForm: false, data: [...result] }))
              setCreateForm({ ten: "", tenVietTat: "", heSo: "" })
            }} >
            Gửi
          </Button>
        ]} >
        <form>
          <div className="mb-5 flex flex-col gap-1">
            <label>Tên bằng cấp</label>
            <Input
              value={createForm.tenBangCap}
              onChange={e => setCreateForm(data => ({ ...data, tenBangCap: e.target.value }))} />
          </div>
          <div className="mb-5 flex flex-col gap-1">
            <label>Tên viết tắt</label>
            <Input
              value={createForm.tenVietTat}
              onChange={e => setCreateForm(data => ({ ...data, tenVietTat: e.target.value }))} />
          </div>
          <div className="mb-5 flex flex-col gap-1">
            <label>Hệ số bằng cấp</label>
            <InputNumber min={1} max={3} step={0.1}
              value={createForm.heSo}
              onChange={e => setCreateForm(data => ({ ...data, heSo: e }))} />
          </div>
        </form>
      </Modal>
      <Modal title="Sửa bằng cấp"
        open={pageState.updateForm}
        onCancel={() => setPageState(e => ({ ...e, updateForm: false }))}
        footer={[
          <Button variant="solid" color="blue"
            onClick={async () => {
              if (updateForm.tenBangCap == '') return message.error("Tên bằng cấp không được để trống!")
              if (updateForm.tenVietTat == '') return message.error("Tên viết tắt không được để trống!")
              if (pageState.data.find(i => i.tenBangCap === updateForm.tenBangCap || i.tenVietTat === updateForm.tenVietTat)) return message.error("Tên bằng cấp đã tồn tại!")
              if (updateForm.heSo < 1.0) return message.error("Hệ số bằng cấp không được để trống!")

              const result = await updateBangCap(updateForm)
                .then(i => {
                  message.info("Sửa bằng cấp thành công!")
                  return i
                }).catch(e => {
                  message.error("Sửa bằng cấp thất bại!")
                  return []
                })
              setPageState(e => ({ ...e, updateForm: false, data: [...result] }))
              setUpdateForm({ ten: "", tenVietTat: "", heSo: "" })
            }} >
            Gửi
          </Button>
        ]} >
        <form>
          <div className="mb-5 flex flex-col gap-1">
            <label>Tên bằng cấp</label>
            <Input
              value={updateForm.tenBangCap}
              onChange={e => setUpdateForm(data => ({ ...data, tenBangCap: e.target.value }))} />
          </div>
          <div className="mb-5 flex flex-col gap-1">
            <label>Tên viết tắt</label>
            <Input
              value={updateForm.tenVietTat}
              onChange={e => setUpdateForm(data => ({ ...data, tenVietTat: e.target.value }))} />
          </div>
          <div className="mb-5 flex flex-col gap-1">
            <label>Hệ số bằng cấp</label>
            <InputNumber min={1} max={3} step={0.1}
              value={updateForm.heSo}
              onChange={e => setUpdateForm(data => ({ ...data, heSo: e }))} />
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default BangCap