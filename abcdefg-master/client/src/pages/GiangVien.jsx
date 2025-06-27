import { faPen, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, DatePicker, Input, message, Modal, Popconfirm, Select, Table } from "antd";
import axios from "axios";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

import { getBangCap, getGiangVien, getKhoa } from "../utils/api";
import { formatDate2 } from "../utils/dataFormat";

const url = "http://localhost:5096/GiangVien"
async function createGiangVien({ maGiangVien, hoTen, dienThoai, email, khoaId, bangCapId, ngaySinh }) {
  const result = await axios.post(url, { maGiangVien, hoTen, dienThoai, email, khoaId, bangCapId, ngaySinh })
  return result.data
}

async function updateGiangVien({ id, maGiangVien, hoTen, dienThoai, email, khoaId, bangCapId, ngaySinh }) {
  const result = await axios.put(`${url}/${id}`, { maGiangVien, hoTen, dienThoai, email, khoaId, bangCapId, ngaySinh })
  return result.data
}

async function deleteGiangVien(id) {
  const result = await axios.delete(`${url}/${id}`)
  return result.data
}

const defaultValue = { maGiangVien: "", hoTen: "", dienThoai: "", email: "", khoaId: 0, bangCapId: 0, ngaySinh: dayjs() }

function GiangVien() {
  const [pageState, setPageState] = useState({
    createForm: false,
    updateForm: false,
    giangVienData: [],
    bangCapData: [],
    khoaData: [],
  })
  const [createForm, setCreateForm] = useState({ ...defaultValue })
  const [updateForm, setUpdateForm] = useState({ ...defaultValue })

  useEffect(function () {
    getGiangVien().then(data => setPageState(e => ({ ...e, giangVienData: data })))

    getKhoa().then(data => {
      setPageState(e => ({ ...e, khoaData: data }))
      setCreateForm(e => ({ ...e, khoaId: data[0]?.id }))
    })

    getBangCap().then(data => {
      setPageState(e => ({ ...e, bangCapData: data }))
      setCreateForm(e => ({ ...e, bangCapId: data[0]?.id }))
    })
  }, [])

  const columns = [
    { title: 'STT', dataIndex: 'stt', key: 'stt', render: (_, __, i) => i + 1 },
    { title: 'Mã giảng viên', dataIndex: 'id', key: 'id', render: _ => `GV_${_}` },
    { title: 'Họ tên', dataIndex: 'hoTen', key: 'hoTen', },
    { title: 'Ngày sinh', dataIndex: 'ngaySinh', key: 'ngaySinh', render: value => formatDate2(value) },
    { title: 'Số điện thoại', dataIndex: 'dienThoai', key: 'dienThoai', },
    { title: 'Email', dataIndex: 'email', key: 'email', },
    { title: 'Khoa', dataIndex: 'tenKhoa', key: 'tenKhoa', },
    { title: 'Bằng cấp', dataIndex: 'tenBangCap', key: 'tenBangCap', },
    {
      title: '', key: "action", render: (_, entry) => {
        return (
          <div className="flex gap-5">
            <Button color="blue" variant="solid" icon={<FontAwesomeIcon icon={faPen} />}
              onClick={() => {
                setPageState(e => ({ ...e, updateForm: true }))
                setUpdateForm({
                  id: entry.id,
                  maGiangVien: entry.maGiangVien,
                  hoTen: entry.hoTen,
                  dienThoai: entry.dienThoai,
                  email: entry.email,
                  khoaId: entry.khoaId,
                  bangCapId: entry.bangCapId,
                  ngaySinh: dayjs(entry.ngaySinh)
                })
              }} />
            <Popconfirm title="Bạn có chắc là xóa giảng viên này không?" okText="Xóa" cancelText="Hủy"
              onConfirm={async () => {
                const result = await deleteGiangVien(entry.id)
                  .then(i => {
                    message.info("Xóa giảng viên thành công!")
                    return i
                  }).catch(e => {
                    message.error("Xóa giảng viên thất bại!")
                    return []
                  })
                setPageState(e => ({ ...e, giangVienData: [...result] }))
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
        <h1 className="text-2xl font-bold uppercase">Quản lý giảng viên</h1>

        <Button variant="solid" color="green" icon={<FontAwesomeIcon icon={faPlus} />}
          onClick={() => {
            setPageState(e => ({ ...e, createForm: true }))
            setCreateForm({ ...defaultValue })
          }}>
          Thêm giảng viên
        </Button>
      </div>

      <Table size="small" columns={columns} dataSource={pageState.giangVienData} />

      <Modal title="Thêm giảng viên"
        open={pageState.createForm}
        onCancel={() => setPageState(e => ({ ...e, createForm: false }))}
        footer={[
          <Button variant="solid" color="blue"
            onClick={async () => {
              if (createForm.hoTen == '') return message.error("Họ tên không được để trống!")
              if (createForm.dienThoai == '') return message.error("Số điện thoại không được để trống!")
              if (createForm.dienThoai.length != 10) return message.error("Số điện thoại không đúng định dạng!")
              if (createForm.email == '') return message.error("Email không được để trống!")
              if (!createForm.email.includes("@university.edu.vn")) return message.error("Email không đúng định dạng!")
              // if (pageState.giangVienData
              //   ?.find(i => i.email === createForm.email || i.dienThoai === createForm.dienThoai) != null)
              //   return message.error("Giảng viên đã tồn tại!")
              if (createForm.khoaId == 0) return message.error("Khoa không được để trống!")
              if (createForm.bangCapId == 0) return message.error("Bằng cấp không được để trống!")
              if (createForm.ngaySinh == null) return message.error("Ngày sinh không được để trống!")
              createForm.ngaySinh = createForm.ngaySinh.toDate()

              const result = await createGiangVien(createForm)
                .then(i => {
                  message.info("Thêm giảng viên thành công!")
                  return i
                }).catch(e => {
                  message.error("Thêm giảng viên thất bại!")
                  return []
                })
              setPageState(e => ({ ...e, createForm: false, giangVienData: [...result] }))
              setCreateForm({ ...defaultValue })
            }} >
            Gửi
          </Button>
        ]} >
        <form>
          <div className="mb-5 flex flex-col gap-1">
            <label>Họ tên giảng viên</label>
            <Input
              value={createForm.hoTen}
              onChange={e => setCreateForm(data => ({ ...data, hoTen: e.target.value }))} />
          </div>
          <div className="mb-5 flex flex-col gap-1">
            <label>Ngày sinh</label>
            <DatePicker
              value={createForm.ngaySinh}
              onChange={e => setCreateForm(data => ({ ...data, ngaySinh: e }))} />
          </div>
          <div className="mb-5 flex flex-col gap-1">
            <label>Số điện thoại</label>
            <Input
              value={createForm.dienThoai}
              onChange={e => setCreateForm(data => ({ ...data, dienThoai: e.target.value }))} />
          </div>
          <div className="mb-5 flex flex-col gap-1">
            <label>Email</label>
            <Input
              placeholder="horace.harmon.lurton@university.edu.vn"
              value={createForm.email}
              onChange={e => setCreateForm(data => ({ ...data, email: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-5">
            <div className="mb-5 flex flex-col gap-1">
              <label>Khoa</label>
              <Select
                options={pageState.khoaData.map(i => ({ value: i.id, label: i.tenKhoa }))}
                value={createForm.khoaId}
                onChange={e => setCreateForm(data => ({ ...data, khoaId: e }))} />
            </div>
            <div className="mb-5 flex flex-col gap-1">
              <label>Bằng cấp</label>
              <Select
                options={pageState.bangCapData.map(i => ({ value: i.id, label: i.tenBangCap }))}
                value={createForm.khoaId}
                onChange={e => setCreateForm(data => ({ ...data, bangCapId: e }))} />
            </div>
          </div>
        </form>
      </Modal>
      <Modal title="Sửa giảng viên"
        open={pageState.updateForm}
        onCancel={() => setPageState(e => ({ ...e, updateForm: false }))}
        footer={[
          <Button variant="solid" color="blue"
            onClick={async () => {
              if (updateForm.hoTen == '') return message.error("Họ tên không được để trống!")
              if (updateForm.dienThoai == '') return message.error("Số điện thoại không được để trống!")
              if (updateForm.dienThoai?.length != 10) return message.error("Số điện thoại không đúng định dạng!")
              if (updateForm.email == '') return message.error("Email không được để trống!")
              // if (pageState.giangVienData
              //   ?.find(i => i.email === updateForm.email || i.dienThoai === updateForm.dienThoai) != null)
              // return message.error("Giảng viên đã tồn tại!")
              if (!updateForm.email.includes("@university.edu.vn")) return message.error("Email không đúng định dạng!")
              if (updateForm.khoaId == 0) return message.error("Khoa không được để trống!")
              if (updateForm.bangCapId == 0) return message.error("Bằng cấp không được để trống!")
              if (updateForm.ngaySinh == null) return message.error("Ngày sinh không được để trống!")
              updateForm.ngaySinh = updateForm.ngaySinh.toDate()

              const result = await updateGiangVien(updateForm)
                .then(i => {
                  message.info("Sửa giảng viên thành công!")
                  return i
                }).catch(e => {
                  message.error("Sửa giảng viên thất bại!")
                  return []
                })
              setPageState(e => ({ ...e, updateForm: false, giangVienData: [...result] }))
              setUpdateForm({ id: 0, ...defaultValue })
            }} >
            Gửi
          </Button>
        ]} >
        <form>
          <div className="mb-5 flex flex-col gap-1">
            <label>Họ tên giảng viên</label>
            <Input
              value={updateForm.hoTen}
              onChange={e => setUpdateForm(data => ({ ...data, hoTen: e.target.value }))} />
          </div>
          <div className="mb-5 flex flex-col gap-1">
            <label>Ngày sinh</label>
            <DatePicker
              value={updateForm.ngaySinh}
              onChange={e => setUpdateForm(data => ({ ...data, ngaySinh: e }))} />
          </div>
          <div className="mb-5 flex flex-col gap-1">
            <label>Số điện thoại</label>
            <Input
              value={updateForm.dienThoai}
              onChange={e => setUpdateForm(data => ({ ...data, dienThoai: e.target.value }))} />
          </div>
          <div className="mb-5 flex flex-col gap-1">
            <label>Email</label>
            <Input
              placeholder="horace.harmon.lurton@university.edu.vn"
              value={updateForm.email}
              onChange={e => setUpdateForm(data => ({ ...data, email: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-5">
            <div className="mb-5 flex flex-col gap-1">
              <label>Khoa</label>
              <Select
                options={pageState.khoaData.map(i => ({ value: i.id, label: i.tenKhoa }))}
                value={updateForm.khoaId}
                onChange={e => setUpdateForm(data => ({ ...data, khoaId: e }))} />
            </div>
            <div className="mb-5 flex flex-col gap-1">
              <label>Bằng cấp</label>
              <Select
                options={pageState.bangCapData.map(i => ({ value: i.id, label: i.tenBangCap }))}
                value={updateForm.khoaId}
                onChange={e => setUpdateForm(data => ({ ...data, bangCapId: e }))} />
            </div>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default GiangVien