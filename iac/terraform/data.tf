data "template_file" "user_data" {
  template = file("${path.module}/templates/user_data.tpl")

  vars = {
    file_system_id_1 = var.file_system_id_1
    efs_mount_point_1 = var.efs_mount_point_1
  }
}
