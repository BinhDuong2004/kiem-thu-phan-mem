using System.ComponentModel.DataAnnotations;

namespace server.Models;

public class HocPhan
{
  private static readonly string[] TenHocPhanMau = [
        "Toán cao cấp", "Vật lý đại cương", "Hóa học đại cương", "Cơ sở dữ liệu",
        "Lập trình hướng đối tượng", "Cấu trúc dữ liệu", "Mạng máy tính",
        "Trí tuệ nhân tạo", "Hệ điều hành", "Phân tích thiết kế hệ thống",
        "Marketing căn bản", "Kinh tế vĩ mô", "Quản trị học", "Tiếng Anh chuyên ngành"
    ];
  private static readonly Random random = new();

  public static List<HocPhan> Generate(int count)
  {
    var list = new List<HocPhan>();

    for (int i = 1; i <= count; i++)
    {
      var ten = TenHocPhanMau[random.Next(TenHocPhanMau.Length)];
      list.Add(new HocPhan
      {
        MaHocPhan = $"HP{i:D3}",
        TenHocPhan = ten,
        SoTinChi = random.Next(2, 6) // từ 2 đến 5 tín chỉ
      });
    }

    return list;
  }
  [Key]
  public int Id { get; set; }
  public string MaHocPhan { get; set; } = null!;
  public string TenHocPhan { get; set; } = null!;
  public int SoTinChi { get; set; }
}

public class HeSoHocPhan
{
  private static readonly Random random = new();
  public static List<HeSoHocPhan> Generate(int count, List<HocPhan> hocPhan)
  {
    var list = new List<HeSoHocPhan>();

    for (int i = 1; i <= count; i++)
    {
      list.Add(new HeSoHocPhan
      {
        GiaTri = Math.Round(random.NextDouble() * 1.5 + 0.5, 2), // từ 0.5 đến 2.0
        ThoiGianCapNhat = DateTime.Now.AddDays(-random.Next(0, 180)), // cập nhật trong vòng 6 tháng gần đây
        HocPhanId = hocPhan[random.Next(hocPhan.Count)].Id
      });
    }

    return list;
  }
  [Key]
  public int Id { get; set; }
  public double GiaTri { get; set; }
  public DateTime ThoiGianCapNhat { get; set; } = DateTime.Now;

  public int HocPhanId { get; set; }
  public HocPhan HocPhan { get; set; } = null!;
}

public class HocKi
{
  public static List<HocKi> Generate(int startYear, int numberOfYears)
  {
    var list = new List<HocKi>();
    int id = 1;

    for (int year = startYear; year < startYear + numberOfYears; year++)
    {
      // Học kỳ 1
      list.Add(new HocKi
      {
        Id = id++,
        TenHocKi = $"Học kỳ 1 - {year}",
        ThoiGianBatDau = new DateTime(year, 8, 15),
        ThoiGianKetThuc = new DateTime(year + 1, 1, 5)
      });

      // Học kỳ 2
      list.Add(new HocKi
      {
        Id = id++,
        TenHocKi = $"Học kỳ 2 - {year}",
        ThoiGianBatDau = new DateTime(year + 1, 1, 10),
        ThoiGianKetThuc = new DateTime(year + 1, 6, 1)
      });

      // Học kỳ hè (optional)
      list.Add(new HocKi
      {
        Id = id++,
        TenHocKi = $"Học kỳ hè - {year}",
        ThoiGianBatDau = new DateTime(year + 1, 6, 10),
        ThoiGianKetThuc = new DateTime(year + 1, 8, 1)
      });
    }

    return list;
  }

  [Key]
  public int Id { get; set; }
  public string TenHocKi { get; set; } = null!;
  public DateTime ThoiGianBatDau { get; set; }
  public DateTime ThoiGianKetThuc { get; set; }
}

public class LopHocPhan
{
  private static readonly Random random = new();
  public static List<LopHocPhan> Generate(int count, List<HocPhan> hocPhan, List<HocKi> hocKi, List<GiangVien> giangVien, double percentNullGiangVien = 0.2)
  {
    var list = new List<LopHocPhan>();

    for (int i = 1; i <= count; i++)
    {
      bool isGiangVienNull = random.NextDouble() < percentNullGiangVien;
      list.Add(new LopHocPhan
      {
        TenLopHocPhan = $"LHP{i:D3}",
        SoSinhVienDangKi = random.Next(150),
        HocPhanId = hocPhan[random.Next(hocPhan.Count)].Id,
        HocKiId = hocKi[random.Next(hocKi.Count)].Id,
        GiangVienId = isGiangVienNull ? null : giangVien[random.Next(giangVien.Count)].Id
      });
    }

    return list;
  }
  [Key]
  public int Id { get; set; }
  public string TenLopHocPhan { get; set; } = null!;
  public int SoSinhVienDangKi { get; set; }

  public int? HocPhanId { get; set; }
  public HocPhan? HocPhan { get; set; }

  public int? HocKiId { get; set; }
  public HocKi? HocKi { get; set; }

  public int? GiangVienId { get; set; }
  // public GiangVien? GiangVien { get; set; }
}