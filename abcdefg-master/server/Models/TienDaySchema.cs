using System.ComponentModel.DataAnnotations;

namespace server.Models;

public class DinhMucTietChuan
{
  public static List<DinhMucTietChuan> Generate(int fromYear, int toYear)
  {
    var list = new List<DinhMucTietChuan>();
    var random = new Random();
    for (int year = fromYear; year <= toYear; year++)
    {
      list.Add(new DinhMucTietChuan
      {
        GiaTri = (ulong)random.Next(0, 50000000),
        NamApDung = year,
        ThoiGianCapNhat = DateTime.UtcNow.AddDays(-random.Next(0, 365))
      });
    }

    return list;
  }
  [Key]
  public int Id { get; set; }
  public ulong GiaTri { get; set; }
  public int NamApDung { get; set; }
  public DateTime ThoiGianCapNhat { get; set; } = DateTime.UtcNow;
}

public class HeSoLopHocPhan
{
  public static List<HeSoLopHocPhan> Generate(int fromYear, int toYear)
  {
    var list = new List<HeSoLopHocPhan>();
    var random = new Random();

    for (int year = fromYear; year <= toYear; year++)
    {
      for (int i = 0; i < 5; i++) // mỗi năm 3 mốc khác nhau
      {
        list.Add(new HeSoLopHocPhan
        {
          GiaTri = Math.Round(random.NextDouble() * 2.0 - 1.0, 2), // hệ số từ 1.0–1.5
          SoSinhVienToiDa = random.Next(150),
          NamApDung = year,
          ThoiGianCapNhat = DateTime.UtcNow.AddDays(-random.Next(0, 365))
        });
      }
    }

    return list;
  }

  [Key]
  public int Id { get; set; }
  public double GiaTri { get; set; }
  public int SoSinhVienToiDa { get; set; }
  public int NamApDung { get; set; }
  public DateTime ThoiGianCapNhat { get; set; } = DateTime.UtcNow;
}