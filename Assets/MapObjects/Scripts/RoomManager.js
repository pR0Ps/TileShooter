var doorClosedPrefab : GameObject;
var doorOpenPrefab : GameObject;

//rooms preperties
private var doors : boolean[];
private var doorModels : GameObject[];

private var mapManager :  MapManager;


function Awake(){
	//error checking
	if (doorClosedPrefab == null || doorOpenPrefab == null) Debug.LogError ("Door prefabs(s) not assigned in RoomManager script");
	
	//set up the connection to the map manager, and initilize the room
	try mapManager = GameObject.Find("_GameManager").GetComponent(MapManager);
	catch (err) {
		Debug.LogError ("Could not link Rooms to MapManager: " + err);
		Application.Quit();
	}
	doors = new boolean[4];
	doorModels = new GameObject[4];
	setDoors([false, false, false, false]);
}

//refresh the door models
function refreshDoors(){
	for (i = Globals.NORTH ; i <= Globals.WEST ; i++){
		refreshDoor(i);
	}
}
function refreshDoor(door : int){
	if (door > -1 && door < 4){
		Destroy(doorModels[door]);
		doorModels[door] = Instantiate((doors[door] ? doorOpenPrefab : doorClosedPrefab), transform.position + doorPositionOffset(door), doorRotation(door));
	}
}

//returns the position of the door reletive to the centre of the room for each direction
function doorPositionOffset(door : int) : Vector3 {
	if (door == Globals.NORTH) return Vector3.forward * Globals.DOOR_OFFSET;
	if (door == Globals.EAST) return Vector3.right * Globals.DOOR_OFFSET;
	if (door == Globals.SOUTH) return -Vector3.forward * Globals.DOOR_OFFSET;
	if (door == Globals.WEST) return Vector3.left * Globals.DOOR_OFFSET;
	return;
}

//returns the proper rotation of the door for each direction
function doorRotation (door : int) : Quaternion{
	if (door == Globals.NORTH) return Quaternion.identity;
	if (door == Globals.EAST) return Quaternion.Euler(0, 90, 0);
	if (door == Globals.SOUTH) return Quaternion.Euler(0, 180, 0);
	if (door == Globals.WEST) return Quaternion.Euler(0, 270, 0);
	return;
}

//set the state of the doors
function setDoors (arr : boolean[]){
	if (arr.length == 4){
		doors = arr;
		refreshDoors();
	}
}
function setDoor (door : int, open : boolean){
	if (door >= Globals.NORTH && door <= Globals.WEST){
		doors[door] = open;
		refreshDoor(door);
	}
}

//return the state of the doors
function getDoors(){
	return doors;
}
function getDoor (door : int){
	if (door >= Globals.NORTH && door <= Globals.WEST){
		return doors[door];
	}
}