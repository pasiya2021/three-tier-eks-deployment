terraform {
  backend "s3" {
    bucket = "terraform-eks-state-932628061584"  # Your bucket name
    key    = "eks/terraform.tfstate"
    region = "ap-south-1"  # Mumbai region
  }
}