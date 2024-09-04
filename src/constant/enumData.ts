import { color } from "./colors"

export const EnumData = {
  StatusType: {
    Completed: { code: "COMPLETED", name: "Hoàn thành", color: color.completed},
    Cancel: { code: "CANCEL", name: "Đã huỷ", color: color.cancel},
    Pending: { code: "PENDING", name: "Chờ làm", color: color.pending},
    Late: { code: "LATE", name: "Trễ hạn", color: color.late},
    New: { code: "NEW", name: "Mới", color: color.new},
  },
  PriorityType: {
    Low: { code: "LOW", name: "Thấp", color: color.low },
    Normal: { code: "NORMAL", name: "Bình thường", color: color.normal},
    Medium: { code: "MEDIUM", name: "Trung bình", color: color.medium },
    High: { code: "HIGH", name: "Cao", color: color.highest},                                                                                                                                                                                                              
  },
}