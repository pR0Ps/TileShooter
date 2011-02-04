function Update () {
   if (Input.GetAxis("Vertical") != 0 || Input.GetAxis("Horizontal") != 0) {
       animation.CrossFade ("run");
   }
   else {
      animation.CrossFade ("idle");
   }
} 