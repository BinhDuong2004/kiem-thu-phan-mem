using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using server.Models;

namespace server.Controllers.LopHocPhanManagement;

[ApiController]
[Route("[controller]")]
public class HocPhanController(AppDbContext context) : ControllerBase
{
  readonly AppDbContext context = context;
  static List<HocPhan> GetHocPhan(AppDbContext context)
  {
    return [.. context.HocPhan];
  }

  [HttpGet]
  public ActionResult Get()
  {
    return Ok(GetHocPhan(context));
  }

  [HttpPost]
  public ActionResult Post(HocPhanInput input)
  {
    HocPhan hocPhan = new()
    {
      MaHocPhan = input.MaHocPhan,
      TenHocPhan = input.TenHocPhan,
      SoTinChi = input.SoTinChi
    };
    context.HocPhan.Add(hocPhan);
    context.SaveChanges();

    return Ok(GetHocPhan(context));
  }

  [HttpPut("{id}")]
  public async Task<ActionResult> Put(int id, HocPhanInput input)
  {
    HocPhan? hocPhan = context.HocPhan.FirstOrDefault(i => i.Id == id);
    if (hocPhan == null) return NotFound();

    hocPhan.MaHocPhan = input.MaHocPhan;
    hocPhan.TenHocPhan = input.TenHocPhan;
    hocPhan.SoTinChi = input.SoTinChi;

    await context.SaveChangesAsync();

    return Ok(GetHocPhan(context));
  }

  [HttpDelete("{id}")]
  public async Task<ActionResult> DeleHttpDelete(int id)
  {
    HocPhan? hocPhan = context.HocPhan.FirstOrDefault(i => i.Id == id);
    if (hocPhan == null) return NotFound();

    context.HocPhan.Remove(hocPhan);
    await context.SaveChangesAsync();
    return Ok(GetHocPhan(context));
  }
}

public record HocPhanInput
{
  public string MaHocPhan { get; set; } = null!;
  public string TenHocPhan { get; set; } = null!;
  public int SoTinChi { get; set; }
}