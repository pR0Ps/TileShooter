//manages the map

var roomPrefab : GameObject;
var hallPrefab : GameObject;

//stores the room/hall data
private var rooms : GameObject[];
private var roomManagers : RoomManager[];
private var halls : GameObject[];

function Awake(){
	//error checking
	if (roomPrefab == null) Debug.LogError ("Room prefab not assigned in MapManager script");
	if (hallPrefab == null) Debug.LogError ("Hall prefab not assigned in MapManager script");
	
	//declare arrays
	halls = new GameObject[2 * Globals.GAME_DIM * Globals.GAME_DIM - Globals.GAME_DIM];
	rooms = new GameObject[Globals.GAME_DIM * Globals.GAME_DIM];
	roomManagers = new RoomManager[Globals.GAME_DIM * Globals.GAME_DIM];
	
	//scale the hallway to match the room spacing
	hallPrefab.transform.localScale.z = Globals.ROOM_SPACING;
	
	//debug testing
	CreateRoom(0, 0, true, true, false, false);
	CreateRoom(0, 1, true, true, true, false);
	CreateRoom(0, 2, false, true, true, false);
	CreateRoom(1, 0, true, true, false, true);
	CreateRoom(1, 1);
	CreateRoom(1, 2, false, true, true, true);
	CreateRoom(2, 0, true, false, false, true);
	CreateRoom(2, 1, true, false, true, true);
	CreateRoom(2, 2, false, false, true, true);
	CreateRoom(15, 15);
	CreateRoom(15, 14);
	CreateRoom(14, 15);
	CreateRoom(14, 14);
	RefreshHalls(true);
}

function CreateRoom(x : int, y : int){
	//create a random room
	CreateRoom(x, y, Random.value > .5, Random.value > .5, Random.value > .5, Random.value > .5);
}

function CreateRoom(x : int, y : int, n : boolean, e : boolean, s : boolean, w : boolean){
	if (ValidRoom(x, y)){
		//create the room
		rooms[RoomIndex(x, y)] = Instantiate (roomPrefab, Globals.WorldCoords(x, y), Quaternion (0, 0, 0, 0));
		//set up the link to the RoomManager script and set the doors
		roomManagers[RoomIndex(x, y)] = rooms[RoomIndex(x, y)].GetComponent(RoomManager);
		roomManagers[RoomIndex(x, y)].setDoors([n, e, s, w]);
	}
}

//refreshes all the halls
//if force is true, it will destroy all hallways, even ones that should be there
function RefreshHalls(force : boolean){
	//for loop thourgh all rooms
	for (x = 0 ;  x < Globals.GAME_DIM ; x++){
		for (y = 0 ;  y < Globals.GAME_DIM ; y++){
			RefreshHall(x, y, Globals.NORTH, force);
			RefreshHall(x, y, Globals.EAST, force);
		}
	}
}

//looks at a single area and removes/adds a hall if needed
//params:
//x, y, dir are the hallway
//force designates if the function should destroy and create the hallway if it already exists
function RefreshHall(x : int, y : int, dir : int, force : boolean){
	if (ValidHall(x, y, dir)){
		var x2 = x;
		var y2 = y;
		var rot : Quaternion;
		//default to N if dir is invalid (same as ValidHall function)
		if (dir == Globals.EAST) {x2 += 1; rot = Quaternion.Euler(0, 90, 0);}
		else if (dir == Globals.SOUTH) {y2 -= 1; rot = Quaternion.identity;}
		else if (dir == Globals.WEST) {x2 -= 1; rot = Quaternion.Euler(0, 90, 0);}
		else {y2+= 1; rot = Quaternion.identity;}
		
		//both rooms valid and existing
		if (ValidRoom(x, y) && ValidRoom(x2, y2) && rooms[RoomIndex(x, y)] != null && rooms[RoomIndex(x2, y2)] != null){
			if (force){
				Destroy(halls[HallIndex(x, y, dir)]);
			}
			if (halls[HallIndex(x, y, dir)] == null){
				halls[HallIndex(x, y, dir)] = Instantiate (hallPrefab, Globals.WorldCoords((x + x2)/2.0, (y + y2)/2.0), rot);
			}
		}
		else{
			Destroy(halls[HallIndex(x, y, dir)]);
		}
	}
}

//returns the room array index from coords
function RoomIndex (x : int, y : int){
	return x * Globals.GAME_DIM + y;
}

//returns the hall array index from the coords and direction
//params: x and y are room coords, dir is one of N/S/E/W coming off that room
//note: dir defaults to N if not valid
function HallIndex (x : int, y : int, dir : int){
	return
	//x coord
	(x*2 + (dir == Globals.EAST ? 1 : 0) + (dir == Globals.WEST ? -1 : 0))
	//multiplied by the y dimension of array
	* Globals.GAME_DIM +
	//y coord
	(y + (dir == Globals.SOUTH ? -1 : 0));
}

//checks if the hall coords are valid (can get a value where you shouldn't due to 2D ->1D array conversion)
//params: x and y are room coords, dir is one of N/S/E/W coming off that room
//note: dir defaults to N if not valid
function ValidHall (x : int, y : int, dir : int){
	//corrections for direction and 'squishing'
	x = (x*2 + (dir == Globals.EAST ? 1 : 0) + (dir == Globals.WEST ? -1 : 0));
	y += (dir == Globals.SOUTH ? -1 : 0);
	return (x >= 0) && (y >= 0)
	//check x coord
	 && (x < 2 * Globals.GAME_DIM - 1) 
	 //check y and make sure the top row is taken care of (if x is even, the top spot is invalid, decrease limit by one)
	 //note, these indecies are availible in the array but should never be used
	 && (x % 2 == 0 ? y < Globals.GAME_DIM - 1: y < Globals.GAME_DIM);
}

//checks if the room coords are valid (can get a value where you shouldn't due to 2D ->1D array conversion)
function ValidRoom(x : int, y : int){
	return (x >= 0) && (x < Globals.GAME_DIM) && (y >= 0) && (y < Globals.GAME_DIM);
}