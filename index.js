var AWS = require('aws-sdk')
var ec2 = new AWS.EC2();

var CfnLambda = require('cfn-lambda');

// CloudFormation sends everything as a String, have to coerce these values.
const numProperties = [
  'confirmationPrompt.maxAttempts',
  'followUpPrompt.prompt.maxAttempts',
  'slots.*.priority',
  'slots.*.valueElicitationPrompt.maxAttempts'
];

function Create(params, reply) {
    console.log("Beginning create. Params="+JSON.stringify(params));
    ec2.createVpcEndpoint(params, function(err, data) {
      if (err)  {
          console.log(err, err.stack); // an error occurred
          return reply(err);
       } else {
            console.log(data);  // successful response
            return reply(null, data.VpcEndpoint);
       }
    });
}

function Update(params, reply) {
    console.log("Updating. Params="+JSON.stringify(params));
    reply("Cannot update vpc interface endpoint")
}

function Delete(params, reply) {
    console.log("Beginning delete. Params="+JSON.stringify(params));
    ec2.deleteVpcEndpoints(params, function(err, data) {
        if (err) {
            console.log(err, err.stack); // an error occurred
            return reply(err);
        } else {
            console.log(data);           // successful response
            return reply(null);
        }
    });
}

exports.handler = CfnLambda({
  Create: Create,
  Update: Update,
  Delete: Delete,
});