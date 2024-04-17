# Create a new VPC in ap-south-1
resource "aws_vpc" "my_vpc" {
  cidr_block = "10.0.0.0/16"
  tags = {
    Name = "test"
  }
}

# Create a new subnet within the VPC in ap-south-1
resource "aws_subnet" "my_subnet" {
  vpc_id            = aws_vpc.my_vpc.id
  cidr_block        = "10.0.1.0/24"
  availability_zone = "ap-south-1a"
  tags = {
    Name = "test"
  }
}

# Create a new security group allowing inbound SSH and port 3000 traffic in ap-south-1
resource "aws_security_group" "my_security_group" {
  name   = "terraform-mental-health"
  vpc_id = aws_vpc.my_vpc.id

  tags = {
    Name = "test"
  }

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]  # Replace YOUR_IP_ADDRESS with your actual IP address
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

# Create an internet gateway
resource "aws_internet_gateway" "my_igw" {
  vpc_id = aws_vpc.my_vpc.id

  tags = {
    Name = "test"
  }
}


# Create a new route table and route for internet access
resource "aws_route_table" "my_route_table" {
  vpc_id = aws_vpc.my_vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.my_igw.id
  }

  tags = {
    Name = "test"
  }
}

# Associate the subnet with the route table
resource "aws_route_table_association" "my_route_association" {
  subnet_id      = aws_subnet.my_subnet.id
  route_table_id = aws_route_table.my_route_table.id
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
