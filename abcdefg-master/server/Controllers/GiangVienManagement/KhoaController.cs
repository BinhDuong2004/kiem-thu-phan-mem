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
public class KhoaController(AppDbContext context) : ControllerBase
{
  readonly AppDbContext context = context;
  private static List<object> GetKhoa()
  {
    // var result =
    using var connection = DatabaseUtils.GetConnection();
    string query = """
SELECT 
	khoa.id,
  khoa.makhoa,
  khoa.tenkhoa,
  khoa.tenviettat,
  khoa.motanhiemvu
FROM khoa 
ORDER BY khoa.id;
""";
    using var command = new MySqlCommand(query, connection);
    using var reader = command.ExecuteReader();

    List<object> result = [];
    while (reader.Read())
    {
      result.Add(new
      {
        id = reader.GetInt32(0),
        maKhoa = reader.IsDBNull(1) ? "" : reader.GetString(1),
        tenKhoa = reader.IsDBNull(2) ? "" : reader.GetString(2),
        tenVietTat = reader.IsDBNull(3) ? "" : reader.GetString(3),
        moTaNhiemVu = reader.IsDBNull(4) ? "" : reader.GetString(4),
      });
    }
    return result;
  }

  [HttpGet]
  public ActionResult Get()
  {
    return Ok(GetKhoa());
  }
  [HttpPost]
  public async Task<ActionResult> Post(KhoaInput input)
  {
    Khoa khoa = new()
    {
      MaKhoa = input.MaKhoa,
      MoTaNhiemVu = input.MoTaNhiemVu,
      TenKhoa = input.TenKhoa,
      TenVietTat = input.TenVietTat
    };
    context.Khoa.Add(khoa);
    await context.SaveChangesAsync();

    return Ok(GetKhoa());
  }
  [HttpPut("{id}")]
  public async Task<ActionResult> PutAsync(int id, KhoaInput input)
  {
    Khoa? khoa = context.Khoa.FirstOrDefault(k => k.Id == id);
    if (khoa == null) return NotFound();

    khoa.MoTaNhiemVu = input.MoTaNhiemVu;
    khoa.TenKhoa = input.TenKhoa;
    khoa.TenVietTat = input.TenVietTat;
    await context.SaveChangesAsync();

    return Ok(GetKhoa());
  }
  [HttpDelete("{id}")]
  public async Task<ActionResult> Delete(int id)
  {
    Khoa? khoa = context.Khoa.FirstOrDefault(k => k.Id == id);
    if (khoa == null) return NotFound();

    context.Khoa.Remove(khoa);
    await context.SaveChangesAsync();
    return Ok(GetKhoa());
  }
}

public record KhoaInput
{
  public string? MaKhoa { get; set; }
  public string? TenKhoa { get; set; }
  public string? TenVietTat { get; set; }
  public string? MoTaNhiemVu { get; set; }
}