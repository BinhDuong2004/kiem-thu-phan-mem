import { faInfo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Select, Table } from "antd";
import { useEffect, useMemo, useState } from "react";

import { getTienDayToanTruong } from "../utils/api";

function TinhTienDay() {
    const [data, setData] = useState([]);
    const [selected, setSelected] = useState();
    const giangVienData = useMemo(
        function () {
            return data.filter((i) => i.id === selected);
        },
        [data, selected]
    );
    const allData = useMemo(
        function () {
            const temp = {};
            for (const i of data) {
                if (!temp[i.id]) temp[i.id] = { ...i, tongTienDay: 0 };
                temp[i.id].tongTienDay +=
                    i.soTietThuc *
                    (i.heSoHocPhan + i.heSoLop) *
                    i.dinhMucTinChi *
                    i.heSoBangCap;
            }
            return Object.values(temp);
        },
        [data]
    );

    useEffect(function () {
        getTienDayToanTruong().then(setData);
    }, []);

    const columns = [
        {
            title: "STT",
            dataIndex: "stt",
            key: "stt",
            render: (_, __, i) => i + 1,
        },
        { title: "Họ tên", dataIndex: "hoTen", key: "hoTen" },
        { title: "Khoa", dataIndex: "tenKhoa", key: "tenKhoa" },
        { title: "Bằng cấp", dataIndex: "tenBangCap", key: "tenBangCap" },
        {
            title: "Tiền dạy",
            render: ({
                soTietThuc,
                heSoBangCap,
                heSoHocPhan,
                heSoLop,
                dinhMucTinChi,
                tongTienDay,
            }) => {
                const tienDay =
                    soTietThuc *
                    (heSoHocPhan + heSoLop) *
                    dinhMucTinChi *
                    heSoBangCap;
                return tongTienDay.toLocaleString("vi", {
                    style: "currency",
                    currency: "VND",
                });
            },
        },
        {
            render: (_) => (
                <Button
                    size="small"
                    color="blue"
                    variant="solid"
                    icon={<FontAwesomeIcon icon={faInfo} />}
                    onClick={() => {
                        console.log(_);
                        setSelected(_.id);
                    }}
                />
            ),
        },
    ];
    const columns2 = [
        {
            title: "Lớp học phần",
            dataIndex: "tenLopHocPhan",
            key: "tenLopHocPhan",
        },
        { title: "Học phần", dataIndex: "tenHocPhan", key: "tenHocPhan" },
        { title: "Học kì", dataIndex: "tenHocKi", key: "tenHocKi" },
        {
            title: "Tiền dạy",
            render: ({
                soTietThuc,
                heSoBangCap,
                heSoHocPhan,
                heSoLop,
                dinhMucTinChi,
            }) => {
                const tienDay =
                    soTietThuc *
                    (heSoHocPhan + heSoLop) *
                    dinhMucTinChi *
                    heSoBangCap;
                return tienDay.toLocaleString("vi", {
                    style: "currency",
                    currency: "VND",
                });
            },
        },
    ];

    return (
        <div>
            <h1 className="text-2xl mb-5 font-bold uppercase">
                Quản lý tiền dạy học
            </h1>
            {/* <div className="flex justify-end mb-5 gap-2">
        <Select className="w-50" placeholder="Khoa" />
        <Select className="w-50" placeholder="Năm học" />
        <Select className="w-50" placeholder="Kì học" />
      </div> */}
            <div className="grid grid-cols-[1.5fr_1fr] gap-5">
                <Table
                    className="mb-2"
                    size="small"
                    pagination={{ pageSize: 10 }}
                    columns={columns}
                    dataSource={allData}
                />
                <div>
                    <h2 className="mb-2 font-bold uppercase">
                        Lớp học phần giảng viên giảng dạy
                    </h2>
                    <h2 className="mb-2 font-bold uppercase">
                        {allData.find((i) => i.id == selected)?.hoTen}
                    </h2>

                    <Table
                        size="small"
                        pagination={{ pageSize: 5 }}
                        columns={columns2}
                        dataSource={giangVienData}
                    />
                </div>
            </div>
        </div>
    );
}

export default TinhTienDay;
