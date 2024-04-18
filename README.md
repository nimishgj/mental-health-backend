# Mental Health Backend 

## Versions:

1.Node 21.7.1
2.Express 4.19.2

## Manual application development local setup

#### 1. Install node dependencies 
```bash
    npm install
```

#### 2. Create new Network
```bash
    docker network create mental_health_network
```

#### 3. Start mongo database using docker
```bash
docker run -d \
  --name mental_health_mongo \
  --network mental_health_network \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=root \
  -e MONGO_INITDB_ROOT_PASSWORD=example \
  --hostname mental_health_mongo \
  mongo


```
#### 4. Start mongo visual database page
```bash
docker run -d \
  --name mental_health_mongo_express \
  --network mental_health_network \ 
  -p 8080:8081 \
  -e ME_CONFIG_MONGODB_ADMINUSERNAME=root \
  -e ME_CONFIG_MONGODB_ADMINPASSWORD=example \
  -e ME_CONFIG_MONGODB_SERVER=mental_health_mongo \ 
  mongo-express

```

#### 5. Create a .env file at the root path of the application
```dotenv
    DB_USER=root
    DB_PASSWORD=example
    DB_HOST=mental_health_mongo
    DB_PORT=27017
    NODE_ENV=development
```

#### 6. Start the application server
```bash
    npm run dev
```

## Docker application development local setup


#### 1. Create a .env file at the root path of the application
```dotenv
    NODE_ENV=development
    MONGO_EXPRESS_USERNAME=admin
    MONGO_EXPRESS_PASSWORD=pass
```

#### 2. To run the application:
```bash
    docker-compose up
```

#### 3. View the application page
```bash
    http://localhost:3000/
```

#### 4. To Access the visual database page
```bash
    http://localhost:8080/
```
### Credentials for the visual database page

Username: `admin`
Password: `pass`

# For Production Setup

#### 1. Create a new S3 bucket to store the terrafrom state in aws

#### 2. Create a new Policy to access the S3 bucket needed for terraform
```bash
    {
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:PutObject",
                "s3:GetObject",
                "s3:ListBucket"
            ],
            "Resource": [
                "arn:aws:s3:::YOUR-S3-BUCKET-NAME/*",
                "arn:aws:s3:::YOUR-S3-BUCKET-NAME"
            ]
        }
    ]
}
```

3. Create a new Policy to setup the infrastructure
```bash
    {
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "ec2:CreateVpc",
                "ec2:CreateSubnet",
                "ec2:CreateInternetGateway",
                "ec2:CreateRouteTable",
                "ec2:CreateRoute",
                "ec2:DescribeSecurityGroups",
                "ec2:DescribeSubnets",
                "ec2:DescribeInternetGateways",
                "ec2:DescribeRouteTables",
                "ec2:RunInstances",
                "ec2:DescribeInstances",
                "ec2:AssociateRouteTable",
                "ec2:AssociateAddress",
                "ec2:CreateTags",
                "ec2:DescribeVpcs",
                "ec2:DescribeVpcAttribute",
                "ec2:DeleteVpc",
                "ec2:AttachInternetGateway",
                "ec2:DetachInternetGateway",
                "ec2:DeleteInternetGateway",
                "ec2:CreateSecurityGroup",
                "ec2:DeleteSecurityGroup",
                "ec2:RevokeSecurityGroupEgress",
                "ec2:DescribeNetworkInterfaces",
                "ec2:CreateNetworkInterface",
                "ec2:DeleteNetworkInterface",
                "ec2:DetachNetworkInterface",
                "ec2:AuthorizeSecurityGroupIngress",
                "ec2:AuthorizeSecurityGroupEgress",
                "ec2:DescribeInstanceTypes",
                "ec2:DescribeTags",
                "ec2:DescribeInstanceAttribute",
                "ec2:DescribeVolumes",
                "ec2:DescribeInstanceCreditSpecifications",
                "ec2:TerminateInstances",
                "ec2:DisassociateRouteTable",
                "ec2:DeleteRouteTable",
                "ec2:DeleteSubnet",
                "ec2:StopInstances"
            ],
            "Resource": "*"
        }
    ]
}
```

#### 4. Create a new Role with the two policies attached

#### 5. Create a new Key Pair with name ec2-ssh 

#### 5. Create a new Identity Provider with OpenId Connect

```bash
ProviderURL:token.actions.githubusercontent.com
Audiences:sts.amazonaws.com
```
**Click on Get thumprint and save**

#### 6. Create the following GITHUB secrets
```dotenv
    AWS_BUCKET_KEY_NAME=infra.tfstate
    AWS_BUCKET_NAME=YOUR-S3-BUCKET-NAME
    AWS_REGION=YOUR-REGION
    AWS_ROLE=the ARN of the role that was created with above policies attached
    MAIL_USERNAME=Your email address 
    MAIL_PASSWORD=Your email app password
    EC2_SSH_KEY=The content of the ec2-ssh.pem file
    MONGO_EXPRESS_USERNAME=YOUR-DESIRED-USERNAME
    MONGO_EXPRESS_PASSWORD=YOUR-DESIRED-PASSWORD
```

## Feel free to contribute and raise issues