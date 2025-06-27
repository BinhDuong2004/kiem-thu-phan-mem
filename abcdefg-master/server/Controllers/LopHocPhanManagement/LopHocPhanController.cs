using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Storage;
using MySqlConnector;
using server.Models;
using server.Utils;

namespace server.Controllers.LopHocPhanManagement;

[ApiController]
[Route("[controller]")]
public class LopHocPhanController(AppDbContext context) : ControllerBase
{
  readonly AppDbContext context = context;
  static List<object> GetHocKi(AppDbContext context)
  {
    using var connection = DatabaseUtils.GetConnection();
    string query = """
SELECT 
	  lhp.id,
    lhp.tenlophocphan,
    lhp.SoSinhVienDangKi,
    lhp.HocKiId,
    hk.TenHocKi,
    lhp.HocPhanId,
    hp.TenHocPhan,
    lhp.giangvienid,
    gv.HoTen
FROM lophocphan lhp 
INNER JOIN hocki hk ON lhp.hockiid = hk.id
INNER JOIN hocphan hp ON lhp.hocphanid = hp.id
LEFT JOIN giangvien gv ON lhp.giangvienid = gv.id;
""";
    using var command = new MySqlCommand(query, connection);
    using var reader = command.ExecuteReader();

    List<object> result = [];
    while (reader.Read())
    {
      result.Add(new
      {
        Id = reader.IsDBNull(0) ? 0 : reader.GetInt32(0),
        TenLopHocPhan = reader.IsDBNull(1) ? "" : reader.GetString(1),
        SoSinhVienDangKi = reader.IsDBNull(2) ? 0 : reader.GetInt32(2),
        HocKiId = reader.IsDBNull(3) ? 0 : reader.GetInt32(3),
        TenHocKi = reader.IsDBNull(4) ? "" : reader.GetString(4),
        HocPhanId = reader.IsDBNull(5) ? 0 : reader.GetInt32(5),
        TenHocPhan = reader.IsDBNull(6) ? "" : reader.GetString(6),
        GiangVienId = reader.IsDBNull(7) ? 0 : reader.GetInt32(7),
        HoTen = reader.IsDBNull(8) ? "" : reader.GetString(8)
      });
    }

    return result;
  }
  [HttpGet]
  public ActionResult Get()
  {
    return Ok(GetHocKi(context));
  }

  [HttpPost]
  public async Task<ActionResult> Post(LopHocPhanInput input)
  {
    Random rand = new();
    LopHocPhan lopHocPhan = new()
    {
      TenLopHocPhan = input.TenLopHocPhan,
      SoSinhVienDangKi = rand.Next(5, 150),
      HocPhanId = input.HocPhanId,
      HocKiId = input.HocKiId,
      GiangVienId = input.GiangVienId
    };
    context.LopHocPhan.Add(lopHocPhan);
    await context.SaveChangesAsync();

    return Ok(GetHocKi(context));
  }

  [HttpPost("multiple")]
  public async Task<ActionResult> Post(MultipleLopHocPhanInput input)
  {
    Random rand = new();
    List<LopHocPhan> lopHocPhan = [];
    for (int i = 0; i < input.SoLuong; ++i)
    {
      lopHocPhan.Add(new()
      {
        TenLopHocPhan = $"{input.TenLopHocPhan}- N{i.ToString().PadLeft(2, '0')}",
        SoSinhVienDangKi = rand.Next(5, 150),
        HocPhanId = input.HocPhanId,
        HocKiId = input.HocKiId,
        GiangVienId = input.GiangVienId
      });
    }

    context.LopHocPhan.AddRange(lopHocPhan);
    await context.SaveChangesAsync();

    return Ok(GetHocKi(context));
  }


  [HttpPut("{id}")]
  public async Task<ActionResult> Put(int id, LopHocPhanInput input)
  {
    LopHocPhan? lopHocPhan = context.LopHocPhan.FirstOrDefault(i => i.Id == id);
    if (lopHocPhan == null) return NotFound();

    lopHocPhan.TenLopHocPhan = input.TenLopHocPhan;
    lopHocPhan.HocPhanId = input.HocPhanId;
    lopHocPhan.HocKiId = input.HocKiId;
    lopHocPhan.GiangVienId = input.GiangVienId;

    await context.SaveChangesAsync();
    return Ok(GetHocKi(context));
  }

  [HttpDelete("{id}")]
  public async Task<ActionResult> DeleHttpDelete(int id)
  {
    LopHocPhan? lopHocPhan = context.LopHocPhan.FirstOrDefault(i => i.Id == id);
    if (lopHocPhan == null) return NotFound();

    context.LopHocPhan.Remove(lopHocPhan);
    await context.SaveChangesAsync();
    return Ok(GetHocKi(context));
  }
}

public record MultipleLopHocPhanInput
{
  public string TenLopHocPhan { get; set; } = null!;
  public int? HocPhanId { get; set; }
  public int? HocKiId { get; set; }
  public int? GiangVienId { get; set; }
  public int SoLuong { get; set; }
}

public record LopHocPhanInput
{
  public string TenLopHocPhan { get; set; } = null!;

  public int? HocPhanId { get; set; }
  public int? HocKiId { get; set; }
  public int? GiangVienId { get; set; }
}