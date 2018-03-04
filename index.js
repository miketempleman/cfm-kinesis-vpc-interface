
var AWS = require('aws-sdk')
var CfnLambda = require('cfn-lambda');

var ec2 = new AWS.EC2();

var CfnLambda = require('cfn-lambda');


var Update = function(physicalId, params, oldParams, reply) {
    console.log("Updating. Params="+JSON.stringify(params));
    Delete(physicalId, oldParams, reply);
    Create(params, reply);
};

var Create = CfnLambda.SDKAlias({
  api: ec2,
  method: 'createVpcEndpoint',
  forceBools: BoolProperties,
  forceNums: NumProperties,
  keys: ['SubnetIds', 'VpcId', 'VpcEndpointType', 'SecurityGroupIds', 'ServiceName'],
  returnPhysicalId: getPhysicalId
});

function getPhysicalId(data, params) {
  return data.VpcEndpoint.VpcEndpointId
}

function getPhysicalIdDelete(data, params) {
  console.log("data = "+JSON.stringify(data));
  console.log("params="+JSON.stringify(params));
  return [data.VpcEndpointIds]
}
var BoolProperties = [
];

var NumProperties = [
];


var Delete = function (physicalId, params, reply) {
  console.log("physicalid ="+physicalId);
  console.log("params="+JSON.stringify(params));
  ec2.deleteVpcEndpoints({"VpcEndpointIds":[physicalId]}, function(error, data ) {
    if (error && error.statusCode === 404) {
        console.log("During delete endpoint '" + physicalIds + "' was not found. Implicit success assumed");
        return reply();
    }
    
    if (error) {
      console.error("Error deleting '" + physicalId + "'. Delete failed");
      return reply(error);
    }
    
    console.log("Success deleting '" + physicalId +"'");
    return reply();
  });
}



exports.handler = CfnLambda({
  Create: Create,
  Update: Update,
  Delete: Delete
});