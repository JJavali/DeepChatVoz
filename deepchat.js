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
					let isOwner = added_node.children[1].children[1].children[0].classList.contains("owner");
					let isMember = added_node.children[1].children[1].children[0].classList.contains("member");
					
					let msgData = {
						nome: autorNome,
						msg: autorMSG,
						isMod: isMod || isOwner || isMember,
					};
					
					if (autorMSG.length > 0) {				
						ipc.send('invokeAction', msgData);
					} else {						
						console.log("Mensagem vazia -> " + autorMSG);
					}
					
				} else if(added_node.nodeName == 'yt-live-chat-paid-message-renderer') {
					//DOAÇAO - SUPER CHAT
					const autorNome = added_node.children[0].children[0].children[4].children[0].children[0].innerText;
					const autorDoacao = added_node.children[0].children[0].children[4].children[0].children[1].innerText;					
					
					console.log("Doaçao -> " + autorNome + " - " + autorDoacao);
					
					let msgData = {
						nome: autorNome,
						msg: autorNome + " fez uma doação de " + autorDoacao,
						isMod: true,
					};
					
					ipc.send('invokeAction', msgData);
				}
			});
		});
	});

	observer.observe(items[1], { subtree: false, childList: true });
})


