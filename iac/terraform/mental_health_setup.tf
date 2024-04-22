resource "aws_efs_file_system" "my_efs" {
  creation_token = "my-efs"

  encrypted            = true
  performance_mode     = "generalPurpose"
  throughput_mode      = "bursting"
  kms_key_id           = aws_kms_key.my_kms_key.arn
  tags = {
    Name = "mental-health"
  }
}

output "file_system_id_1" {
  value = aws_efs_file_system.my_efs.id
}

resource "aws_kms_key" "my_kms_key" {
  description             = "EFS Encryption Key"
  deletion_window_in_days = 10
  policy                  = <<POLICY
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "AWS": "*"
      },
      "Action": "kms:*",
      "Resource": "*"
    }
  ]
}
POLICY
}

resource "aws_instance" "my_ec2_instance" {
  depends_on = [data.template_file.user_data]


  ami                    = local.ami_id
  instance_type          = local.instance_type
  subnet_id              = local.subnet_id
  key_name               = local.key_name
  vpc_security_group_ids = [local.customized_security_group]
  associate_public_ip_address = true
  user_data               = data.template_file.user_data.rendered
  tags = {
    Name = local.tag_name
  }
}

resource "aws_efs_mount_target" "my_mount_target" {
  file_system_id  = aws_efs_file_system.my_efs.id
  subnet_id       = aws_subnet.my_subnet.id
  security_groups = [aws_security_group.my_security_group_nfs.id]
}

resource "aws_vpc" "my_vpc" {
  cidr_block = "10.0.0.0/16"
  tags = {
    Name = "mental-health"
  }
}

resource "aws_subnet" "my_subnet" {
  vpc_id            = aws_vpc.my_vpc.id
  cidr_block        = "10.0.1.0/24"
  availability_zone = "ap-south-1a"
  tags = {
    Name = "mental-health"
  }
}

resource "aws_security_group" "my_security_group" {
  name   = "terraform-mental-health"
  vpc_id = aws_vpc.my_vpc.id

  tags = {
    Name = "mental-health"
  }

}

resource "aws_security_group" "my_security_group_nfs" {
  name   = "terraform-mental-health-nfs"
  vpc_id = aws_vpc.my_vpc.id

  tags = {
    Name = "mental-health-nfs"
  }

}

resource "aws_internet_gateway" "my_igw" {
  vpc_id = aws_vpc.my_vpc.id

  tags = {
    Name = "mental-health"
  }
}

resource "aws_route_table" "my_route_table" {
  vpc_id = aws_vpc.my_vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.my_igw.id
  }

  tags = {
    Name = "mental-health"
  }
}

resource "aws_route_table_association" "my_route_association" {
  subnet_id      = aws_subnet.my_subnet.id
  route_table_id = aws_route_table.my_route_table.id
}

resource "aws_network_interface" "my_network_interface" {
  subnet_id   = aws_subnet.my_subnet.id
  security_groups = [aws_security_group.my_security_group_nfs.id]
  tags = {
    Name = "mental-health"
  }
  depends_on = [aws_subnet.my_subnet]
}
