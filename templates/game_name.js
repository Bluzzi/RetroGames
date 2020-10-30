const SOCKET = io("http://localhost:3000");

SOCKET.on("connect", function(){
    SOCKET.emit("userID", sessionStorage.getItem("userID"));
    SOCKET.emit("setReady", sessionStorage.getItem("userID"));
});

SOCKET.on("gameData", function(data){

});

SOCKET.on("end", function(_player){
    
});

function send(data){
    SOCKET.emit("gameData", data);
}