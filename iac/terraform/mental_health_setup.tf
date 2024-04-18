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

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]  
  }

  ingress {
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  ingress {
    from_port   = 8080
    to_port     = 8080
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

resource "aws_instance" "my_ec2_instance" {
  ami                    = "ami-09298640a92b2d12c"
  instance_type          = "t2.micro"
  subnet_id              = aws_subnet.my_subnet.id
  key_name               = "ec2-ssh"
  vpc_security_group_ids = [aws_security_group.my_security_group.id]
  associate_public_ip_address = true
  tags = {
    Name = "mental-health"
  }
}
