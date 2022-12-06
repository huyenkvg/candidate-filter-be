BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[chi_tieu_to_hop] (
    [maDotTuyenSinh] INT NOT NULL,
    [maNganh] NVARCHAR(30) NOT NULL,
    [maToHop] NVARCHAR(10) NOT NULL,
    [chiTieu] INT,
    CONSTRAINT [PK_chi_tieu_to_hop] PRIMARY KEY CLUSTERED ([maDotTuyenSinh],[maNganh],[maToHop])
);

-- CreateTable
CREATE TABLE [dbo].[chi_tieu_tuyen_sinh] (
    [maNganh] NVARCHAR(30) NOT NULL,
    [maDotTuyenSinh] INT NOT NULL,
    [chiTieu] INT,
    [diemSan] INT,
    CONSTRAINT [PK_chi_tieu_tuyen_sinh] PRIMARY KEY CLUSTERED ([maNganh],[maDotTuyenSinh])
);

-- CreateTable
CREATE TABLE [dbo].[danh_sach_nguyen_vong] (
    [maKhoaTuyenSinh] INT,
    [soBaoDanh] NVARCHAR(30) NOT NULL,
    [maDotTuyenSinh] INT NOT NULL,
    [nguyenVong] INT NOT NULL,
    [maNganh] NVARCHAR(30) NOT NULL,
    [maToHopXetTuyen] NVARCHAR(10),
    [diemMon1] FLOAT(53),
    [diemMon2] FLOAT(53),
    [diemMon3] FLOAT(53),
    [tongDiem] FLOAT(53),
    [dieuKienKhac] INT,
    [cmnd] NVARCHAR(50),
    CONSTRAINT [PK_danh_sach_nguyen_vong] PRIMARY KEY CLUSTERED ([soBaoDanh],[maDotTuyenSinh],[nguyenVong])
);

-- CreateTable
CREATE TABLE [dbo].[danh_sach_trung_tuyen] (
    [maKhoaTuyenSinh] INT NOT NULL,
    [soBaoDanh] NVARCHAR(30) NOT NULL,
    [nguyenVongTrungTuyen] INT,
    [maDotTuyenSinh] INT NOT NULL,
    CONSTRAINT [PK_danh_sach_trung_tuyen] PRIMARY KEY CLUSTERED ([maKhoaTuyenSinh],[soBaoDanh]),
    CONSTRAINT [UK_DSTT] UNIQUE NONCLUSTERED ([maDotTuyenSinh],[soBaoDanh])
);

-- CreateTable
CREATE TABLE [dbo].[diem_chuan] (
    [maNganh] NVARCHAR(30) NOT NULL,
    [maDotTuyenSinh] INT NOT NULL,
    [diemChuan] FLOAT(53),
    CONSTRAINT [PK_diem_chuan] PRIMARY KEY CLUSTERED ([maNganh],[maDotTuyenSinh])
);

-- CreateTable
CREATE TABLE [dbo].[dot_tuyen_sinh] (
    [maDotTuyenSinh] INT NOT NULL IDENTITY(1,1),
    [maKhoaTuyenSinh] INT,
    [tenDotTuyenSinh] NVARCHAR(100),
    [lock] BIT CONSTRAINT [DF_dot_tuyen_sinh_lock] DEFAULT 0,
    [diemSan] FLOAT(53),
    CONSTRAINT [PK_dot_tuyen_sinh] PRIMARY KEY CLUSTERED ([maDotTuyenSinh]),
    CONSTRAINT [IX_dot_tuyen_sinh] UNIQUE NONCLUSTERED ([maKhoaTuyenSinh],[maDotTuyenSinh])
);

-- CreateTable
CREATE TABLE [dbo].[khoa_tuyen_sinh] (
    [maKhoa] INT NOT NULL IDENTITY(1,1),
    [tenKhoa] INT NOT NULL,
    CONSTRAINT [PK_AcademicYear] PRIMARY KEY CLUSTERED ([maKhoa])
);

-- CreateTable
CREATE TABLE [dbo].[nganh] (
    [maNganh] NVARCHAR(30) NOT NULL,
    [tenNganh] NVARCHAR(100),
    CONSTRAINT [PK_nganh] PRIMARY KEY CLUSTERED ([maNganh])
);

-- CreateTable
CREATE TABLE [dbo].[profile] (
    [user_id] INT NOT NULL,
    [firstname] NVARCHAR(20),
    [lastname] NVARCHAR(20),
    [phone] NCHAR(15),
    [active] BIT NOT NULL CONSTRAINT [DF_profile_active] DEFAULT 1,
    CONSTRAINT [PK_profile] PRIMARY KEY CLUSTERED ([user_id])
);

-- CreateTable
CREATE TABLE [dbo].[role] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(30),
    CONSTRAINT [PK_role] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[sysdiagrams] (
    [name] NVARCHAR(128) NOT NULL,
    [principal_id] INT NOT NULL,
    [diagram_id] INT NOT NULL IDENTITY(1,1),
    [version] INT,
    [definition] VARBINARY(max),
    CONSTRAINT [PK__sysdiagr__C2B05B619A2C579C] PRIMARY KEY CLUSTERED ([diagram_id]),
    CONSTRAINT [UK_principal_name] UNIQUE NONCLUSTERED ([principal_id],[name])
);

-- CreateTable
CREATE TABLE [dbo].[thong_tin_ca_nhan] (
    [maKhoaTuyenSinh] INT NOT NULL,
    [soBaoDanh] NVARCHAR(30) NOT NULL,
    [hoTen] NVARCHAR(50),
    [cmnd] NVARCHAR(15),
    [soDienThoai] NVARCHAR(15),
    [email] NVARCHAR(50),
    [goiTinh] NVARCHAR(10),
    [diaChiGiayBao] NVARCHAR(200),
    [ngaySinh] NVARCHAR(20),
    [maTinh] NVARCHAR(50),
    [maTruong] NVARCHAR(50),
    [danToc] NVARCHAR(20),
    [khuVucUuTien] NVARCHAR(20),
    CONSTRAINT [PK_thong_tin_ca_nhan] PRIMARY KEY CLUSTERED ([maKhoaTuyenSinh],[soBaoDanh]),
    CONSTRAINT [IX_thong_tin_ca_nhan] UNIQUE NONCLUSTERED ([maKhoaTuyenSinh],[soBaoDanh])
);

-- CreateTable
CREATE TABLE [dbo].[to_hop_xet_tuyen] (
    [maToHop] NVARCHAR(10) NOT NULL,
    [mon1] NVARCHAR(20),
    [mon2] NVARCHAR(20),
    [mon3] NVARCHAR(20),
    CONSTRAINT [PK_to_hop_xet_tuyen] PRIMARY KEY CLUSTERED ([maToHop]),
    CONSTRAINT [UK_ToHopXetTuyen] UNIQUE NONCLUSTERED ([mon1],[mon2],[mon3])
);

-- CreateTable
CREATE TABLE [dbo].[users] (
    [id] INT NOT NULL IDENTITY(1,1),
    [username] NVARCHAR(50) NOT NULL,
    [password] NVARCHAR(200) NOT NULL,
    [role_id] INT NOT NULL,
    [active] BIT NOT NULL CONSTRAINT [DF_users_active] DEFAULT 1,
    CONSTRAINT [PK_user] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [UX_user] UNIQUE NONCLUSTERED ([username])
);

-- AddForeignKey
ALTER TABLE [dbo].[chi_tieu_to_hop] ADD CONSTRAINT [FK_chi_tieu_to_hop_chi_tieu_tuyen_sinh] FOREIGN KEY ([maNganh], [maDotTuyenSinh]) REFERENCES [dbo].[chi_tieu_tuyen_sinh]([maNganh],[maDotTuyenSinh]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[chi_tieu_tuyen_sinh] ADD CONSTRAINT [FK_chi_tieu_tuyen_sinh_dot_tuyen_sinh] FOREIGN KEY ([maDotTuyenSinh]) REFERENCES [dbo].[dot_tuyen_sinh]([maDotTuyenSinh]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[chi_tieu_tuyen_sinh] ADD CONSTRAINT [FK_chi_tieu_tuyen_sinh_nganh] FOREIGN KEY ([maNganh]) REFERENCES [dbo].[nganh]([maNganh]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[danh_sach_nguyen_vong] ADD CONSTRAINT [FK_danh_sach_nguyen_vong_dot_tuyen_sinh] FOREIGN KEY ([maDotTuyenSinh]) REFERENCES [dbo].[dot_tuyen_sinh]([maDotTuyenSinh]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[danh_sach_nguyen_vong] ADD CONSTRAINT [FK_danh_sach_nguyen_vong_nganh] FOREIGN KEY ([maNganh]) REFERENCES [dbo].[nganh]([maNganh]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[danh_sach_nguyen_vong] ADD CONSTRAINT [FK_danh_sach_nguyen_vong_thong_tin_ca_nhan] FOREIGN KEY ([maKhoaTuyenSinh], [soBaoDanh]) REFERENCES [dbo].[thong_tin_ca_nhan]([maKhoaTuyenSinh],[soBaoDanh]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[danh_sach_nguyen_vong] ADD CONSTRAINT [FK_danh_sach_nguyen_vong_to_hop_xet_tuyen] FOREIGN KEY ([maToHopXetTuyen]) REFERENCES [dbo].[to_hop_xet_tuyen]([maToHop]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[danh_sach_trung_tuyen] ADD CONSTRAINT [FK_danh_sach_trung_tuyen_danh_sach_nguyen_vong] FOREIGN KEY ([soBaoDanh], [maDotTuyenSinh], [nguyenVongTrungTuyen]) REFERENCES [dbo].[danh_sach_nguyen_vong]([soBaoDanh],[maDotTuyenSinh],[nguyenVong]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[danh_sach_trung_tuyen] ADD CONSTRAINT [FK_danh_sach_trung_tuyen_dot_tuyen_sinh] FOREIGN KEY ([maDotTuyenSinh]) REFERENCES [dbo].[dot_tuyen_sinh]([maDotTuyenSinh]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[danh_sach_trung_tuyen] ADD CONSTRAINT [FK_danh_sach_trung_tuyen_khoa_tuyen_sinh] FOREIGN KEY ([maKhoaTuyenSinh]) REFERENCES [dbo].[khoa_tuyen_sinh]([maKhoa]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[danh_sach_trung_tuyen] ADD CONSTRAINT [FK_danh_sach_trung_tuyen_thong_tin_ca_nhan] FOREIGN KEY ([maKhoaTuyenSinh], [soBaoDanh]) REFERENCES [dbo].[thong_tin_ca_nhan]([maKhoaTuyenSinh],[soBaoDanh]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[diem_chuan] ADD CONSTRAINT [FK_diem_chuan_dot_tuyen_sinh] FOREIGN KEY ([maDotTuyenSinh]) REFERENCES [dbo].[dot_tuyen_sinh]([maDotTuyenSinh]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[diem_chuan] ADD CONSTRAINT [FK_diem_chuan_nganh] FOREIGN KEY ([maNganh]) REFERENCES [dbo].[nganh]([maNganh]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[dot_tuyen_sinh] ADD CONSTRAINT [FK_dot_tuyen_sinh_khoa_tuyen_sinh] FOREIGN KEY ([maKhoaTuyenSinh]) REFERENCES [dbo].[khoa_tuyen_sinh]([maKhoa]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[profile] ADD CONSTRAINT [FK_profile_user] FOREIGN KEY ([user_id]) REFERENCES [dbo].[users]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[thong_tin_ca_nhan] ADD CONSTRAINT [FK_ThongTinCaNhan_khoa_tuyen_sinh] FOREIGN KEY ([maKhoaTuyenSinh]) REFERENCES [dbo].[khoa_tuyen_sinh]([maKhoa]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[users] ADD CONSTRAINT [FK_user_role] FOREIGN KEY ([role_id]) REFERENCES [dbo].[role]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
