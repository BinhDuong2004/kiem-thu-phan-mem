import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, DatePicker, InputNumber, message, Table } from "antd";
import axios from "axios";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

import { getDinhMuc } from "../../utils/api";

const url = "http://localhost:5096/DinhMuc"
async function createDinhMuc({ giaTri, namApDung, }) {
  const result = await axios.post(url, { giaTri, namApDung, })
  return result.data
}

function CaiDatDinhMuc() {
  const [data, setData] = useState([])
  const [form, setForm] = useState({ giaTri: undefined, namApDung: dayjs() })

  useEffect(function () {
    getDinhMuc().then(data => setData(data.map((i, j) => ({ ...i, key: j }))))
  }, [])

  const columns = [
    { title: 'Giá trị định mức', dataIndex: 'giaTri', key: 'giaTri', },
    { title: 'Năm áp dụng', dataIndex: 'namApDung', key: 'namApDung', render: _ => _ == 0 ? 'Mặc định' : _ },
    { title: 'Thời gian cập nhật', dataIndex: 'thoiGianCapNhat', key: 'thoiGianCapNhat', render: _ => dayjs(_).format('DD/MM/YYYY HH:mm') },
  ];
  return (
    <div>
      <div className="flex gap-5">
        <h1 className="text-2xl font-bold uppercase mb-5">Cài đặt định mức</h1>
      </div>

      <form className="flex gap-5 mb-5">
        <DatePicker style={{ width: '100%' }} picker="year"
          value={form.namApDung}
          onChange={e => setForm({ ...form, namApDung: e })} />
        <InputNumber style={{ width: '100%' }} placeholder="Giá trị định mức"
          value={form.giaTri}
          onChange={(e) => setForm({ ...form, giaTri: e })} />

        <Button className="" variant="solid" color="green" icon={<FontAwesomeIcon icon={faPlus} />}
          onClick={() => {
            const input = {
              giaTri: form.giaTri,
              namApDung: form.namApDung.year(),
            }
            if (input.giaTri == undefined) return message.error("Giá trị không được để trống!")
            if (input.namApDung == undefined) return message.error("Năm áp dụng không được để trống!")

            createDinhMuc(input).then(data => {
              setData(data.map((i, j) => ({ ...i, key: j })))
              message.info("Thêm thành công!")
            }).catch(e => {
              message.error("Thêm thất bại!")
            })
            setForm({ giaTri: undefined, namApDung: undefined })
          }}>Thêm</Button>
      </form>
      <Table size="small" columns={columns} dataSource={data} />
    </div>
  )
}

export default CaiDatDinhMuc