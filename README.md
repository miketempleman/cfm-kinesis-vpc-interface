
# cfn-kinesis-vpc-interface


## Purpose

AWS CloudFormation does not support the creation of a vpc interface to kinesis. This is a Lambda-backed custom resource to add support for [vpc interface for kinesis](https://docs.aws.amazon.com/AmazonVPC/latest/UserGuide/vpce-interface.html#create-interface-endpoint/) to CloudFormation.

[This package on GitHub](https://www.github.com/miketempleman/cfn-kinesis-vpc-interface)


## Implementation

This Lambda makes use of the Lambda-Backed CloudFormation Custom Resource flow module, `cfn-lambda` ([GitHub](https://github.com/andrew-templeton/cfn-lambda) / [NPM](https://www.npmjs.com/package/cfn-lambda)).


## Usage
		"KinesisPvtGateway" : {
		  "Type" : "AWS::EC2::VPCEndpoint",
		  "Properties" : {
			"PolicyDocument" : {
			  "Version":"2012-10-17",
			  "Statement":[{
				"Effect":"Allow",
				"Principal": "*",
           		"Action": [
                	"kinesis:CreateStream",
                	"kinesis:DeleteStream",
                	"kinesis:DescribeStream",
                	"kinesis:ListStreams",
                	"kinesis:PutRecord",
                	"kinesis:PutRecords"
            	],
				"Resource": {"Fn::Join" : [{"Ref" : "KinesisStream"}, "/*"]}
			  }]
			},
			"RouteTableIds" : {"Ref" : "RouteTableList"},
			"ServiceName" : { "Fn::Join": [ "", [ "com.amazonaws.", { "Ref": "AWS::Region" }, ".kinesis-streams" ] ] },
			"VpcId" : {"Ref" : "VPCID"}
		  }

    },


## Installation of the Resource Service Lambda

#### Using the Provided Instant Install Script

The way that takes 10 seconds...

    # Have aws CLI installed + permissions for IAM and Lamdba + Vpc
    $ npm install cfn-natgateway cfn-natroute
    $ npm install cfn-lambda cfn-natgateway cfn-natroute
    $ node -e "var r='us-east-1';var c=require('cfn-lambda');c.deploy('cfn-natgateway', r, [r], null);c.deploy('cfn-natroute', r, [r], null);"

You will have this resource installed in the us-east-1 region!


#### Using the AWS Console

... And the way more difficult way.

*IMPORTANT*: With this method, you must install this custom service Lambda in each AWS Region in which you want CloudFormation to be able to access the `Natgateway` custom resource!

1. Go to the AWS Lambda Console Create Function view:
  - [`us-east-1` / N. Virginia](https://console.aws.amazon.com/lambda/home?region=us-east-1#/create?step=2)
  - [`us-west-2` / Oregon](https://console.aws.amazon.com/lambda/home?region=us-west-2#/create?step=2)
  - [`eu-west-1` / Ireland](https://console.aws.amazon.com/lambda/home?region=eu-west-1#/create?step=2)
  - [`ap-northeast-1` / Tokyo](https://console.aws.amazon.com/lambda/home?region=ap-northeast-1#/create?step=2)
2. Zip this repository into `/tmp/Natroute.zip`

    `$ cd $REPO_ROOT && zip -r /tmp/Natroute.zip;`

3. Enter a name in the Name blank. I suggest: `CfnLambdaResouce-Natroute`
4. Enter a Description (optional).
5. Toggle Code Entry Type to "Upload a .ZIP file"
6. Click "Upload", navigate to and select `/tmp/Natroute.zip`
7. Set the Timeout under Advanced Settings to 10 sec
8. Click the Role dropdown then click "Basic Execution Role". This will pop out a new window.
9. Select IAM Role, then select option "Create a new IAM Role"
10. Name the role `lambda_cfn_natroute` (or something descriptive)
11. Click "View Policy Document", click "Edit" on the right, then hit "OK"
12. Copy and paste the [`./execution-policy.json`](./execution-policy.json) document.
13. Hit "Allow". The window will close. Go back to the first window if you are not already there.
14. Click "Create Function". Finally, done! Now go to [Usage](#usage). Next time, stick to the instant deploy script.


#### Miscellaneous

##### License

[MIT](./License)
