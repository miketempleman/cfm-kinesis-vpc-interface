var AWS = require('aws-sdk')
var ec2 = new AWS.EC2();

var CfnLambda = require('cfn-lambda');


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

var Update = function(physicalId, params, oldParams, reply) {
    console.log("Updating. Params="+JSON.stringify(params));
    Delete(physicalId, oldParams, reply);
    Create(params, reply);
}

function Delete(physicalId, params, reply) {
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