# Create a new security group allowing inbound traffic on port 3000 in ap-south-1
resource "aws_security_group" "my_security_group" {
  name = "terraform-mental-health"

  tags = {
    Name = "test"
  }

  ingress {
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# Create a new EC2 instance in ap-south-1
resource "aws_instance" "my_ec2_instance" {
  ami                    = "ami-09298640a92b2d12c"
  instance_type          = "t2.micro"
  key_name               = "ec2-ssh"
  vpc_security_group_ids = [aws_security_group.my_security_group.id]
  associate_public_ip_address = true

  tags = {
    Name = "test"
  }
}
