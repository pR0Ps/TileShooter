//global variables and functions of the game


public static var GAME_DIM : int = 16;						//number of rooms is GAME_DIM squared
public static var ROOM_SIZE : float = 20.5;				//the size of the rooms
public static var ROOM_SPACING : float = 4.5;			//the space between the rooms
public static var DOOR_OFFSET : int = 10;						//the distance from the center of the room to the door

//directions, used for doors/hallways
public static var NORTH : int = 0;
public static var EAST : int = 1;
public static var SOUTH : int = 2;
public static var WEST : int = 3;

//converts grid coordinates to world coordinates
public static function WorldCoords(x : float, y : float) : Vector3 {
	return Vector3(x * (ROOM_SIZE + ROOM_SPACING), 0, y * (ROOM_SIZE + ROOM_SPACING));
}

//converts world coordinates to grid coordinates
public static function GridCoords (world : Vector3) : Vector2 {
	return Vector2(Mathf.Floor(world.x / (ROOM_SIZE + ROOM_SPACING)),
						Mathf.Floor(world.z/ (ROOM_SIZE + ROOM_SPACING)));
}