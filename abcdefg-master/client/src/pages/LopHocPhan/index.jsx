import { Tabs } from "antd"
import QuanLyLop from "./QuanLyLop"
import PhanCongGiangVien from "./PhanCongGiangVien"
import { useReducer } from "react"
import { DataContext, defaultValue, reducer } from "./context"

function LopHocPhan() {
  const [state, dispatch] = useReducer(reducer, defaultValue)
  return (
    <DataContext.Provider value={[state, dispatch]}>
      <Tabs defaultActiveKey="1"
        items={[
          {
            key: '1', label: <h1 className="font-bold"> Lớp học phần</h1>,
            children: <QuanLyLop />,
          },
          {
            key: '2', label: <h1 className="font-bold"> Phân công giảng viên</h1>,
            children: <PhanCongGiangVien />,
          },
        ]} />
    </DataContext.Provider>
  )
}

export default LopHocPhan