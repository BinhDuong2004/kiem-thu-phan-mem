using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MySqlConnector;
using server.Models;
using server.Utils;

namespace server.Controllers.GiangVienManagement;

[ApiController]
[Route("[controller]")]
public class BangCapController(AppDbContext context) : ControllerBase
{
  readonly AppDbContext context = context;
  private static List<object> GetBangCap()
  {
    // var result =
    using var connection = DatabaseUtils.GetConnection();
    string query = """
SELECT 
	bc.id,
  bc.mabangcap,
  bc.tenbangcap,
  bc.tenviettat,
  (
    SELECT GiaTri
    FROM hesobangcap hsbc
    WHERE BangCapId = bc.id
    ORDER BY hsbc.ThoiGianCapNhat DESC
    LIMIT 1
  ) heSo,
    (
    SELECT thoigiancapnhat
    FROM hesobangcap hsbc
    WHERE BangCapId = bc.id
    ORDER BY hsbc.ThoiGianCapNhat DESC
    LIMIT 1
  ) thoigiancapnhat
FROM bangcap bc;
""";
    using var command = new MySqlCommand(query, connection);
    using var reader = command.ExecuteReader();

    List<object> result = [];
    while (reader.Read())
    {
      result.Add(new
      {
        id = reader.GetInt32(0),
        maBangCap = reader.IsDBNull(1) ? "" : reader.GetString(1),
        tenBangCap = reader.IsDBNull(2) ? "" : reader.GetString(2),
        tenVietTat = reader.IsDBNull(3) ? "" : reader.GetString(3),
        heSo = reader.IsDBNull(4) ? 0 : reader.GetDouble(4),
        thoiGianCapNhat = reader.IsDBNull(5) ? DateTime.MinValue : reader.GetDateTime(5),
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
  public async Task<ActionResult> Post(BangCapInput input)
  {
    int count = await context.BangCap.CountAsync();
    BangCap bangCap = new()
    {
      TenBangCap = input.TenBangCap,
      TenVietTat = input.TenVietTat,
    };
    bangCap.MaBangCap = $"BC_{bangCap.Id}";
    context.BangCap.Add(bangCap);
    await context.SaveChangesAsync();

    HeSoBangCap heSoBangCap = new()
    {
      BangCapId = bangCap.Id,
      GiaTri = input.HeSo,
      ThoiGianCapNhat = DateTime.UtcNow,
    };
    context.HeSoBangCap.Add(heSoBangCap);
    await context.SaveChangesAsync();

    return Ok(GetBangCap());
  }
  [HttpPut("{id}")]
  public async Task<ActionResult> PutAsync(int id, BangCapInput input)
  {
    BangCap? bangCap = await context.BangCap.FirstOrDefaultAsync(b => b.Id == id);
    if (bangCap == null) return NotFound();

    bangCap.TenBangCap = input.TenBangCap;
    bangCap.TenVietTat = input.TenVietTat;

    HeSoBangCap heSoBangCap = new()
    {
      BangCapId = bangCap.Id,
      GiaTri = input.HeSo,
      ThoiGianCapNhat = DateTime.UtcNow,
    };
    context.HeSoBangCap.Add(heSoBangCap);
    await context.SaveChangesAsync();

    return Ok(GetBangCap());
  }
  [HttpDelete("{id}")]
  public async Task<ActionResult> Delete(int id)
  {
    BangCap? bangCap = context.BangCap.FirstOrDefault(b => b.Id == id);
    if (bangCap == null) return NotFound();

    context.BangCap.Remove(bangCap);
    await context.SaveChangesAsync();
    return Ok(GetBangCap());
  }
}

public record BangCapInput
{
  public string? TenBangCap { get; set; }
  public string? TenVietTat { get; set; }
  public double HeSo { get; set; }
}