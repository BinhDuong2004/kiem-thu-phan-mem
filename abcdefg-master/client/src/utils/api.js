import axios from "axios"

export async function getBangCap() {
  const result = await axios.get('http://localhost:5096/BangCap')
  return result.data
}

export async function getKhoa() {
  const result = await axios.get('http://localhost:5096/Khoa')
  return result.data
}

export async function getGiangVien() {
  const result = await axios.get('http://localhost:5096/GiangVien')
  return result.data
}

export async function getHocPhan() {
  const result = await axios.get("http://localhost:5096/HocPhan")
  return result.data
}

export async function getHocKi() {
  const result = await axios.get("http://localhost:5096/HocKi")
  return result.data
}

export async function getLopHocPhan() {
  const result = await axios.get("http://localhost:5096/LopHocPhan")
  return result.data
}

export async function getDinhMuc() {
  const result = await axios.get("http://localhost:5096/DinhMuc")
  return result.data
}

export async function getHeSoLopHocPhan(year) {
  const result = await axios.get(`http://localhost:5096/HeSoLopHocPhan/${year}`)
  return result.data
}

export async function getTienDayToanTruong() {
  const result = await axios.get(`http://localhost:5096/ThongKe/lay-tien-day-toan-truong`)
  return result.data
}

export async function GetThongKeKhoa() {
  const result = await axios.get(`http://localhost:5096/ThongKe/thong-ke-khoa`)
  return result.data
}

export async function GetThongKeBangCap() {
  const result = await axios.get(`http://localhost:5096/ThongKe/thong-ke-bang-cap`)
  return result.data
}
export async function GetThongKeLopHocPhan() {
  const result = await axios.get(`http://localhost:5096/ThongKe/thong-ke-lop-hoc-phan`)
  return result.data
}