function setCookie(name,value){
	var expiry = new Date(2030,0).toGMTString() // tetris DEATH in 2030
	document.cookie = name + "=" + value + ";" + expiry + ";path=/"
}

function getCookie(name){
	var name = name + "=";
	var sanitizedCookie = decodeURIComponent(document.cookie);
	var cookies = sanitizedCookie.split(";")
	for(var i = 0; i<cookies.length; i++){
		var cookie = cookies[i]
		if(cookie.trim().startsWith(name)){
			return cookie.substring(name.length, cookie.length);
		}
	}
	return "";
}

