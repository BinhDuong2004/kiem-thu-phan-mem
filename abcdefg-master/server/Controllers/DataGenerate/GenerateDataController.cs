using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Models;

namespace server.Controllers.DataGenerate;

[ApiController]
[Route("[controller]")]
public class GenerateDataController(AppDbContext context) : ControllerBase
{
  readonly AppDbContext context = context;

  [HttpPost("tao-uc1")]
  public async Task<ActionResult> TaoUc1()
  {
    var bangCap = BangCap.Generate();
    var khoa = Khoa.Generate(10);

    await context.BangCap.AddRangeAsync(bangCap);
    await context.Khoa.AddRangeAsync(khoa);
    await context.SaveChangesAsync();

    bangCap = await context.BangCap.ToListAsync();
    khoa = await context.Khoa.ToListAsync();
    var heSoBangCap = HeSoBangCap.Generate(1000, bangCap);
    await context.HeSoBangCap.AddRangeAsync(heSoBangCap);

    var giangVien = GiangVien.Generate(100, khoa, bangCap);
    await context.GiangVien.AddRangeAsync(giangVien);
    await context.SaveChangesAsync();
    return Ok();
  }

  [HttpPost("tao-uc2")]
  public async Task<ActionResult> TaoUc2()
  {
    var hocPhan = HocPhan.Generate(100);
    var hocKi = HocKi.Generate(2000, 30);
    await context.HocPhan.AddRangeAsync(hocPhan);
    await context.HocKi.AddRangeAsync(hocKi);
    await context.SaveChangesAsync();

    hocPhan = await context.HocPhan.ToListAsync();
    hocKi = await context.HocKi.ToListAsync();
    var giangVien = await context.GiangVien.ToListAsync();

    var heSoHocPhan = HeSoHocPhan.Generate(10000, hocPhan);
    var lopHocPhan = LopHocPhan.Generate(10000, hocPhan, hocKi, giangVien);
    await context.LopHocPhan.AddRangeAsync(lopHocPhan);
    await context.HeSoHocPhan.AddRangeAsync(heSoHocPhan);
    await context.SaveChangesAsync();

    return Ok();
  }

  [HttpPost("tao-uc3")]
  public async Task<ActionResult> TaoUc3Async()
  {
    var dinhMuc = DinhMucTietChuan.Generate(2000, 2030);
    var heSoLHP = HeSoLopHocPhan.Generate(2000, 2030);
    await context.DinhMucTietChuan.AddRangeAsync(dinhMuc);
    await context.HeSoLopHocPhan.AddRangeAsync(heSoLHP);
    await context.SaveChangesAsync();

    return Ok();
  }
}
