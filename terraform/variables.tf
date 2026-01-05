variable "cluster_name" {            
  type = string
  default = "my-three-tier-eks"  # Give it a better name
}

variable "cluster_version" {
  type = string  # Changed from number to string
  default = "1.30"  # Latest version
}

variable "region" {
  type = string
  default = "ap-south-1"  # Mumbai, India
}

variable "availability_zones" {
  type = list
  default = ["ap-south-1a", "ap-south-1b"]  # Mumbai zones
}

variable "addons" {
  type = list(object({
    name    = string
    version = string
  }))
  default = [
    {
      name    = "kube-proxy"
      version = "v1.30.0-eksbuild.3"  # Updated
    },
    {
      name    = "vpc-cni"
      version = "v1.18.1-eksbuild.1"  # Updated
    },
    {
      name    = "coredns"
      version = "v1.11.1-eksbuild.4"  # Updated
    },
    {
      name    = "aws-ebs-csi-driver"
      version = "v1.31.0-eksbuild.1"  # Updated
    }
  ]
}