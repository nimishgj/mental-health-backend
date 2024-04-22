resource "aws_instance" "my_ec2_instance" {
  ami                    = "ami-09298640a92b2d12c"
  instance_type          = "t2.micro"
  subnet_id              = "subnet-0106b0e347e5e6227"
  key_name               = "ec2-ssh"
  vpc_security_group_ids = ["sg-0e9471f0e58bb18a9"] 
  associate_public_ip_address = true
  user_data = <<-EOF
              #cloud-config
              package_update: true
              package_upgrade: true
              runcmd:
                - yum install -y amazon-efs-utils
                - apt-get -y install amazon-efs-utils
                - yum install -y nfs-utils
                - apt-get -y install nfs-common
                - file_system_id_1=fs-02e0de1641eb0481f
                - efs_mount_point_1=/mnt/efs/fs1
                - mkdir -p "${efs_mount_point_1}"
                - test -f "/sbin/mount.efs" && printf "\n${file_system_id_1}:/ ${efs_mount_point_1} efs tls,_netdev\n" >> /etc/fstab || printf "\n${file_system_id_1}.efs.ap-south-1.amazonaws.com:/ ${efs_mount_point_1} nfs4 nfsvers=4.1,rsize=1048576,wsize=1048576,hard,timeo=600,retrans=2,noresvport,_netdev 0 0\n" >> /etc/fstab
                - test -f "/sbin/mount.efs" && grep -ozP 'client-info]\nsource' '/etc/amazon/efs/efs-utils.conf'; if [[ $? == 1 ]]; then printf "\n[client-info]\nsource=liw\n" >> /etc/amazon/efs/efs-utils.conf; fi;
                - retryCnt=15; waitTime=30; while true; do mount -a -t efs,nfs4 defaults; if [ $? = 0 ] || [ $retryCnt -lt 1 ]; then echo File system mounted successfully; break; fi; echo File system not available, retrying to mount.; ((retryCnt--)); sleep $waitTime; done;
              EOF
  tags = {
    Name = "mental-health"
  }
}
