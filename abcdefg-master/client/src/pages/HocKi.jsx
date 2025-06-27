import { faPen, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, DatePicker, Input, message, Modal, Popconfirm, Table } from "antd";
import axios from "axios";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

import { getHocKi } from "../utils/api";
import { formatDate2 } from "../utils/dataFormat";

const url = "http://localhost:5096/HocKi"


async function createHocKi({ tenHocKi, thoiGianBatDau, thoiGianKetThuc, }) {
  const result = await axios.post(url, { tenHocKi, thoiGianBatDau, thoiGianKetThuc, })
  return result.data
}

async function updateHocKi({ id, tenHocKi, thoiGianBatDau, thoiGianKetThuc, }) {
  const result = await axios.put(`${url}/${id}`, { tenHocKi, thoiGianBatDau, thoiGianKetThuc })
  return result.data
}

async function deleteHocKi(id) {
  const result = await axios.delete(`${url}/${id}`)
  return result.data
}

const defaultValue = { tenHocKi: "", thoiGianBatDau: dayjs(), thoiGianKetThuc: dayjs(), }
function HocKi() {
  const [pageState, setPageState] = useState({ createForm: false, updateForm: false, data: [] })
  const [createForm, setCreateForm] = useState({ ...defaultValue })
  const [updateForm, setUpdateForm] = useState({ id: -1, ...defaultValue })

  async function updateHocPhanData(data) {
    const result = data ?? await getHocKi()
    setPageState(e => ({ ...e, data: result }))
  }

  useEffect(function () {
    updateHocPhanData()
  }, [])

  const columns = [
    { title: 'STT', dataIndex: 'stt', key: 'stt', render: (_, __, i) => i + 1 },
    { title: 'Tên học kì', dataIndex: 'tenHocKi', key: 'tenHocKi', },
    { title: 'Thời gian bắt đầu', dataIndex: 'thoiGianBatDau', key: 'thoiGianBatDau', render: _ => formatDate2(_) },
    { title: 'Thời gian kết thúc', dataIndex: 'thoiGianKetThuc', key: 'thoiGianKetThuc', render: _ => formatDate2(_) },
    {
      key: "action", render: (_, entry) => {
        return (
          <div className="flex gap-5">
            <Button color="blue" variant="solid" icon={<FontAwesomeIcon icon={faPen} />}
              onClick={() => {
                setPageState(e => ({ ...e, updateForm: true }))
                setUpdateForm({
                  id: entry.id,
                  tenHocKi: entry.tenHocKi,
                  thoiGianBatDau: dayjs(entry.thoiGianBatDau),
                  thoiGianKetThuc: dayjs(entry.thoiGianKetThuc)
                })
              }} />
            <Popconfirm title="Bạn có chắc là xóa học kì này không?" okText="Xóa" cancelText="Hủy"
              onConfirm={async () => {
                updateHocPhanData(await deleteHocKi(entry.id)
                  .then(i => {
                    message.info("Xóa học kì thành công!")
                    return i
                  }).catch(e => {
                    message.error("Xóa học kì thất bại!")
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
    <div className="m-5 flex flex-col">
      <div className="flex justify-between mb-5">
        <h1 className="text-2xl font-bold uppercase">Quản lý học kì</h1>

        <Button variant="solid" color="green" icon={<FontAwesomeIcon icon={faPlus} />}
          onClick={() => setPageState(e => ({ ...e, createForm: true }))}>
          Thêm học kì
        </Button>
      </div>

      <Table size="small" columns={columns} dataSource={pageState.data} />

      <Modal title="Thêm học kì"
        open={pageState.createForm}
        onCancel={() => setPageState(e => ({ ...e, createForm: false }))}
        footer={[
          <Button variant="solid" color="blue" onClick={async () => {
            const input = {
              tenHocKi: createForm.tenHocKi,
              thoiGianBatDau: createForm.thoiGianBatDau.toDate(),
              thoiGianKetThuc: createForm.thoiGianKetThuc.toDate(),
            }
            if (input.tenHocKi == '') return message.error("Tên học kì không được để trống!")
            if (input.thoiGianBatDau == null) return message.error("Thời gian bắt đầu không được để trống!")
            if (input.thoiGianKetThuc == null) return message.error("Thời gian kết thúc không được để trống!")

            const result = await createHocKi(input)
              .then(i => {
                message.info("Thêm học kì thành công!")
                return i
              }).catch(e => {
                message.error("Thêm học kì thất bại!")
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
              value={createForm.tenHocKi}
              onChange={e => setCreateForm(data => ({ ...data, tenHocKi: e.target.value }))} />
          </div>
          <div className="mb-5 flex flex-col gap-1">
            <label>Thời gian bắt đầu</label>
            <DatePicker
              value={createForm.thoiGianBatDau}
              onChange={e => setCreateForm(data => ({ ...data, thoiGianBatDau: e }))} />
          </div>
          <div className="mb-5 flex flex-col gap-1">
            <label>Thời gian kết thúc</label>
            <DatePicker
              value={createForm.thoiGianKetThuc}
              onChange={e => setCreateForm(data => ({ ...data, thoiGianKetThuc: e }))} />
          </div>
        </form>
      </Modal>
      <Modal title="Sửa học kì"
        open={pageState.updateForm}
        onCancel={() => setPageState(e => ({ ...e, updateForm: false }))}
        footer={[
          <Button variant="solid" color="blue" onClick={async () => {
            // console.log(createForm)
            const input = {
              id: updateForm.id,
              tenHocKi: updateForm.tenHocKi,
              thoiGianBatDau: updateForm.thoiGianBatDau.toDate(),
              thoiGianKetThuc: updateForm.thoiGianKetThuc.toDate(),
            }

            if (input.tenHocKi == '') return message.error("Tên học kì không được để trống!")
            if (pageState.data.find(i => input.id != i.id && i.tenHocKi === input.tenHocKi)) return message.error("Học kì đã tồn tại!")
            if (input.thoiGianBatDau == null) return message.error("Thời gian bắt đầu không được để trống!")
            if (input.thoiGianKetThuc == null) return message.error("Thời gian kết thúc không được để trống!")

            const result = await updateHocKi(input).then(i => {
              message.info("Sửa học kì thành công!")
              return i
            }).catch(e => {
              message.error("Sửa học kì thất bại!")
              return []
            })

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
              value={updateForm.tenHocKi}
              onChange={e => setUpdateForm(data => ({ ...data, tenHocKi: e.target.value }))} />
          </div>
          <div className="mb-5 flex flex-col gap-1">
            <label>Thời gian bắt đầu</label>
            <DatePicker
              value={updateForm.thoiGianBatDau}
              onChange={e => setUpdateForm(data => ({ ...data, thoiGianBatDau: e }))} />
          </div>
          <div className="mb-5 flex flex-col gap-1">
            <label>Thời gian kết thúc</label>
            <DatePicker
              value={updateForm.thoiGianKetThuc}
              onChange={e => setUpdateForm(data => ({ ...data, thoiGianKetThuc: e }))} />
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default HocKi