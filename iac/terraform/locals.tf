locals {
  ami_id = "ami-09298640a92b2d12c"
  instance_type          = "t2.micro"
  subnet_id              = "subnet-0106b0e347e5e6227"
  key_name               = "ec2-ssh"
  tag_name = "mental-health"
  nfs_security_group = "sg-05a0182f48d503898"
  customized_security_group = "sg-0e9471f0e58bb18a9"
}