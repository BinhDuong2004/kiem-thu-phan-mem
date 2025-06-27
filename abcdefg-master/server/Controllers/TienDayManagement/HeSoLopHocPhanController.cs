using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using server.Models;

namespace server.Controllers.TienDayManagement;

[ApiController]
[Route("[controller]")]
public class HeSoLopHocPhanController(AppDbContext context) : ControllerBase
{
  readonly AppDbContext context = context;
  static List<object> GetHeSoLopHocPhan(AppDbContext context, int year)
  {
    var result =
    from c in context.HeSoLopHocPhan
    orderby c.NamApDung descending, c.SoSinhVienToiDa
    where c.NamApDung == year
    select c;
    return [.. result];
  }

  [HttpGet("{year}")]
  public async Task<ActionResult> GetAsync(int year)
  {
    var result = GetHeSoLopHocPhan(context, year);
    if (result.Count > 0) return Ok(GetHeSoLopHocPhan(context, year));

    HeSoLopHocPhan heSoLopHocPhan = new()
    {
      GiaTri = 1.0,
      NamApDung = year,
      SoSinhVienToiDa = 150,
      ThoiGianCapNhat = DateTime.MinValue
    };

    context.HeSoLopHocPhan.Add(heSoLopHocPhan);
    await context.SaveChangesAsync();

    return Ok(GetHeSoLopHocPhan(context, year));
  }

  [HttpPost]
  public async Task<ActionResult> Post(HeSoLopInput input)
  {
    HeSoLopHocPhan heSoLopHocPhan = new()
    {
      GiaTri = input.GiaTri,
      NamApDung = input.NamApDung,
      SoSinhVienToiDa = input.SoSinhVienToiDa,
      ThoiGianCapNhat = DateTime.UtcNow
    };

    context.HeSoLopHocPhan.Add(heSoLopHocPhan);
    await context.SaveChangesAsync();

    return Ok(GetHeSoLopHocPhan(context, input.NamApDung));
  }

  [HttpPut("{id}")]
  public ActionResult Put(int id, HeSoLopInput input)
  {
    HeSoLopHocPhan? heSoLopHocPhan = context.HeSoLopHocPhan.FirstOrDefault(i => i.Id == id);
    if (heSoLopHocPhan == null) return NotFound();

    heSoLopHocPhan.GiaTri = input.GiaTri;
    heSoLopHocPhan.NamApDung = input.NamApDung;
    heSoLopHocPhan.SoSinhVienToiDa = input.SoSinhVienToiDa;
    heSoLopHocPhan.ThoiGianCapNhat = DateTime.UtcNow;
    Console.WriteLine(input.NamApDung);
    context.SaveChanges();
    return Ok(GetHeSoLopHocPhan(context, input.NamApDung));
  }

  [HttpDelete("{id}")]
  public ActionResult Delete(int id)
  {
    HeSoLopHocPhan? heSoLopHocPhan = context.HeSoLopHocPhan.FirstOrDefault(i => i.Id == id);
    if (heSoLopHocPhan == null) return NotFound();

    int nam = heSoLopHocPhan.NamApDung;
    context.HeSoLopHocPhan.Remove(heSoLopHocPhan);
    context.SaveChanges();
    return Ok(GetHeSoLopHocPhan(context, nam));
  }
}

public record HeSoLopInput
{
  public double GiaTri { get; set; }
  public int SoSinhVienToiDa { get; set; }
  public int NamApDung { get; set; }
}