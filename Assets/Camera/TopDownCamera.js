//Keeps the camera above the target, offset by a small distance

var target : Transform;
var maxHeight = 10.0;
var minHeight = 5.0;
var defaultHeight = 7;
var zoomSpeed = 0.1;
var zoomDampener = 0.5;
var horizontalDistance = 1.0;

private var heightVelocity = 0.0;
private var height = 0.0;

function Awake () {
	//Set current position to by "defaultHeight" units above the target, offset backwards by "horizontalDistance"
	transform.position = target.position + Vector3.up * defaultHeight - Vector3.forward * horizontalDistance;
	height = transform.position.y - target.position.y;
	transform.LookAt(target);
}

function LateUpdate () {
	
	//Only set the x and z directly, adjust height with zoom controls
	transform.position.x = target.position.x + Vector3.forward.x * horizontalDistance;
	transform.position.z = target.position.z + Vector3.forward.z * horizontalDistance;
	
	
	// Reduce the height when the user tries to zoom in
	if (Input.GetAxis("Zoom") < 0)
	{
		heightVelocity -= zoomSpeed;

	} else if (Input.GetAxis("Zoom") > 0){
		heightVelocity += zoomSpeed;
	}
	//Dampen the "heightVelocity"
	heightVelocity *= zoomDampener;
	height += heightVelocity;

	//Make sure the camera stays within its bounderies
	clampCameraHeight();
	
	//Actually adjust the height
	transform.position.y = target.position.y + height;
			
	//Point the camera at the target
	transform.LookAt(target);
}

//Ensures that the camera tries to stay within height bounds
function clampCameraHeight(){
	
	if (height > maxHeight){
		heightVelocity -= zoomSpeed * (height - maxHeight); 
	} else if (height < minHeight){
		heightVelocity += zoomSpeed * (minHeight - height); 
	}		
}