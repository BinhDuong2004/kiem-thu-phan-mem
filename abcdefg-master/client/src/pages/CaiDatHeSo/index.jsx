import CaiDatDinhMuc from "./CaiDatDinhMuc"
import HeSoLopHocPhan from "./HeSoLopHocPhan"

function CaiDatHeSo() {
  return (
    <div className="grid h-full grid-cols-[1fr_auto_1fr] gap-5 grow">
      <CaiDatDinhMuc />
      <div className="bg-white w-0.5 h-full" />
      <HeSoLopHocPhan />
    </div >
  )
}

export default CaiDatHeSo