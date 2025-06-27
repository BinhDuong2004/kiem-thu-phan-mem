using Microsoft.AspNetCore.Mvc;
using MySqlConnector;
using server.Utils;

namespace server.Controllers;

[ApiController]
[Route("[controller]")]
public class ThongKeController : ControllerBase
{
  [HttpGet("lay-tien-day-toan-truong")]
  public ActionResult LayTienDayToanTruong()
  {
    var conn = DatabaseUtils.GetConnection();
    string query = """
SELECT 
	gv.Id,
	gv.HoTen,
    gv.BangCapId,
    gv.KhoaId,
    k.TenKhoa,
    bc.TenBangCap,
    lhp.TenLopHocPhan,
    hp.SoTinChi * 15 soTietThuc,
    (
		SELECT hsbc.GiaTri
        FROM hesobangcap hsbc 
        WHERE hsbc.BangCapId = bc.Id
			AND hsbc.ThoiGianCapNhat < hk.ThoiGianBatDau
        ORDER BY hsbc.ThoiGianCapNhat DESC
        LIMIT 1
    ) heSoBangCap,
    (
		SELECT hshp.GiaTri
        FROM hesohocphan hshp
        WHERE hshp.HocPhanId = hp.Id
        ORDER BY hshp.ThoiGianCapNhat DESC
        LIMIT 1
    ) heSoHocPhan,
	(
		SELECT hsl.GiaTri
        FROM hesolophocphan hsl
        WHERE hsl.NamApDung = YEAR(hk.ThoiGianBatDau)
			AND lhp.SoSinhVienDangKi < hsl.SoSinhVienToiDa
		ORDER BY lhp.SoSinhVienDangKi DESC
        LIMIT 1
    ) heSoLop,
    (
		SELECT dmtc.GiaTri
        FROM dinhmuctietchuan dmtc
        WHERE dmtc.NamApDung = YEAR(hk.ThoiGianBatDau)
        ORDER BY dmtc.ThoiGianCapNhat DESC
        LIMIT 1
    ) dinhMucTinChi,
    hp.TenHocPhan,
    hk.TenHocKi,
    YEAR(hk.ThoiGianBatDau) namHoc,
    lhp.HocKiId
FROM giangvien gv
INNER JOIN bangcap bc ON gv.BangCapId = bc.Id
INNER JOIN khoa k ON gv.KhoaId = k.Id
LEFT JOIN lophocphan lhp ON lhp.GiangVienId = gv.Id
INNER JOIN hocki hk ON lhp.HocKiId = hk.Id
INNER JOIN hocphan hp ON lhp.HocPhanId = hp.Id
ORDER BY gv.Id;
""";
    using MySqlCommand mySqlCommand = new(query, conn);
    using var reader = mySqlCommand.ExecuteReader();

    List<object> result = [];
    while (reader.Read())
    {
      result.Add(new
      {
        Id = reader.IsDBNull(0) ? 0 : reader.GetInt32(0),
        HoTen = reader.IsDBNull(1) ? "" : reader.GetString(1),
        BangCapId = reader.IsDBNull(2) ? 0 : reader.GetInt32(2),
        KhoaId = reader.IsDBNull(3) ? 0 : reader.GetInt32(3),
        TenKhoa = reader.IsDBNull(4) ? "" : reader.GetString(4),
        TenBangCap = reader.IsDBNull(5) ? "" : reader.GetString(5),
        TenLopHocPhan = reader.IsDBNull(6) ? "" : reader.GetString(6),
        soTietThuc = reader.IsDBNull(7) ? 0 : reader.GetInt32(7),
        heSoBangCap = reader.IsDBNull(8) ? 1.0 : reader.GetDouble(8),
        heSoHocPhan = reader.IsDBNull(9) ? 1.0 : reader.GetDouble(9),
        heSoLop = reader.IsDBNull(10) ? 0 : reader.GetDouble(10),
        dinhMucTinChi = reader.IsDBNull(11) ? 1 : reader.GetInt32(11),
        TenHocPhan = reader.IsDBNull(12) ? "" : reader.GetString(12),
        TenHocKi = reader.IsDBNull(13) ? "" : reader.GetString(13),
        NamHoc = reader.IsDBNull(14) ? 0 : reader.GetUInt32(14),
        HocKiId = reader.IsDBNull(15) ? 0 : reader.GetInt32(15)
      });
    }
    return Ok(result);
  }

  [HttpGet("thong-ke-khoa")]
  public ActionResult ThongKeKhoa()
  {
    var conn = DatabaseUtils.GetConnection();
    string query = """
SELECT 
	  k.Id,
    k.MaKhoa,
    k.TenKhoa,
    COUNT(DISTINCT gv.Id) soLuongGiangVien
FROM khoa k
INNER JOIN giangvien gv ON gv.KhoaId = k.Id
GROUP BY k.Id
ORDER BY soLuongGiangVien DESC;
""";
    using MySqlCommand mySqlCommand = new(query, conn);
    using var reader = mySqlCommand.ExecuteReader();

    List<object> result = [];
    while (reader.Read())
    {
      result.Add(new
      {
        Id = reader.IsDBNull(0) ? 0 : reader.GetInt32(0),
        MaKhoa = reader.IsDBNull(1) ? "" : reader.GetString(1),
        TenKhoa = reader.IsDBNull(2) ? "" : reader.GetString(2),
        soLuongGiangVien = reader.IsDBNull(3) ? 0 : reader.GetInt32(3),
      });
    }
    return Ok(result);
  }

  [HttpGet("thong-ke-bang-cap")]
  public ActionResult ThongKeBangCap()
  {
    var conn = DatabaseUtils.GetConnection();
    string query = """
SELECT 
	  bc.Id,
    bc.MaBangCap,
    bc.TenBangCap,
    COUNT(DISTINCT gv.Id) soLuongGiangVien
FROM bangCap bc
INNER JOIN giangvien gv ON gv.BangCapId = bc.Id
GROUP BY bc.Id
ORDER BY soLuongGiangVien DESC;
""";
    using MySqlCommand mySqlCommand = new(query, conn);
    using var reader = mySqlCommand.ExecuteReader();

    List<object> result = [];
    while (reader.Read())
    {
      result.Add(new
      {
        Id = reader.IsDBNull(0) ? 0 : reader.GetInt32(0),
        MaBangCap = reader.IsDBNull(1) ? "" : reader.GetString(1),
        TenBangCap = reader.IsDBNull(2) ? "" : reader.GetString(2),
        soLuongGiangVien = reader.IsDBNull(3) ? 0 : reader.GetInt32(3),
      });
    }
    return Ok(result);
  }
  [HttpGet("thong-ke-lop-hoc-phan")]
  public ActionResult ThongKeLopHocPhan()
  {
    var conn = DatabaseUtils.GetConnection();
    string query = """
SELECT 
	  hp.Id,
    hp.MaHocPhan,
    hp.TenHocPhan,
    hp.SoTinChi,
    hk.Id,
    hk.TenHocKi,
    YEAR(hk.ThoiGianBatDau) namHoc,
    COUNT(DISTINCT lhp.Id) soLopHocPhan
FROM hocphan hp
INNER JOIN lophocphan lhp ON lhp.HocPhanId = hp.Id
INNER JOIN hocki hk ON lhp.HocKiId = hk.Id
GROUP BY hp.Id, hk.Id
ORDER BY hp.Id, soLophocPhan DESC, soTinChi
""";
    using MySqlCommand mySqlCommand = new(query, conn);
    using var reader = mySqlCommand.ExecuteReader();

    List<object> result = [];
    while (reader.Read())
    {
      result.Add(new
      {
        Id = reader.IsDBNull(0) ? 0 : reader.GetInt32(0),
        MaHocPhan = reader.IsDBNull(1) ? "" : reader.GetString(1),
        TenHocPhan = reader.IsDBNull(2) ? "" : reader.GetString(2),
        SoTinChi = reader.IsDBNull(3) ? 0 : reader.GetInt32(3),
        HocKiId = reader.IsDBNull(4) ? 0 : reader.GetInt32(4),
        TenHocKi = reader.IsDBNull(5) ? "" : reader.GetString(5),
        namHoc = reader.IsDBNull(6) ? 0 : reader.GetInt32(6),
        soLopHocPhan = reader.IsDBNull(7) ? 0 : reader.GetInt32(7),
      });
    }
    return Ok(result);
  }
}
