ContactManager.module("ContactsApp", function(ContactsApp, ContactManager,Backbone,Marionette,$,_){
	ContactsApp.Router=Marionette.AppRouter.extend({
		appRoutes:{
			"contacts":"listContacts",
			"contacts(/filter/criterion::criterion)": "listContacts",
			"contacts/:id":"showContact",
			"contacts/:id/edit":"editContact",
			"login":"loginContact"
		}
	});

	var API={
		listContacts:function(criterion){
			//console.log("rout to list contacts was triggered");
			ContactsApp.List.Controller.listContacts(criterion);
			ContactsApp.Header.Controller.showContact();
		},
		showContact:function(id){
			ContactsApp.Show.Controller.showContact(id);
			ContactsApp.Header.Controller.showContact();		
		},
		editContact:function(id){
			ContactsApp.Edit.Controller.editContact(id);
		},
		loginContact:function()
		{
			ContactsApp.Login.Controller.showContact();

		}

	};
	ContactManager.on("contacts:list",function(){
		ContactManager.navigate("contacts");
		API.listContacts();
	});
	ContactManager.on("contacts:show",function(id){
		ContactManager.navigate("contacts");
		API.showContact(id);
	});
	ContactManager.on("contact:edit",function(id){
		ContactManager.navigate("contacts/"+id+"/edit");
		API.editContact(id);
	});
	ContactManager.on("login",function(){
		ContactManager.navigate("login");
		API.loginContact();
	});
	ContactManager.on("contacts:filter", function(criterion){
		if(criterion){
		  ContactManager.navigate("contacts/filter/criterion:" + criterion);
		}
		else{
		  ContactManager.navigate("contacts");
		}
	});
	ContactManager.addInitializer(function(){
		new ContactsApp.Router({
			controller:API
		});
	});
});