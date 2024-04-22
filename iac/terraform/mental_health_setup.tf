resource "aws_instance" "my_ec2_instance" {
  ami                    = local.ami_id
  instance_type          = local.instance_type
  subnet_id              = local.subnet_id
  key_name               = local.key_name
  vpc_security_group_ids = [local.nfs_security_group]
  associate_public_ip_address = true
  user_data               = data.template_file.user_data.rendered
  tags = {
    Name = local.tag_name
  }
}