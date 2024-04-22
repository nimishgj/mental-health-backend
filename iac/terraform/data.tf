data "template_file" "user_data" {
  template = file("${path.module}/templates/user_data.tpl")

  vars = {
    file_system_id_1 = var.file_system_id_1
    efs_mount_point_1 = var.efs_mount_point_1
  }
}

variable "file_system_id_1" {
  type    = string
  default = "fs-0b52439c6a0efd436"
}

variable "efs_mount_point_1" {
  type    = string
  default = "/mnt/efs"
}
