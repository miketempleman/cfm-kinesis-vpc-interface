
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
  return [data.VpcEndpointId]
}
var BoolProperties = [
];

var NumProperties = [
];

var Delete = CfnLambda.SDKAlias({
  api: ec2,
  method: 'deleteVpcEndpoints',
  keys: 'VpcEndpointIds',
  physicalIdAs: 'VpcEndpointIds', 
  returnPhysicalId: getPhysicalIdDelete
});



exports.handler = CfnLambda({
  Create: Create,
  Update: Update,
  Delete: Delete
});