using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using server.Models;

namespace server.Controllers.LopHocPhanManagement;

[ApiController]
[Route("[controller]")]
public class HocKiController(AppDbContext context) : ControllerBase

{
  readonly AppDbContext context = context;
  static List<HocKi> GetHocKi(AppDbContext context)
  {
    return [.. context.HocKi];
  }

  [HttpGet]
  public ActionResult Get()
  {
    return Ok(GetHocKi(context));
  }

  [HttpPost]
  public async Task<ActionResult> Post(HocKiInput input)
  {
    HocKi hocKi = new()
    {
      TenHocKi = input.TenHocKi,
      ThoiGianBatDau = input.ThoiGianBatDau,
      ThoiGianKetThuc = input.ThoiGianKetThuc,
    };
    context.HocKi.Add(hocKi);
    await context.SaveChangesAsync();
    return Ok(GetHocKi(context));
  }

  [HttpPut("{id}")]
  public async Task<ActionResult> Put(int id, HocKiInput input)
  {
    HocKi? hocKi = context.HocKi.FirstOrDefault(i => i.Id == id);
    if (hocKi == null) return NotFound();

    hocKi.TenHocKi = input.TenHocKi;
    hocKi.ThoiGianBatDau = input.ThoiGianBatDau;
    hocKi.ThoiGianKetThuc = input.ThoiGianKetThuc;

    await context.SaveChangesAsync();
    return Ok(GetHocKi(context));
  }

  [HttpDelete("{id}")]
  public async Task<ActionResult> DeleHttpDelete(int id)
  {
    HocKi? hocki = context.HocKi.FirstOrDefault(i => i.Id == id);
    if (hocki == null) return NotFound();

    context.HocKi.Remove(hocki);
    await context.SaveChangesAsync();
    return Ok(GetHocKi(context));
  }
}

public record HocKiInput
{
  public string TenHocKi { get; set; } = null!;
  public DateTime ThoiGianBatDau { get; set; }
  public DateTime ThoiGianKetThuc { get; set; }
}