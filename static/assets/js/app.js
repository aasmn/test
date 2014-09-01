var ContactManager= new Marionette.Application();

ContactManager.addRegions({
	mainRegion:"#main-region",
	headerRegion:"#header-region",
	dialogRegion: Marionette.Region.Dialog.extend({el:"#dialog-region"})
});

ContactManager.loginUser=null;

ContactManager.on("start", function(){
	if(Backbone.history){
		Backbone.history.start();
		
		if(Backbone.history.fragment===""){
			ContactManager.navigate("contacts");
			ContactManager.ContactsApp.List.Controller.listContacts();
			ContactManager.ContactsApp.Header.Controller.showContact();
		}
		
	}
	//ContactManager.ContactsApp.List.Controller.listContacts();
});
ContactManager.navigate = function(route,  options){
  options || (options = {});
  Backbone.history.navigate(route, options);
};
