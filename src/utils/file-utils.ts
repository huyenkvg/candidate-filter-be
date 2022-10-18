export default class FileUtils {
  static wishListToObject(row) {
    return {
      soHoSo: row['Số hồ sơ'],
      maNganh: row['Mã ngành'],
      tenNganh: row['Tên ngành'],
      dotTuyenSinh: row['Đợt tuyển sinh'],
      hoTen: row['Họ tên'],
      soBaoDanh: row['Số báo danh'],
      nguyenVong: row['Nguyện vọng'],
      toHopXetTuyen: row['Tổ hợp xét'],
      toHopGoc: row['Tổ hợp gốc'],
      mon1: row['Môn 1'],
      mon2: row['Môn 2'],
      mon3: row['Môn 3'],
      heSoMon1: row['Môn 1 hệ số'],
      heSoMon2: row['Môn 2 hệ số'],
      heSoMon3: row['Môn 3 hệ số'],
      diemMon1: row['Điểm môn 1'],
      diemMon2: row['Điểm môn 2'],
      diemMon3: row['Điểm môn 3'],
      diemUuTien: row['Điểm ưu tiên'],
      tongDiem: row['Tổng điểm'],
    };
  }
}