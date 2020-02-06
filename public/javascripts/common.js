/*
Cookie wrappers for client-side data store.
 */

function set_cookie(name, value, days) {
	let expires = '';
	if (days) {
		let date = new Date();
		date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
		expires = 'expires=' + date.toUTCString() + '; ';
	}
	document.cookie = name + '=' + (value || '')  + '; ' + expires + '; path=/';
}

function get_cookie(name) {
	let name_equals = name + '=';
	let lines = document.cookie.split(';');
	for (let line of lines) {
		while (line.charAt(0) === ' ')
			line = line.substring(1, line.length);
		if (line.indexOf(name_equals) === 0)
			return line.substring(name_equals.length, line.length);
	}
	return null;
}

function del_cookie(name) {
	document.cookie = name + '=; Max-Age=-99999999;';
}
