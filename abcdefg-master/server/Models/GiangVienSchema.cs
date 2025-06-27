using System.ComponentModel.DataAnnotations;

namespace server.Models;

public class BangCap
{
  public static List<BangCap> Generate()
  {
    return [
      new BangCap { Id = 1, MaBangCap = "BC001", TenBangCap = "Trung cấp", TenVietTat = "TC" },
      new BangCap { Id = 2, MaBangCap = "BC002", TenBangCap = "Cao đẳng", TenVietTat = "CĐ" },
      new BangCap { Id = 3, MaBangCap = "BC003", TenBangCap = "Cử nhân", TenVietTat = "CN" },
      new BangCap { Id = 4, MaBangCap = "BC004", TenBangCap = "Kỹ sư", TenVietTat = "KS" },
      new BangCap { Id = 5, MaBangCap = "BC005", TenBangCap = "Thạc sĩ", TenVietTat = "ThS" },
      new BangCap { Id = 6, MaBangCap = "BC006", TenBangCap = "Tiến sĩ", TenVietTat = "TS" },
      new BangCap { Id = 7, MaBangCap = "BC007", TenBangCap = "Tiến sĩ khoa học", TenVietTat = "TSKH" },
      new BangCap { Id = 8, MaBangCap = "BC008", TenBangCap = "Giáo sư", TenVietTat = "GS" }
    ];
  }
  [Key]
  public int Id { get; set; }
  public string? MaBangCap { get; set; }
  public string? TenBangCap { get; set; }
  public string? TenVietTat { get; set; }
}

public class HeSoBangCap
{
  private static readonly Random random = new();

  public static List<HeSoBangCap> Generate(int count, List<BangCap> bangCap)
  {
    var list = new List<HeSoBangCap>();

    for (int i = 0; i < bangCap.Count; ++i)
    {
      list.Add(new()
      {
        BangCapId = bangCap[i].Id, // giả định ID nào đó, bạn có thể sửa nếu cần
        GiaTri = Math.Round(random.NextDouble() * 2 + 1, 2), // từ 1.00 đến 3.00
        ThoiGianCapNhat = DateTime.MinValue
      });
    }
    for (int i = 1; i <= count; i++)
    {
      list.Add(new()
      {
        BangCapId = bangCap[random.Next(bangCap.Count)].Id, // giả định ID nào đó, bạn có thể sửa nếu cần
        GiaTri = Math.Round(random.NextDouble() * 2 + 1, 2), // từ 1.00 đến 3.00
        ThoiGianCapNhat = DateTime.UtcNow.AddDays(-random.Next(0, 365))
      });
    }

    return list;
  }
  [Key]
  public int Id { get; set; }
  public double GiaTri { get; set; }
  public DateTime ThoiGianCapNhat { get; set; } = DateTime.UtcNow;

  public int BangCapId { get; set; }
  public BangCap BangCap { get; set; } = null!;
}

public class Khoa
{
  private static readonly Random random = new();
  public static List<Khoa> Generate(int count)
  {
    var list = new List<Khoa>();

    for (int i = 1; i <= count; i++)
    {
      list.Add(new Khoa
      {
        MaKhoa = $"K{i:D3}",
        TenKhoa = $"Khoa {i}",
        TenVietTat = $"K{i}",
        MoTaNhiemVu = $"Nhiệm vụ của Khoa {i} là đào tạo và nghiên cứu"
      });
    }

    return list;
  }
  [Key]
  public int Id { get; set; }
  public string? MaKhoa { get; set; }
  public string? TenKhoa { get; set; }
  public string? TenVietTat { get; set; }
  public string? MoTaNhiemVu { get; set; }
}

public class GiangVien
{
  private static readonly string[] Ho = ["Nguyễn", "Trần", "Lê", "Phạm", "Hoàng", "Đặng", "Vũ", "Bùi", "Đỗ", "Hồ"];
  private static readonly string[] TenDem = ["Văn", "Thị", "Hữu", "Quang", "Minh", "Xuân", "Đức", "Thế", "Trung"];
  private static readonly string[] Ten = ["An", "Bình", "Cường", "Dung", "Em", "Hồng", "Hải", "Lan", "Minh", "Nga"];
  private static readonly Random random = new();

  public static List<GiangVien> Generate(int count, List<Khoa> khoa, List<BangCap> bangCap)
  {
    var list = new List<GiangVien>();

    for (int i = 1; i <= count; i++)
    {
      var ho = Ho[random.Next(Ho.Length)];
      var tenDem = TenDem[random.Next(TenDem.Length)];
      var ten = Ten[random.Next(Ten.Length)];
      var hoTen = $"{ho} {tenDem} {ten}";

      var maGV = $"GV{i:D3}";
      var email = $"{ten.ToLower()}.{ho.ToLower()}{i}@university.edu.vn";
      var phone = $"09{random.Next(10000000, 99999999)}";

      var ngaySinh = new DateTime(
          random.Next(1970, 1995),
          random.Next(1, 13),
          random.Next(1, 28)
      );

      list.Add(new GiangVien
      {
        MaGiangVien = maGV,
        HoTen = hoTen,
        Email = email,
        DienThoai = phone,
        NgaySinh = ngaySinh,
        KhoaId = khoa[random.Next(khoa.Count)].Id,
        BangCapId = bangCap[random.Next(bangCap.Count)].Id
      });
    }

    return list;
  }
  [Key]
  public int Id { get; set; }
  public string MaGiangVien { get; set; } = null!;
  public DateTime NgaySinh { get; set; }
  public string HoTen { get; set; } = null!;
  public string DienThoai { get; set; } = null!;
  public string Email { get; set; } = null!;

  public int KhoaId { get; set; }
  public Khoa Khoa { get; set; } = null!;

  public int BangCapId { get; set; }
  public BangCap BangCap { get; set; } = null!;
}