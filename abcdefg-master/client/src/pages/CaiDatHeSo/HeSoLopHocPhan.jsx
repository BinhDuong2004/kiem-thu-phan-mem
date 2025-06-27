import {
    faEdit,
    faPlus,
    faSave,
    faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    Button,
    DatePicker,
    InputNumber,
    message,
    Popconfirm,
    Table,
} from "antd";
import axios from "axios";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

import { getHeSoLopHocPhan } from "../../utils/api";

const url = "http://localhost:5096/HeSoLopHocPhan";
async function createHeSoLopHocPhan({ giaTri, namApDung, soSinhVienToiDa }) {
    const result = await axios.post(url, {
        giaTri,
        namApDung,
        soSinhVienToiDa,
    });
    return result.data;
}
async function updateHeSoLopHocPhan({
    id,
    giaTri,
    namApDung,
    soSinhVienToiDa,
}) {
    const result = await axios.put(`${url}/${id}`, {
        giaTri,
        namApDung,
        soSinhVienToiDa,
    });
    return result.data;
}
async function deleteHeSoLopHocPhan({ id }) {
    const result = await axios.delete(`${url}/${id}`);
    return result.data;
}

function CaiDatDinhMuc() {
    const [data, setData] = useState([]);

    const [form, setForm] = useState({
        giaTri: undefined,
        namApDung: dayjs(),
        soSinhVienToiDa: 0,
    });
    const [updateForm, setUpdateForm] = useState({
        id: -1,
        giaTri: undefined,
        namApDung: dayjs(),
        soSinhVienToiDa: 0,
    });
    useEffect(
        function () {
            getHeSoLopHocPhan(form.namApDung?.year()).then((data) =>
                setData(data.map((i, j) => ({ ...i, key: j })))
            );
        },
        [form.namApDung]
    );

    const columns = [
        {
            title: "Số sinh viên",
            dataIndex: "soSinhVienToiDa",
            key: "soSinhVienToiDa",
            render: (_, entry) =>
                updateForm.id == entry.id ? (
                    <InputNumber
                        style={{ width: "100%" }}
                        placeholder="Số sinh viên"
                        value={updateForm.soSinhVienToiDa}
                        onChange={(e) =>
                            setUpdateForm({ ...updateForm, soSinhVienToiDa: e })
                        }
                    />
                ) : (
                    `<${_}`
                ),
        },
        {
            title: "Giá trị định mức",
            dataIndex: "giaTri",
            key: "giaTri",
            render: (_, entry) =>
                updateForm.id == entry.id ? (
                    <InputNumber
                        style={{ width: "100%" }}
                        placeholder="Giá trị định mức"
                        min={-1}
                        max={2}
                        step={0.1}
                        value={updateForm.giaTri}
                        onChange={(e) =>
                            setUpdateForm({ ...updateForm, giaTri: e })
                        }
                    />
                ) : (
                    _
                ),
        },
        {
            title: "Năm áp dụng",
            dataIndex: "namApDung",
            key: "namApDung",
            render: (_) => (_ == 0 ? "Mặc định" : _),
        },
        {
            title: "Thời gian cập nhật",
            dataIndex: "thoiGianCapNhat",
            key: "thoiGianCapNhat",
            render: (_) => dayjs(_).format("DD/MM/YYYY HH:mm"),
        },
        {
            render: (_) => (
                <div className="flex gap-2">
                    {_.id == updateForm.id ? (
                        <Button
                            color="blue"
                            variant="solid"
                            icon={<FontAwesomeIcon icon={faSave} />}
                            onClick={async () => {
                                const input = {
                                    id: updateForm.id,
                                    giaTri: updateForm.giaTri,
                                    namApDung: updateForm.namApDung.year(),
                                    soSinhVienToiDa: updateForm.soSinhVienToiDa,
                                };
                                if (input.giaTri == undefined)
                                    return message.error(
                                        "Giá trị không được để trống"
                                    );

                                await updateHeSoLopHocPhan(input)
                                    .then((data) => {
                                        setData(
                                            data.map((i, j) => ({
                                                ...i,
                                                key: j,
                                            }))
                                        );
                                        message.info("Cập nhật thành công!");
                                    })
                                    .catch((e) =>
                                        message.error("Cập nhật thất bại!")
                                    );
                                setUpdateForm({
                                    id: 0,
                                    giaTri: undefined,
                                    namApDung: dayjs(),
                                    soSinhVienToiDa: 0,
                                });
                            }}
                        />
                    ) : (
                        <Button
                            color="blue"
                            variant="solid"
                            icon={<FontAwesomeIcon icon={faEdit} />}
                            onClick={async () =>
                                setUpdateForm({
                                    id: _.id,
                                    giaTri: _.giaTri,
                                    namApDung: dayjs(
                                        new Date(_.namApDung, 0, 1)
                                    ),
                                    soSinhVienToiDa: _.soSinhVienToiDa,
                                })
                            }
                        />
                    )}

                    <Popconfirm
                        title="Bạn có chắc là xóa hệ số lớp học phần này không?"
                        okText="Xóa"
                        cancelText="Hủy"
                        onConfirm={async () => {
                            const result = await deleteHeSoLopHocPhan({
                                id: _.id,
                            })
                                .then((data) => {
                                    message.info("Xóa thành công!");
                                    return data;
                                })
                                .catch((e) => {
                                    message.error("Xóa thất bại!");
                                    return e;
                                });
                            setData(result.map((i, j) => ({ ...i, key: j })));
                        }}
                    >
                        <Button
                            disabled={
                                data.length == 1 || _.soSinhVienToiDa == 150
                            }
                            color="red"
                            variant="solid"
                            icon={<FontAwesomeIcon icon={faTrash} />}
                        />
                    </Popconfirm>
                </div>
            ),
        },
    ];

    return (
        <div>
            <div className="">
                <h1 className="text-2xl font-bold uppercase mb-5">
                    Cài đặt hệ số lớp học phần
                </h1>
            </div>

            <form className="flex gap-5 mb-5">
                <DatePicker
                    style={{ width: "100%" }}
                    picker="year"
                    value={form.namApDung}
                    onChange={(e) => setForm({ ...form, namApDung: e })}
                />
                <InputNumber
                    style={{ width: "100%" }}
                    placeholder="Hệ số"
                    min={-1}
                    max={2}
                    step={0.1}
                    value={form.giaTri}
                    onChange={(e) => setForm({ ...form, giaTri: e })}
                />
                <InputNumber
                    style={{ width: "100%" }}
                    placeholder="Số sinh viên"
                    value={form.soSinhVienToiDa}
                    onChange={(e) => setForm({ ...form, soSinhVienToiDa: e })}
                />

                <Button
                    className=""
                    variant="solid"
                    color="green"
                    icon={<FontAwesomeIcon icon={faPlus} />}
                    onClick={() => {
                        const input = {
                            giaTri: form.giaTri,
                            namApDung: form.namApDung.year(),
                            soSinhVienToiDa: form.soSinhVienToiDa,
                        };
                        if (input.giaTri == undefined)
                            return message.error(
                                "Giá trị không được để trống!"
                            );
                        if (input.soSinhVienToiDa == undefined)
                            return message.error(
                                "Số sinh viên không được để trống!"
                            );

                        createHeSoLopHocPhan(input)
                            .then((data) => {
                                setData(data.map((i, j) => ({ ...i, key: j })));
                                message.info("Thêm thành công!");
                            })
                            .catch((e) => message.error("Thêm thất bại!"));
                        setForm((e) => ({
                            ...e,
                            giaTri: undefined,
                            soSinhVienToiDa: undefined,
                        }));
                    }}
                >
                    Thêm
                </Button>
            </form>
            <Table size="small" columns={columns} dataSource={data} />
        </div>
    );
}

export default CaiDatDinhMuc;
