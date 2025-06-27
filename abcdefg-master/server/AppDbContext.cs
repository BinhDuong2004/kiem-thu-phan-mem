using Microsoft.EntityFrameworkCore;
using server.Models;

namespace server;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
  
  public static readonly string connectionString = "server=localhost;database=another;user=root;password=873098";
  public DbSet<Khoa> Khoa { get; set; }
  public DbSet<BangCap> BangCap { get; set; }
  public DbSet<HeSoBangCap> HeSoBangCap { get; set; }
  public DbSet<GiangVien> GiangVien { get; set; }

  public DbSet<HocPhan> HocPhan { get; set; }
  public DbSet<HeSoHocPhan> HeSoHocPhan { get; set; }
  public DbSet<HocKi> HocKi { get; set; }
  public DbSet<LopHocPhan> LopHocPhan { get; set; }

  public DbSet<DinhMucTietChuan> DinhMucTietChuan { get; set; }
  public DbSet<HeSoLopHocPhan> HeSoLopHocPhan { get; set; }

  protected override void OnModelCreating(ModelBuilder modelBuilder)
  {
    base.OnModelCreating(modelBuilder);

    // modelBuilder.Entity<BangCap>().HasData(
    //   new BangCap { Id = 1, MaBangCap = "BC001", TenBangCap = "Trung cấp", TenVietTat = "TC" },
    //   new BangCap { Id = 2, MaBangCap = "BC002", TenBangCap = "Cao đẳng", TenVietTat = "CĐ" },
    //   new BangCap { Id = 3, MaBangCap = "BC003", TenBangCap = "Cử nhân", TenVietTat = "CN" },
    //   new BangCap { Id = 4, MaBangCap = "BC004", TenBangCap = "Kỹ sư", TenVietTat = "KS" },
    //   new BangCap { Id = 5, MaBangCap = "BC005", TenBangCap = "Dược sĩ", TenVietTat = "DS" },
    //   new BangCap { Id = 6, MaBangCap = "BC006", TenBangCap = "Bác sĩ", TenVietTat = "BS" },
    //   new BangCap { Id = 7, MaBangCap = "BC007", TenBangCap = "Thạc sĩ", TenVietTat = "ThS" },
    //   new BangCap { Id = 8, MaBangCap = "BC008", TenBangCap = "Tiến sĩ", TenVietTat = "TS" },
    //   new BangCap { Id = 9, MaBangCap = "BC009", TenBangCap = "Tiến sĩ khoa học", TenVietTat = "TSKH" },
    //   new BangCap { Id = 10, MaBangCap = "BC010", TenBangCap = "Giáo sư", TenVietTat = "GS" }
    // );

    // modelBuilder.Entity<Khoa>().HasData(
    //   new Khoa { Id = 1, MaKhoa = "KH001", TenKhoa = "Khoa Công nghệ thông tin", TenVietTat = "CNTT", MoTaNhiemVu = "Đào tạo và nghiên cứu về công nghệ phần mềm, mạng máy tính, trí tuệ nhân tạo." },
    //   new Khoa { Id = 2, MaKhoa = "KH002", TenKhoa = "Khoa Kinh tế", TenVietTat = "KT", MoTaNhiemVu = "Đào tạo chuyên ngành kinh tế, tài chính, và quản trị kinh doanh." },
    //   new Khoa { Id = 3, MaKhoa = "KH003", TenKhoa = "Khoa Luật", TenVietTat = "LUAT", MoTaNhiemVu = "Đào tạo cử nhân và nghiên cứu các lĩnh vực pháp lý." },
    //   new Khoa { Id = 4, MaKhoa = "KH004", TenKhoa = "Khoa Cơ khí", TenVietTat = "CK", MoTaNhiemVu = "Giảng dạy và nghiên cứu về cơ khí, cơ điện tử, và tự động hóa." },
    //   new Khoa { Id = 5, MaKhoa = "KH005", TenKhoa = "Khoa Sư phạm", TenVietTat = "SP", MoTaNhiemVu = "Đào tạo giáo viên các cấp và nghiên cứu giáo dục." },
    //   new Khoa { Id = 6, MaKhoa = "KH006", TenKhoa = "Khoa Y", TenVietTat = "Y", MoTaNhiemVu = "Đào tạo bác sĩ, nghiên cứu y học và chăm sóc sức khỏe." },
    //   new Khoa { Id = 7, MaKhoa = "KH007", TenKhoa = "Khoa Dược", TenVietTat = "DUOC", MoTaNhiemVu = "Đào tạo dược sĩ, nghiên cứu dược phẩm và kiểm nghiệm thuốc." },
    //   new Khoa { Id = 8, MaKhoa = "KH008", TenKhoa = "Khoa Môi trường", TenVietTat = "MT", MoTaNhiemVu = "Giảng dạy và nghiên cứu về môi trường và phát triển bền vững." },
    //   new Khoa { Id = 9, MaKhoa = "KH009", TenKhoa = "Khoa Ngôn ngữ", TenVietTat = "NN", MoTaNhiemVu = "Đào tạo ngoại ngữ và nghiên cứu ngôn ngữ học." },
    //   new Khoa { Id = 10, MaKhoa = "KH010", TenKhoa = "Khoa Toán – Tin", TenVietTat = "TT", MoTaNhiemVu = "Đào tạo chuyên sâu về toán học ứng dụng và khoa học máy tính." }
    // );
    foreach (var foreignKey in modelBuilder.Model.GetEntityTypes().SelectMany(e => e.GetForeignKeys()))
    {
      foreignKey.DeleteBehavior = DeleteBehavior.Cascade;
    }
  }
}