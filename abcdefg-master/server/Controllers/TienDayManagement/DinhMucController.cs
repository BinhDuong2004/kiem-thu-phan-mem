using System.Net;
using Microsoft.AspNetCore.Mvc;
using server.Models;

namespace server.Controllers.TienDayManagement;

[ApiController]
[Route("[controller]")]
public class DinhMucController(AppDbContext context) : ControllerBase
{
  readonly AppDbContext context = context;
  static List<object> GetDinhMuc(AppDbContext context)
  {
    var result =
      from dm in context.DinhMucTietChuan
      orderby dm.NamApDung descending
      select dm;
    return [.. result];
  }

  [HttpGet]
  public ActionResult Get()
  {
    var result = GetDinhMuc(context);
    if (result.Count > 0) return Ok(result);

    context.DinhMucTietChuan.Add(new()
    {
      GiaTri = 1000000,
      NamApDung = 0
    });
    context.SaveChanges();

    return Ok(GetDinhMuc(context));
  }
  [HttpPost]
  public ActionResult Post(DinhMucInput input)
  {
    DinhMucTietChuan dinhMucTietChuan = new()
    {
      GiaTri = input.GiaTri,
      NamApDung = input.NamApDung,
      ThoiGianCapNhat = DateTime.UtcNow
    };
    context.DinhMucTietChuan.Add(dinhMucTietChuan);
    context.SaveChanges();
    return Ok(GetDinhMuc(context));
  }

  [HttpPut("{id}")]
  public ActionResult Put(int id, DinhMucInput input)
  {
    DinhMucTietChuan? dinhMucTiet = context.DinhMucTietChuan.FirstOrDefault(i => i.Id == id);
    if (dinhMucTiet == null) return NotFound();

    dinhMucTiet.GiaTri = input.GiaTri;
    dinhMucTiet.NamApDung = input.NamApDung;
    context.SaveChanges();

    return Ok(GetDinhMuc(context));
  }

  [HttpDelete("{id}")]
  public ActionResult Delete(int id)
  {
    DinhMucTietChuan? dinhMucTiet = context.DinhMucTietChuan.FirstOrDefault(i => i.Id == id);
    if (dinhMucTiet == null) return NotFound();

    context.DinhMucTietChuan.Remove(dinhMucTiet);
    context.SaveChanges();
    return Ok(GetDinhMuc(context));
  }
}

public record DinhMucInput
{
  public ulong GiaTri { get; set; }
  public int NamApDung { get; set; }
}