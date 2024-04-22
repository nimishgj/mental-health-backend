variable "file_system_id" {
  type    = string
  default = "fs-02e0de1641eb0481f"
}

variable "efs_mount_point" {
  type    = string
  default = "/mnt/efs/fs1"
}

resource "aws_instance" "my_ec2_instance" {
  ami                    = "ami-09298640a92b2d12c"
  instance_type          = "t2.micro"
  subnet_id              = "subnet-0106b0e347e5e6227"
  key_name               = "ec2-ssh"
  vpc_security_group_ids = ["sg-0e9471f0e58bb18a9"] 
  associate_public_ip_address = true
  user_data               = data.template_file.user_data.rendered
  tags = {
    Name = "mental-health"
  }
}