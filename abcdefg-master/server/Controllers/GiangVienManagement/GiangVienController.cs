using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MySqlConnector;
using server.Models;
using server.Utils;

namespace server.Controllers.GiangVienManagement;

[ApiController]
[Route("[controller]")]
public class GiangVienController(AppDbContext context) : ControllerBase
{
  readonly AppDbContext context = context;
  private static List<object> GetBangCap()
  {
    // var result =
    using var connection = DatabaseUtils.GetConnection();
    string query = """
SELECT 
  gv.Id,
  gv.magiangvien,
  gv.HoTen,
  gv.DienThoai,
  gv.Email,
  gv.KhoaId,
  k.tenkhoa,
  gv.BangCapId,
  bc.tenbangcap,
  gv.ngaySinh
FROM giangVien gv
INNER JOIN khoa k ON k.id = gv.KhoaId
INNER JOIN bangcap bc ON bc.id = gv.bangcapid;
""";
    using var command = new MySqlCommand(query, connection);
    using var reader = command.ExecuteReader();

    List<object> result = [];
    while (reader.Read())
    {
      result.Add(new
      {
        id = reader.IsDBNull(0) ? -1 : reader.GetInt32(0),
        maGiangVien = reader.IsDBNull(1) ? "" : reader.GetString(1),
        hoTen = reader.IsDBNull(2) ? "" : reader.GetString(2),
        dienThoai = reader.IsDBNull(3) ? "" : reader.GetString(3),
        email = reader.IsDBNull(4) ? "" : reader.GetString(4),
        khoaId = reader.IsDBNull(5) ? -1 : reader.GetInt32(5),
        tenKhoa = reader.IsDBNull(6) ? "" : reader.GetString(6),
        bangCapId = reader.IsDBNull(7) ? -1 : reader.GetInt32(7),
        tenBangCap = reader.IsDBNull(8) ? "" : reader.GetString(8),
        ngaySinh = reader.IsDBNull(9) ? DateTime.MinValue : reader.GetDateTime(9),
      });
    }
    return result;
  }

  [HttpGet]
  public ActionResult Get()
  {
    return Ok(GetBangCap());
  }
  [HttpPost]
  public async Task<ActionResult> Post(GiangVienInput input)
  {
    Console.WriteLine(input.DienThoai);
    GiangVien giangVien = new()
    {
      MaGiangVien = input.MaGiangVien,
      HoTen = input.HoTen,
      DienThoai = input.DienThoai,
      NgaySinh = input.NgaySinh,
      Email = input.Email,
      KhoaId = input.KhoaId,
      BangCapId = input.BangCapId
    };
    context.GiangVien.Add(giangVien);
    await context.SaveChangesAsync();

    return Ok(GetBangCap());
  }
  [HttpPut("{id}")]
  public async Task<ActionResult> PutAsync(int id, GiangVienInput input)
  {
    GiangVien? giangVien = context.GiangVien.FirstOrDefault(i => i.Id == id);
    if (giangVien == null) return NotFound();

    giangVien.MaGiangVien = input.MaGiangVien;
    giangVien.HoTen = input.HoTen;
    giangVien.DienThoai = input.DienThoai;
    giangVien.Email = input.Email;
    giangVien.NgaySinh = input.NgaySinh;
    giangVien.KhoaId = input.KhoaId;
    giangVien.BangCapId = input.BangCapId;

    await context.SaveChangesAsync();
    return Ok(GetBangCap());
  }
  [HttpDelete("{id}")]
  public async Task<ActionResult> Delete(int id)
  {
    GiangVien? giangVien = context.GiangVien.FirstOrDefault(i => i.Id == id);
    if (giangVien == null) return NotFound();
    context.Remove(giangVien);
    await context.SaveChangesAsync();

    return Ok(GetBangCap());
  }
}

public record GiangVienInput
{
  public string MaGiangVien { get; set; } = null!;
  public string HoTen { get; set; } = null!;
  public string DienThoai { get; set; } = null!;
  public DateTime NgaySinh { get; set; }
  public string Email { get; set; } = null!;
  public int KhoaId { get; set; }
  public int BangCapId { get; set; }
}