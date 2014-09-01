ContactManager.module("ContactsApp.Show",function(Show,ContactManager,Backbone,Marionette,$,_){
	Show.Controller={
		showContact:function(userId){
			if(!ContactManager.ContactsApp.Header.Controller.showContact())
				return false;
			var fechingContact=ContactManager.request("contact:entity",userId);
			$.when(fechingContact).done(function(data){
				var contactView;
				if(data!==undefined){
					var contact = new ContactManager.Entities.Contact(data);
					
					contactView= new Show.Contact({
						model:contact
					});
					contactView.on("contact:edit",function(contact){
						ContactManager.trigger("contact:edit",contact.get("id"));
					});
				}
				else{
					contactView=new Show.MissingContact();
				}
				ContactManager.mainRegion.show(contactView);
			});

		}
	};
});