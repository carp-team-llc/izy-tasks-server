import { color } from "./colors"

export const EnumData = {
  StatusType: {
    Completed: { code: "COMPLETED", name: "Hoàn thành", engName: "Completed", color: color.completed},
    Cancel: { code: "CANCEL", name: "Đã huỷ", engName: "Cancel", color: color.cancel},
    Pending: { code: "PENDING", name: "Chờ làm", engName: "Pending", color: color.pending},
    Late: { code: "LATE", name: "Trễ hạn", engName: "Late", color: color.late},
    New: { code: "NEW", name: "Mới", engName: "New", color: color.new},
    Doing: { code: "DOING", name: "Đang làm", engName: "Doing", color: color.doing},
  },
  PriorityType: {
    Low: { code: "LOW", name: "Thấp", engName: "Low", color: color.low },
    Normal: { code: "NORMAL", name: "Bình thường", engName: "Normal", color: color.normal},
    Medium: { code: "MEDIUM", name: "Trung bình", engName: "Medium", color: color.medium },
    High: { code: "HIGH", name: "Cao", engName: "Hight", color: color.highest},                                                                                                                                                                                                              
  },
  ProjectRole : {
    Member: { code: "MEMBER", name: "Thành viên", engName: "Member", PERMISSION: "LOW" },
    Moderator: { code: "MOD", name: "Kiểm duyệt viên", engName: "Moderator", PERMISSION: "MEDIUM" },
    Administrator: { code: "ADMIN", name: "Quản trị viên", engName: "Administrator", PERMISSION: "HIGH" }
  }
}