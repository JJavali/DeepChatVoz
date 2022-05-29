const ipc = require('electron').ipcRenderer;

console.log("DEEP CHAT LIGADO");

window.addEventListener('load', function () {

	const observer = new MutationObserver(function(mutations_list) {
		mutations_list.forEach(function(mutation) {
			mutation.addedNodes.forEach(function(added_node) {
				if(added_node.nodeName == 'YT-LIVE-CHAT-TEXT-MESSAGE-RENDERER') {
					//NOVA MSG - LER				
					const autorNome = added_node.children[1].children[1].children[0].innerText;
					const autorMSG = added_node.children[1].children[2].innerText;
					let isMod = added_node.children[1].children[1].children[0].classList.contains("moderator");
					
					let msgData = {
						nome: autorNome,
						msg: autorMSG,
						isMod: isMod,
					};
	
					ipc.send('invokeAction', msgData);
				}
			});
		});
	});

	observer.observe(items[1], { subtree: false, childList: true });
})


