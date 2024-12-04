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
    High: { code: "HIGH", name: "Cao", engName: "High", color: color.highest},                                                                                                                                                                                                              
  },
  ProjectRole : {
    Member: { code: "MEMBER", name: "Thành viên", engName: "Member", PERMISSION: "LOW" },
    Moderator: { code: "MOD", name: "Kiểm duyệt viên", engName: "Moderator", PERMISSION: "MEDIUM" },
    Administrator: { code: "ADMIN", name: "Quản trị viên", engName: "Administrator", PERMISSION: "HIGH" }
  },
  ProjectAction: {
    ChangeStatus: { code: "CHANGE_STATUS", name: "Thay đổi trạng thái", engName: "Change Status" },
    UpdateTask: { code: "UPDATE_TASK", name: "Cập nhật công việc", engName: "Update Task" },
    ChangeDescription: { code: "CHANGE_DESCRIPTION", name: "Thay đổi mô tả", engName: "Change Description" },
    ChangeTitle: { code: "CHANGE_TITLE", name: "Thay đổi tiêu đề", engName: "Change Title" },
    CreateTask: { code: "CREATE_TASK", name: "Tạo công việc", engName: "Create Task" },
    DeleteTask: { code: "DELETE_TASK", name: "Xóa công việc", engName: "Delete Task" },
    AddMember: { code: "ADD_MEMBER", name: "Thêm thành viên", engName: "Add Member" },
    RemoveMember: { code: "REMOVE_MEMBER", name: "Xóa thành viên", engName: "Remove Member" },
  },
  TeamRole: {
    Member: { code: "MEMBER", name: "Thành viên", engName: "Member", PERMISSION: "LOW" },
    Moderator: { code: "MOD", name: "Kiểm duyệt viên", engName: "Moderator", PERMISSION: "MEDIUM" },
    Administrator: { code: "ADMIN", name: "Quản trị viên", engName: "Administrator", PERMISSION: "HIGH" }
  },
  ErrorCode: {
    NonVerify: { code: "NONVERIFY", name: "Chưa xác minh", engName: "Non verify" },
    PermissionDenied: { code: "PERMISSION_DENIED", name: "Quyền truy cập bị từ chối", engName: "Permission denied" },
    NotFound: { code: "NOT_FOUND", name: "Không tìm thấy", engName: "Not found" },
    InternalError: { code: "INTERNAL_ERROR", name: "L��i nội bộ", engName: "Internal error" },
    BadRequest: { code: "BAD_REQUEST", name: "Yêu cầu không hợp lệ", engName: "Bad request" },
    Unauthorized: { code: "UNAUTHORIZED", name: "Chưa đăng nhập", engName: "Unauthorized" },
    PasswordIncorrect: { code: "PASSWORD_INCORRECT", name: "Sai mật khẩu", engName: "Password incorrect" },
  }
}