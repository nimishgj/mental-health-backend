provider "aws" {
  region     = "ap-south-1"
  access_key = var.access_key
  secret_key = var.secret_key
}

# Create a new VPC in ap-south-1
resource "aws_vpc" "my_vpc" {
  cidr_block = "10.0.0.0/16"  # Specify the CIDR block for your VPC
  tags = {
    Name = "test"  # Tag for the VPC
  }
}

# Create a new subnet within the VPC in ap-south-1
resource "aws_subnet" "my_subnet" {
  vpc_id                  = aws_vpc.my_vpc.id  # Reference the ID of the created VPC
  cidr_block              = "10.0.1.0/24"  # Specify the CIDR block for your subnet
  availability_zone       = "ap-south-1a"  # Specify the availability zone for your subnet in ap-south-1
  tags = {
    Name = "test"  # Tag for the subnet
  }
}

# Create a new security group allowing inbound traffic on port 3000 in ap-south-1
resource "aws_security_group" "my_security_group" {
    name        = "terraform-mental-health"
  vpc_id = aws_vpc.my_vpc.id  # Reference the ID of the created VPC
  tags = {
    Name = "test"  # Tag for the security group
  }

  ingress {
    from_port   = 3000  # Allow inbound traffic on port 3000
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
  ami                    = "ami-09298640a92b2d12c"  # Specify the AMI ID for the minimal OS (e.g., Amazon Linux 2)
  instance_type          = "t2.micro"  # Specify the instance type
  subnet_id              = aws_subnet.my_subnet.id  # Reference the ID of the created subnet in ap-south-1
  key_name               = "ec2-ssh"  # Specify the name of your existing SSH key pair
  vpc_security_group_ids        = [aws_security_group.my_security_group.id]  # Reference the name of the created security group
  associate_public_ip_address = true  # Assign a public IP address to the EC2 instance
  tags = {
    Name = "test"  # Tag for the EC2 instance
  }
}
