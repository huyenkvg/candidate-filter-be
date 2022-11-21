export default class StringUtils {
  static chuanHoaChuoiHoa(str: string): string {
    return str.trim().toUpperCase();
  }
  static chuanHoaChuoiThuong(str: string): string {
    return str.trim().toLowerCase();
  }
  static chuanHoaObjectSring(obj: any, isUpper: boolean): any {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const element = obj[key];
        if (typeof element === 'string') {
          if (isUpper) {
            obj[key] = StringUtils.chuanHoaChuoiHoa(element);
          } else {
            obj[key] = StringUtils.chuanHoaChuoiThuong(element);
          }
        }
      }
    }
    return obj;
  }
}