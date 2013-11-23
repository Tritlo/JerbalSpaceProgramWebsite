if (Parts.find().count() == 0){
  Parts.insert({
    author: "Tritlo",
    stroke:"#00ff00",
    lineWidth:1,
    currentThrust:0,
    name:"Cockpit",
    mass:0.5,
    fuel:0,
    efficiency:0,
    thrust:0,
    type:"Other",
    outline:[[8,0],[0,16],[24,16],[16,0]],
    attachmentPoints":[[12,0],[12,16]],
    height:16,
    width:24,
    center:[12,8],
    gridCenterOffset:[0,0],
    currentFuel:0,
    radius:24,
    hitBox:[[0,0],[24,16]],
    origOutline:[[8,0],[0,16],[24,16],[16,0]]
    });
  
  Parts.insert({
    author: "Tritlo",
    stroke:"#00ff00",
    lineWidth:1,
    currentThrust:0,
    name:"Fuel Tank",
    mass:0.2,
    fuel:500,
    efficiency:0,
    thrust:0,
    type:"Fuel Tank",
    outline:[[0,0],[0,8],[24,8],[24,0]],
    attachmentPoints:[[12,0],[12,8]],
    height:8,
    width:24,
    center:[12,4],
    gridCenterOffset:[0,0],
    currentFuel:0,
    radius:24,
    hitBox:[[0,0],[24,8]],
    origOutline:[[0,0],[0,8],[24,8],[24,0]]
  });
}