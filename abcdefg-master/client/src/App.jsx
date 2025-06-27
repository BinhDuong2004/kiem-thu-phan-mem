import '@ant-design/v5-patch-for-react-19';
import { BrowserRouter, Route, Routes } from "react-router";

import Layout from "./components/Layout";
import BangCap from "./pages/BangCap";
import CaiDatHeSo from "./pages/CaiDatHeSo";
import GiangVien from "./pages/GiangVien";
import HocKi from "./pages/HocKi";
import HocPhan from "./pages/HocPhan";
import Khoa from "./pages/Khoa";
import LopHocPhan from "./pages/LopHocPhan";
import ThongKeGiangVien from './pages/ThongKeGiangVien';
import ThongKeLopHocPhan from './pages/ThongKeLopHocPhan';
import ThongKeTienDayHocKi from './pages/ThongKeTienDayHocKi';
import ThongKeTienDayKhoa from './pages/ThongKeTienDayKhoa';
import ThongKeTienDayNam from './pages/ThongKeTienDayNam';
import TinhTienDay from "./pages/TinhTienDay";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={""} />
          <Route path="/khoa" element={<Khoa />} />
          <Route path="/giang-vien" element={<GiangVien />} />
          <Route path="/bang-cap" element={<BangCap />} />
          <Route path="/thong-ke-giang-vien" element={<ThongKeGiangVien />} />

          <Route path="/hoc-ki" element={<HocKi />} />
          <Route path="/hoc-phan" element={<HocPhan />} />
          <Route path="/lop-hoc-phan" element={<LopHocPhan />} />
          <Route path="/thong-ke-so-lop" element={<ThongKeLopHocPhan />} />

          <Route path="/cai-dat" element={<CaiDatHeSo />} />
          <Route path="/tinh-tien-day" element={<TinhTienDay />} />

          <Route path="/thong-ke-theo-khoa" element={<ThongKeTienDayKhoa />} />
          <Route path="/thong-ke-theo-nam" element={<ThongKeTienDayNam />} />
          <Route path="/thong-ke-theo-hoc-ki" element={<ThongKeTienDayHocKi />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
