provider "aws" {
  region     = "ap-south-1"
  access_key = var.access_key
  secret_key = var.secret_key
}

# Create a new VPC in ap-south-1
resource "aws_vpc" "my_vpc" {
  cidr_block = "10.0.0.0/16"
  tags = {
    Name = "test"
  }
}

# Create a new subnet within the VPC in ap-south-1
resource "aws_subnet" "my_subnet" {
  vpc_id             = aws_vpc.my_vpc.id
  cidr_block         = "10.0.1.0/24"
  availability_zone  = "ap-south-1a"
  tags = {
    Name = "test"
  }
}

# Create a new security group allowing inbound traffic on port 3000 in ap-south-1
resource "aws_security_group" "my_security_group" {
  name = "terraform-mental-health"
  vpc_id = aws_vpc.my_vpc.id

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
  subnet_id              = aws_subnet.my_subnet.id
  key_name               = "ec2-ssh"
  vpc_security_group_ids = [aws_security_group.my_security_group.id]
  associate_public_ip_address = true

  tags = {
    Name = "test"
  }
}
