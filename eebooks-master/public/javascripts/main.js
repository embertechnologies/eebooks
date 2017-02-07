var firepad;
function init() {
	var firepadRef = new Firebase("https://eebooks.firebaseio.com/");
	var codeMirror = CodeMirror(document.getElementById("firepad"), {lineWrapping : true });

	//Create a userId to pass to firepad
	var userId = Math.floor(Math.random() * 9999999999).toString();

	firepad = Firepad.fromCodeMirror(firepadRef, codeMirror, {richTextToolbar : true, richTextShortcuts : true, userId: userId});

	var firepadUserList = FirepadUserList.fromDiv(firepadRef.child('users'), document.getElementById('userlist'), userId);
	firepad.on('ready', function() {
		
		if(firepad.isHistoryEmpty()) {
			firepad.setHtml('<span style="font-size: 24px;">Start typing here!</span>');
		}
	});
}

// Helper to get hash from end of URL or generate a random one.
function getExampleRef() {
  var ref = new Firebase('https://eebooks.firebaseio.com');
  var hash = window.location.hash.replace(/#/g, '');
  if (hash) {
    ref = ref.child(hash);
  } else {
    ref = ref.push(); // generate unique location.
    window.location = window.location + '#' + ref.key(); // add it as a hash to the URL.
  }
  if (typeof console !== 'undefined')
    console.log('Firebase data: ', ref.toString());

  return ref;
}


document.getElementById('btn-upload-file').onclick = function() {
	$('#form-upload-file').toggleClass("hidden");
}

document.getElementById('btn-upload-file-submit').onclick = function() {
	$('#form-upload-file').addClass("hidden");
}


// Initialize Firebase

init();
console.log("finished initing");

$('#btn-gen-pdf').on('click', function() {
    console.log('hi');
	var t = firepad.getHtml();
	console.log(t);
	var parameters = {text : t};
    console.log("bout to send");
	$.get('/export-pdf',parameters, function(data) {
		console.log("sent a get " + data);
	});
});
