import { Outlet } from "react-router"

import Sidebar from "./Sidebar"

function Layout() {
  return (
    <div className="w-screen  h-screen grid grid-cols-[1fr_5fr]" style={{ backgroundColor: "#345A80", }}>
      <Sidebar />

      <div className="my-15 p-5 rounded-l-[50px] overflow-y-auto" style={{ backgroundColor: "#CFDBF3" }}>
        <Outlet />
      </div>
    </div>
  )
}

export default Layout