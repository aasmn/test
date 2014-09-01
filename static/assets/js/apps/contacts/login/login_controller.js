ContactManager.module("ContactsApp.Login",function(Login,ContactManager,Backbone,Marionette,$,_){
	Login.Controller={
		showContact:function(){
			var newContact = new ContactManager.Entities.Login();
			
			var view=new ContactManager.ContactsApp.Login.Contact({
						model:newContact
					});

			view.on("form:submit",function(data){
				event.preventDefault();

				$.post('/login',data,function(result){
					if(result.message=='ok')
					{
						view.trigger("dialog:close");
						ContactManager.navigate("contacts");
						ContactManager.ContactsApp.List.Controller.listContacts();
						ContactManager.loginUser=new ContactManager.Entities.Contact(result.model);
						ContactManager.ContactsApp.Header.Controller.showContact();
						
					}
					else
					{
						view.loginError(result.message);
					}	
						
				
				},"json");
			
				
			});
			ContactManager.mainRegion.close();
			ContactManager.dialogRegion.show(view);

		}
	};
});